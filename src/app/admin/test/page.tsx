"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import AdminGuard from "@/components/AdminGuard";
import {
  deleteQuizQuestion,
  getAllQuizQuestions,
  upsertQuizQuestion,
  type QuizQuestionRow,
} from "@/lib/data";

type Draft = {
  id?: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation?: string;
  is_active: boolean;
  order_index: number;
};

const emptyDraft: Draft = {
  question: "",
  options: ["", "", "", ""],
  correct_index: 0,
  explanation: "",
  is_active: true,
  order_index: 0,
};

export default function AdminTestPage() {
  const [rows, setRows] = useState<QuizQuestionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      const data = await getAllQuizQuestions();
      setRows(data);
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const canSave = useMemo(() => {
    const opts = (draft.options ?? []).map((s) => s.trim()).filter(Boolean);
    return draft.question.trim().length >= 3 && opts.length >= 2;
  }, [draft]);

  async function onSave() {
    setError("");
    if (!canSave) {
      setError("Моля, добави въпрос и поне 2 опции.");
      return;
    }

    const cleanOptions = (draft.options ?? []).map((s) => s.trim()).filter(Boolean);
    const correct = Math.max(0, Math.min(draft.correct_index, cleanOptions.length - 1));

    try {
      setSaving(true);
      await upsertQuizQuestion({
        id: draft.id,
        question: draft.question.trim(),
        options: cleanOptions,
        correct_index: correct,
        explanation: draft.explanation?.trim() || null,
        is_active: draft.is_active,
        order_index: draft.order_index ?? 0,
      });
      setDraft(emptyDraft);
      await load();
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Грешка при запис.");
    } finally {
      setSaving(false);
    }
  }

  function editRow(q: QuizQuestionRow) {
    setError("");
    setDraft({
      id: q.id,
      question: q.question ?? "",
      options: Array.isArray(q.options) ? [...q.options, "", "", "", ""].slice(0, 4) : ["", "", "", ""],
      correct_index: q.correct_index ?? 0,
      explanation: q.explanation ?? "",
      is_active: q.is_active ?? true,
      order_index: q.order_index ?? 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id: string) {
    if (!confirm("Сигурен ли си, че искаш да изтриеш този въпрос?")) return;
    try {
      await deleteQuizQuestion(id);
      await load();
    } catch (e) {
      console.error(e);
      alert("Грешка при изтриване.");
    }
  }

  return (
    <AdminGuard>
      <Navbar />

      <main className="bg-white text-black">
        <section className="mx-auto max-w-6xl px-6 pt-24 pb-24">
          <h1 className="text-3xl md:text-4xl font-extrabold">Admin: Тест</h1>
          <p className="mt-2 text-black/60">
            Добавяй/редактирай въпроси. Активните се показват на публичната страница <span className="font-semibold">/test</span>.
          </p>

          {/* EDITOR */}
          <div className="mt-8 rounded-3xl border border-black/10 bg-white p-7 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">
                  {draft.id ? "Редакция на въпрос" : "Нов въпрос"}
                </h2>
                <p className="text-sm text-black/60 mt-1">
                  Съвет: ползвай Order index (0,1,2…) за подредба.
                </p>
              </div>

              {draft.id ? (
                <button
                  type="button"
                  onClick={() => setDraft(emptyDraft)}
                  className="rounded-full border border-black/10 px-5 py-2 font-semibold hover:bg-black/[0.03]"
                >
                  Откажи
                </button>
              ) : null}
            </div>

            <div className="mt-6 grid gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Въпрос</label>
                <input
                  value={draft.question}
                  onChange={(e) => setDraft((d) => ({ ...d, question: e.target.value }))}
                  className="w-full rounded-xl border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20"
                  placeholder="Напр. Как се казва „благодаря“ на японски?"
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold">Опции (2–4)</label>
                  <label className="text-sm flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={draft.is_active}
                      onChange={(e) => setDraft((d) => ({ ...d, is_active: e.target.checked }))}
                    />
                    Активен
                  </label>
                </div>

                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 text-sm font-semibold text-black/60">
                      {String.fromCharCode(65 + i)}.
                    </div>
                    <input
                      value={draft.options[i] ?? ""}
                      onChange={(e) =>
                        setDraft((d) => {
                          const next = [...d.options];
                          next[i] = e.target.value;
                          return { ...d, options: next };
                        })
                      }
                      className="flex-1 rounded-xl border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20"
                      placeholder={i < 2 ? "задължително" : "по избор"}
                    />
                    <label className="text-sm flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct"
                        checked={draft.correct_index === i}
                        onChange={() => setDraft((d) => ({ ...d, correct_index: i }))}
                      />
                      вярна
                    </label>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Order index</label>
                  <input
                    type="number"
                    value={draft.order_index}
                    onChange={(e) => setDraft((d) => ({ ...d, order_index: Number(e.target.value || 0) }))}
                    className="w-full rounded-xl border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Обяснение (по избор)</label>
                  <input
                    value={draft.explanation}
                    onChange={(e) => setDraft((d) => ({ ...d, explanation: e.target.value }))}
                    className="w-full rounded-xl border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20"
                    placeholder="Напр. ありがとう (arigatou) = благодаря"
                  />
                </div>
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="rounded-full bg-[#F5C84B] py-4 font-extrabold hover:brightness-95 transition disabled:opacity-60"
              >
                {saving ? "Запис…" : draft.id ? "Запази промените" : "Добави въпрос"}
              </button>
            </div>
          </div>

          {/* LIST */}
          <div className="mt-10">
            <h2 className="text-xl font-bold">Всички въпроси</h2>

            {loading ? (
              <div className="mt-4 rounded-2xl border border-black/10 bg-white p-6 text-black/70">
                Зареждане…
              </div>
            ) : rows.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-black/10 bg-white p-6 text-black/70">
                Няма въпроси. Добави първия отгоре 👆
              </div>
            ) : (
              <div className="mt-4 grid gap-4">
                {rows.map((q) => (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-black/10 bg-white p-5 flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs rounded-full border border-black/10 px-2 py-1 text-black/70">
                          order {q.order_index}
                        </span>
                        {q.is_active ? (
                          <span className="text-xs rounded-full bg-black/[0.06] px-2 py-1">
                            active
                          </span>
                        ) : (
                          <span className="text-xs rounded-full bg-black/[0.03] px-2 py-1 text-black/60">
                            inactive
                          </span>
                        )}
                      </div>

                      <p className="mt-2 font-semibold">{q.question}</p>
                      <p className="mt-2 text-sm text-black/70">
                        {q.options?.map((o, i) => (
                          <span key={i} className="mr-3">
                            <span className="font-semibold">{String.fromCharCode(65 + i)}.</span> {o}
                            {i === q.correct_index ? " ✅" : ""}
                          </span>
                        ))}
                      </p>
                    </div>

                    <div className="shrink-0 flex gap-2">
                      <button
                        onClick={() => editRow(q)}
                        className="rounded-full border border-black/10 px-4 py-2 font-semibold hover:bg-black/[0.03]"
                      >
                        Редактирай
                      </button>
                      <button
                        onClick={() => remove(q.id)}
                        className="rounded-full border border-red-200 px-4 py-2 font-semibold text-red-700 hover:bg-red-50"
                      >
                        Изтрий
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </AdminGuard>
  );
}

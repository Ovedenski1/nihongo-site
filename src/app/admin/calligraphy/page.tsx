"use client";

import { useEffect, useMemo, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { TeacherRow } from "@/lib/data";

const DAY_OPTIONS = [
  "Понеделник",
  "Вторник",
  "Сряда",
  "Четвъртък",
  "Петък",
  "Събота",
  "Неделя",
] as const;

type DayOption = (typeof DAY_OPTIONS)[number];

type FormState = {
  id?: string;
  title: string;
  date: string;

  // ✅ schedule builder
  days: DayOption[];
  start_time: string; // "HH:MM"
  end_time: string; // "HH:MM"

  price: number;

  teacher_id: string;
  description_text: string;
};

const emptyForm: FormState = {
  title: "",
  date: "",
  days: [],
  start_time: "",
  end_time: "",
  price: 0,
  teacher_id: "",
  description_text: "",
};

type Row = {
  id: string;
  title: string;
  date: string;
  schedule_line: string;
  classes_count: number;
  teacher_id: string | null;
  description: string[];
  note: string | null;
  href: string;

  // ✅ add this column in DB
  price: number | null;
};

function buildScheduleLine(days: string[], start: string, end: string) {
  const daysPart = days.join(", ");
  const timePart = start && end ? `${start}–${end}` : start ? start : "";
  return `${daysPart}${timePart ? ` ${timePart}` : ""}`.trim();
}

function parseScheduleLine(schedule: string) {
  const foundDays = DAY_OPTIONS.filter((d) => schedule.includes(d)) as DayOption[];

  const m = schedule.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/);
  const start_time = m?.[1] ?? "";
  const end_time = m?.[2] ?? "";

  return { days: foundDays, start_time, end_time };
}

// ✅ 24h time options (5 min step)
function makeTimeOptions(stepMinutes = 5) {
  const out: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      out.push(`${hh}:${mm}`);
    }
  }
  return out;
}
const TIME_OPTIONS = makeTimeOptions(5);

export default function AdminCalligraphyPage() {
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(emptyForm);
  const isEdit = !!form.id;

  const teacherMap = useMemo(() => {
    const m = new Map<string, string>();
    teachers.forEach((t) => m.set(t.id, t.name));
    return m;
  }, [teachers]);

  async function loadAll() {
    setLoading(true);

    const { data: tData } = await supabase
      .from("teachers")
      .select("id,name,title,image,description")
      .order("created_at", { ascending: false });

    setTeachers((tData ?? []) as TeacherRow[]);

    const { data } = await supabase
      .from("calligraphy_courses")
      .select(
        "id,title,date,schedule_line,classes_count,teacher_id,description,note,href,price"
      )
      .order("date", { ascending: true });

    setRows((data ?? []) as Row[]);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  function resetForm() {
    setForm(emptyForm);
  }

  function fillEdit(r: Row) {
    const parsed = parseScheduleLine(r.schedule_line ?? "");

    setForm({
      id: r.id,
      title: r.title ?? "",
      date: r.date ?? "",
      days: parsed.days,
      start_time: parsed.start_time,
      end_time: parsed.end_time,
      price: Number(r.price ?? 0),
      teacher_id: r.teacher_id ?? "",
      description_text: (r.description ?? []).join("\n\n"),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validate() {
    if (!form.title.trim()) return "Моля, въведете заглавие.";
    if (!form.date) return "Моля, изберете дата.";
    if (!form.teacher_id) return "Моля, изберете преподавател.";

    if (!form.days.length) return "Моля, изберете поне един ден.";
    if (!form.start_time) return "Моля, изберете начален час.";
    if (!form.end_time) return "Моля, изберете краен час.";

    if (!Number.isFinite(form.price) || form.price <= 0)
      return "Моля, въведете цена (по-голяма от 0).";

    if (!form.description_text.trim())
      return "Моля, добавете описание (поне 1 абзац).";

    return null;
  }

  async function save() {
    const err = validate();
    if (err) return alert(err);

    setSaving(true);

    const description = form.description_text
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    const schedule_line = buildScheduleLine(form.days, form.start_time, form.end_time);

    const payload = {
      title: form.title.trim(),
      date: form.date,
      schedule_line,
      teacher_id: form.teacher_id,
      description,

      // ✅ keep DB happy / fixed behavior
      classes_count: 1,
      href: "/contact",
      note: null,

      // ✅ new
      price: Number(form.price),
    };

    const q = form.id
      ? supabase.from("calligraphy_courses").update(payload).eq("id", form.id)
      : supabase.from("calligraphy_courses").insert(payload);

    const { error } = await q;
    if (error) {
      console.error(error);
      alert(error.message);
      setSaving(false);
      return;
    }

    resetForm();
    await loadAll();
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Да изтрием ли този курс?")) return;
    setDeletingId(id);

    const { error } = await supabase.from("calligraphy_courses").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert(error.message);
    }

    setDeletingId(null);
    await loadAll();
  }

  function toggleDay(day: DayOption) {
    setForm((p) => {
      const has = p.days.includes(day);
      const days = has ? p.days.filter((d) => d !== day) : [...p.days, day];
      return { ...p, days };
    });
  }

  const schedulePreview = buildScheduleLine(form.days, form.start_time, form.end_time);

  return (
    <AdminGuard>
      <Navbar />

      <main className="min-h-screen bg-white text-black overflow-x-hidden">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Калиграфия</h1>
              <p className="mt-2 text-black/60">
                Добавяне, редакция и изтриване на курсове по калиграфия.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin"
                className="h-10 px-4 rounded-xl border border-black/10 hover:bg-black/5 text-sm font-medium inline-flex items-center"
              >
                ← Назад към Админ
              </Link>

              {isEdit ? (
                <button
                  onClick={resetForm}
                  className="h-10 px-4 rounded-xl border border-black/10 hover:bg-black/5 text-sm font-medium"
                >
                  Нов курс
                </button>
              ) : null}
            </div>
          </div>

          {/* EDITOR */}
          <div className="mt-10 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">{isEdit ? "Редакция" : "Добави курс"}</h2>

            <div className="mt-6 grid gap-4">
              <div>
                <label className="text-xs font-semibold text-black/60">Заглавие</label>
                <input
                  className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-black/60">Дата (за badge)</label>
                  <input
                    className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-black/60">Цена (лв.)</label>
                  <input
                    className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                    type="number"
                    min={1}
                    step={1}
                    value={form.price}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, price: Number(e.target.value) }))
                    }
                  />
                </div>
              </div>

              {/* ✅ Schedule builder */}
              <div className="rounded-xl border border-black/10 p-4">
                <div className="text-sm font-semibold">График</div>

                <div className="mt-3">
                  <div className="text-xs font-semibold text-black/60">Дни</div>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {DAY_OPTIONS.map((d) => {
                      const active = form.days.includes(d);
                      return (
                        <label
                          key={d}
                          className={`cursor-pointer select-none inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm
                            ${
                              active
                                ? "border-[var(--kizuna-red)] bg-[var(--kizuna-red)] text-white"
                                : "border-black/15 bg-white text-black hover:bg-black/5"
                            }`}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={active}
                            onChange={() => toggleDay(d)}
                          />
                          {d}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* ✅ 24h selects (always shown as 00:00–23:55) */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-black/60">
                      Начален час (24ч)
                    </label>
                    <select
                      className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4 bg-white"
                      value={form.start_time}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, start_time: e.target.value }))
                      }
                    >
                      <option value="" disabled>
                        Избери час
                      </option>
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-black/60">
                      Краен час (24ч)
                    </label>
                    <select
                      className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4 bg-white"
                      value={form.end_time}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, end_time: e.target.value }))
                      }
                    >
                      <option value="" disabled>
                        Избери час
                      </option>
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 text-sm text-black/70">
                  <span className="font-semibold text-black/60">Preview: </span>
                  <span className="font-semibold">{schedulePreview || "—"}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-black/60">Преподавател</label>
                <select
                  className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4 bg-white"
                  value={form.teacher_id}
                  onChange={(e) => setForm((p) => ({ ...p, teacher_id: e.target.value }))}
                >
                  <option value="" disabled>
                    Избери преподавател
                  </option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-black/60">
                  Описание (абзаци) — по един на нов ред
                </label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-black/15 px-4 py-3 min-h-[140px]"
                  value={form.description_text}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description_text: e.target.value }))
                  }
                />
              </div>

              <button
                onClick={save}
                disabled={saving}
                className="mt-2 h-11 rounded-xl bg-[var(--kizuna-red)] text-white font-semibold hover:opacity-95 disabled:opacity-60"
              >
                {saving ? "Запазване…" : isEdit ? "Запази" : "Добави"}
              </button>

              <p className="text-xs text-black/50">
                * „Запиши се“ линкът е фиксиран към <span className="font-semibold">/contact</span>.
              </p>
            </div>
          </div>

          {/* LIST */}
          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Списък</h2>

            {loading ? (
              <p className="mt-6 text-black/60">Зареждане…</p>
            ) : rows.length === 0 ? (
              <p className="mt-6 text-black/60">Няма добавени курсове.</p>
            ) : (
              <div className="mt-6 divide-y divide-black/10 rounded-xl border border-black/10 overflow-hidden">
                {rows.map((r) => {
                  const teacherName = r.teacher_id
                    ? teacherMap.get(r.teacher_id) ?? "Неизвестен"
                    : "Неизвестен";

                  return (
                    <div key={r.id} className="p-4 bg-white">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="font-semibold">{r.title}</div>
                          <div className="mt-1 text-sm text-black/60">
                            {r.date} · {r.schedule_line}
                          </div>
                          <div className="mt-1 text-sm text-black/60">
                            Цена: {r.price ?? "—"} лв.
                          </div>
                          <div className="mt-1 text-sm text-black/60">
                            Преподавател: {teacherName}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => fillEdit(r)}
                            className="h-9 px-3 rounded-xl border border-black/10 hover:bg-black/5 text-sm font-medium"
                          >
                            Редакция
                          </button>
                          <button
                            onClick={() => remove(r.id)}
                            disabled={deletingId === r.id}
                            className="h-9 px-3 rounded-xl border border-black/10 hover:bg-black/5 text-sm font-medium"
                          >
                            {deletingId === r.id ? "Изтриване…" : "Изтрий"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </AdminGuard>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { TeacherRow } from "@/lib/data";

type FormState = {
  id?: string;
  title: string;
  date: string;
  schedule_line: string;
  classes_count: number;
  teacher_id: string;
  description_text: string;
  note: string;
  href: string;
};

const emptyForm: FormState = {
  title: "",
  date: "",
  schedule_line: "",
  classes_count: 1,
  teacher_id: "",
  description_text: "",
  note: "",
  href: "/pricing",
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
};

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
        "id,title,date,schedule_line,classes_count,teacher_id,description,note,href"
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
    setForm({
      id: r.id,
      title: r.title ?? "",
      date: r.date ?? "",
      schedule_line: r.schedule_line ?? "",
      classes_count: Number(r.classes_count ?? 1),
      teacher_id: r.teacher_id ?? "",
      description_text: (r.description ?? []).join("\n\n"),
      note: r.note ?? "",
      href: r.href ?? "/pricing",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validate() {
    if (!form.title.trim()) return "Моля, въведете заглавие.";
    if (!form.date) return "Моля, изберете дата.";
    if (!form.schedule_line.trim()) return "Моля, въведете график.";
    if (!form.teacher_id) return "Моля, изберете преподавател.";
    if (!form.classes_count || form.classes_count <= 0)
      return "Занятията трябва да са повече от 0.";
    if (!form.description_text.trim())
      return "Моля, добавете описание (поне 1 абзац).";
    if (!form.href.trim()) return "Моля, въведете href.";
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

    const payload = {
      title: form.title.trim(),
      date: form.date,
      schedule_line: form.schedule_line.trim(),
      classes_count: Number(form.classes_count),
      teacher_id: form.teacher_id,
      description,
      note: form.note.trim() || null,
      href: form.href.trim(),
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

    const { error } = await supabase
      .from("calligraphy_courses")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert(error.message);
    }

    setDeletingId(null);
    await loadAll();
  }

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
            <h2 className="text-xl font-semibold">
              {isEdit ? "Редакция" : "Добави курс"}
            </h2>

            <div className="mt-6 grid gap-4">
              <div>
                <label className="text-xs font-semibold text-black/60">
                  Заглавие
                </label>
                <input
                  className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-black/60">
                    Дата (за badge)
                  </label>
                  <input
                    className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, date: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-black/60">
                    Занятия (брой)
                  </label>
                  <input
                    className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                    type="number"
                    min={1}
                    value={form.classes_count}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        classes_count: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-black/60">
                  График (schedule line)
                </label>
                <input
                  className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                  placeholder="Петък, 18:30–19:30"
                  value={form.schedule_line}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, schedule_line: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-black/60">
                  Преподавател
                </label>
                <select
                  className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                  value={form.teacher_id}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, teacher_id: e.target.value }))
                  }
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-black/60">
                    Бележка (optional)
                  </label>
                  <input
                    className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                    value={form.note}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, note: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-black/60">
                    Link за записване (href)
                  </label>
                  <input
                    className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                    value={form.href}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, href: e.target.value }))
                    }
                  />
                </div>
              </div>

              <button
                onClick={save}
                disabled={saving}
                className="mt-2 h-11 rounded-xl bg-[var(--kizuna-red)] text-white font-semibold hover:opacity-95 disabled:opacity-60"
              >
                {saving ? "Запазване…" : isEdit ? "Запази" : "Добави"}
              </button>
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
                            {r.date} · {r.schedule_line} · {r.classes_count} занятия
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

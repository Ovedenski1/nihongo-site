"use client";

import { useEffect, useMemo, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { CourseRow, TeacherRow } from "@/lib/data";

type FormatType = "On-site" | "Online" | "Hybrid";
type LevelType = "Basic" | "N5" | "N4" | "N3" | "N2" | "N1";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

type Day = (typeof DAYS)[number];

type FormState = {
  id?: string;
  title: string;
  level: LevelType; // ✅ NEW
  start_date: string;
  total_hours: number;
  price: number;
  days: Day[];
  time_start: string;
  time_end: string;
  format: FormatType;
  teacher_id: string;
};

const emptyForm: FormState = {
  title: "",
  level: "N5",
  start_date: "",
  total_hours: 0,
  price: 0,
  days: [],
  time_start: "",
  time_end: "",
  format: "On-site",
  teacher_id: "",
};

function timeLabel(h: number, m: number) {
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${hh}:${mm}`;
}

function buildTimeOptions() {
  const out: string[] = [];
  for (let h = 7; h <= 22; h++) {
    out.push(timeLabel(h, 0));
    if (!(h === 22)) out.push(timeLabel(h, 30));
  }
  return out;
}

const TIME_OPTIONS = buildTimeOptions();

function toDayArray(val: unknown): Day[] {
  if (!Array.isArray(val)) return [];
  return val.filter((x) => DAYS.includes(x as any)) as Day[];
}

const DAY_BG: Record<Day, string> = {
  Monday: "Понеделник",
  Tuesday: "Вторник",
  Wednesday: "Сряда",
  Thursday: "Четвъртък",
  Friday: "Петък",
  Saturday: "Събота",
  Sunday: "Неделя",
};

const FORMAT_BG: Record<FormatType, string> = {
  "On-site": "Присъствено",
  Online: "Онлайн",
  Hybrid: "Хибридно",
};

const LEVEL_BG: Record<LevelType, string> = {
  Basic: "Основно ниво",
  N5: "N5",
  N4: "N4",
  N3: "N3",
  N2: "N2",
  N1: "N1",
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(emptyForm);
  const isEdit = !!form.id;

  const teacherMap = useMemo(() => {
    const m = new Map<string, TeacherRow>();
    teachers.forEach((t) => m.set(t.id, t));
    return m;
  }, [teachers]);

  async function loadAll() {
    setLoading(true);

    const { data: tData, error: tErr } = await supabase
      .from("teachers")
      .select("id,name,title,image,description")
      .order("created_at", { ascending: false });

    if (tErr) {
      console.error(tErr);
      setTeachers([]);
    } else {
      setTeachers((tData ?? []) as TeacherRow[]);
    }

    const { data: cData, error: cErr } = await supabase
      .from("courses")
      .select(
        "id,title,level,start_date,total_hours,price,days,time,format,href,teacher_id"
      )
      .order("start_date", { ascending: true });

    if (cErr) {
      console.error(cErr);
      setCourses([]);
    } else {
      const rows = (cData ?? []) as CourseRow[];
      setCourses(
        rows.map((r) => ({
          ...r,
          teacher: r.teacher_id ? teacherMap.get(r.teacher_id) ?? null : null,
        }))
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCourses((prev) =>
      prev.map((r) => ({
        ...r,
        teacher: r.teacher_id ? teacherMap.get(r.teacher_id) ?? null : null,
      }))
    );
  }, [teacherMap]);

  function fillEdit(r: CourseRow) {
    const raw = (r.time ?? "").trim();
    const normalized = raw.replace("-", "–");
    const parts = normalized.split("–").map((s) => s.trim());

    setForm({
      id: r.id,
      title: r.title ?? "",
      level: ((r.level ?? "N5") as LevelType) ?? "N5",
      start_date: r.start_date ?? "",
      total_hours: Number(r.total_hours ?? 0),
      price: Number(r.price ?? 0),
      days: toDayArray(r.days ?? []),
      time_start: parts[0] ?? "",
      time_end: parts[1] ?? "",
      format: (r.format as FormatType) ?? "On-site",
      teacher_id: r.teacher_id ?? "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(emptyForm);
  }

  function toggleDay(d: Day) {
    setForm((p) => {
      const has = p.days.includes(d);
      return { ...p, days: has ? p.days.filter((x) => x !== d) : [...p.days, d] };
    });
  }

  function validate() {
    if (!form.title.trim()) return "Моля, въведете име на курса.";
    if (!form.level) return "Моля, изберете ниво.";
    if (!form.start_date) return "Моля, изберете начална дата.";
    if (!form.format) return "Моля, изберете формат.";
    if (!form.teacher_id) return "Моля, изберете преподавател.";
    if (!Number(form.total_hours) || Number(form.total_hours) <= 0)
      return "Часовете трябва да са повече от 0.";
    if (form.price == null || Number.isNaN(Number(form.price)))
      return "Моля, въведете цена.";
    if (Number(form.price) < 0) return "Цената не може да е отрицателна.";
    if (!form.days.length) return "Моля, изберете поне един ден.";
    if (!form.time_start || !form.time_end)
      return "Моля, изберете начален и краен час.";
    if (form.time_end <= form.time_start)
      return "Крайният час трябва да е след началния.";
    return null;
  }

  async function save() {
    const validationError = validate();
    if (validationError) {
      alert(validationError);
      return;
    }

    setSaving(true);

    const payload = {
      title: form.title.trim(),
      level: form.level, // ✅
      start_date: form.start_date,
      total_hours: Number(form.total_hours),
      price: Number(form.price),
      days: [...form.days],
      time: `${form.time_start}–${form.time_end}`,
      format: form.format,
      href: "/courses",
      teacher_id: form.teacher_id,
    };

    const q = form.id
      ? supabase.from("courses").update(payload).eq("id", form.id)
      : supabase.from("courses").insert(payload);

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
    const { error } = await supabase.from("courses").delete().eq("id", id);
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
              <h1 className="text-3xl md:text-4xl font-bold">Курсове</h1>
              <p className="mt-2 text-black/60">
                Добавяне, редакция и изтриване на курсове.
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

          {/* EDITOR ON TOP */}
          <div className="mt-10 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">
              {isEdit ? "Редакция на курс" : "Добави курс"}
            </h2>

            <div className="mt-6 grid gap-4">
              <div>
                <label className="text-xs font-semibold text-black/60">
                  Име на курса
                </label>
                <input
                  className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                  placeholder="Japanese N5"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-black/60">
                    Ниво
                  </label>
                  <select
                    className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                    value={form.level}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        level: e.target.value as LevelType,
                      }))
                    }
                  >
                    <option value="Basic">Основно ниво</option>
                    <option value="N5">N5</option>
                    <option value="N4">N4</option>
                    <option value="N3">N3</option>
                    <option value="N2">N2</option>
                    <option value="N1">N1</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-black/60">
                    Начална дата
                  </label>
                  <input
                    className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                    type="date"
                    value={form.start_date}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, start_date: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-black/60">
                    Формат
                  </label>
                  <select
                    className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                    value={form.format}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        format: e.target.value as FormatType,
                      }))
                    }
                  >
                    <option value="On-site">Присъствено</option>
                    <option value="Online">Онлайн</option>
                    <option value="Hybrid">Хибридно</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-black/60">
                    Часове
                  </label>
                  <input
                    className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                    type="number"
                    min={1}
                    placeholder="30"
                    value={form.total_hours}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        total_hours: Number(e.target.value),
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-black/60">
                    Цена (€)
                  </label>
                  <input
                    className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                    type="number"
                    min={0}
                    placeholder="15"
                    value={form.price}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, price: Number(e.target.value) }))
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
              </div>

              {/* DAYS */}
              <div>
                <label className="text-xs font-semibold text-black/60">Дни</label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DAYS.map((d) => {
                    const checked = form.days.includes(d);
                    return (
                      <button
                        type="button"
                        key={d}
                        onClick={() => toggleDay(d)}
                        className={`h-10 rounded-xl border px-3 text-sm text-left transition
                          ${
                            checked
                              ? "border-black/30 bg-black/[0.04]"
                              : "border-black/10 hover:bg-black/[0.03]"
                          }`}
                      >
                        {DAY_BG[d]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TIME */}
              <div>
                <label className="text-xs font-semibold text-black/60">Час</label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-black/50">Начало</div>
                    <select
                      className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                      value={form.time_start}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, time_start: e.target.value }))
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
                    <div className="text-xs text-black/50">Край</div>
                    <select
                      className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                      value={form.time_end}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, time_end: e.target.value }))
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
              </div>

              <button
                onClick={save}
                disabled={saving}
                className="mt-2 h-11 rounded-xl bg-[var(--kizuna-red)] text-white font-semibold hover:opacity-95 disabled:opacity-60"
              >
                {saving
                  ? "Запазване…"
                  : isEdit
                  ? "Запази промените"
                  : "Добави курс"}
              </button>
            </div>
          </div>

          {/* LIST BELOW */}
          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Списък с курсове</h2>

            {loading ? (
              <p className="mt-6 text-black/60">Зареждане…</p>
            ) : courses.length === 0 ? (
              <p className="mt-6 text-black/60">Няма добавени курсове.</p>
            ) : (
              <div className="mt-6 divide-y divide-black/10 rounded-xl border border-black/10 overflow-hidden">
                {courses.map((c) => {
                  const teacherName =
                    c.teacher_id
                      ? teachers.find((t) => t.id === c.teacher_id)?.name ??
                        "Неизвестен"
                      : "Неизвестен";

                  const lvl = ((c.level ?? "N5") as LevelType) ?? "N5";

                  return (
                    <div key={c.id} className="p-4 bg-white">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="font-semibold">{c.title}</div>
                          <div className="mt-1 text-sm text-black/60">
                            {LEVEL_BG[lvl]} · {c.start_date} ·{" "}
                            {FORMAT_BG[(c.format as FormatType) ?? "On-site"]} ·{" "}
                            {c.total_hours}ч · {c.price}€
                          </div>
                          <div className="mt-1 text-sm text-black/60">
                            {(c.days ?? [])
                              .map((d) => DAY_BG[d as Day] ?? d)
                              .join(" · ")}
                            {c.time ? ` · ${c.time}` : ""}
                          </div>
                          <div className="mt-1 text-sm text-black/60">
                            Преподавател: {teacherName}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => fillEdit(c)}
                            className="h-9 px-3 rounded-xl border border-black/10 hover:bg-black/5 text-sm font-medium"
                          >
                            Редакция
                          </button>
                          <button
                            onClick={() => remove(c.id)}
                            disabled={deletingId === c.id}
                            className="h-9 px-3 rounded-xl border border-black/10 hover:bg-black/5 text-sm font-medium"
                          >
                            {deletingId === c.id ? "Изтриване…" : "Изтрий"}
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

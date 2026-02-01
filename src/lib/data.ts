// src/lib/data.ts
import { supabase } from "@/lib/supabaseClient";

export type TeacherRow = {
  id: string;
  name: string;
  title: string | null;
  image: string;
  description: string | null;
};

export type CourseLevel = "Basic" | "N5" | "N4" | "N3" | "N2" | "N1";

export type CourseRow = {
  id: string;
  title: string;
  level: CourseLevel;
  start_date: string;
  total_hours: number;
  price: number;
  days: string[] | null;
  time: string | null;
  format: "On-site" | "Online" | "Hybrid";
  href: string | null;
  teacher_id: string | null;
  teacher: TeacherRow | null;
};

/** Normalize DB value to storage object name inside bucket */
function normalizeTeacherObjectName(imageValue: string) {
  const v = (imageValue ?? "").trim();
  if (!v) return "";

  const idx = v.indexOf("/teachers/");
  if (idx !== -1) return v.slice(idx + "/teachers/".length);

  if (v.startsWith("teachers/")) return v.replace(/^teachers\//, "");

  return v;
}

async function signTeacherImage(imageValue: string) {
  const objectName = normalizeTeacherObjectName(imageValue);
  if (!objectName) return "";

  const { data, error } = await supabase.storage
    .from("teachers")
    .createSignedUrl(objectName, 60 * 60);

  if (error) {
    console.error("createSignedUrl error:", error);
    return "";
  }
  return data.signedUrl;
}

export async function getTeachers(): Promise<TeacherRow[]> {
  const { data, error } = await supabase
    .from("teachers")
    .select("id,name,title,image,description")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as TeacherRow[];

  const signed = await Promise.all(
    rows.map(async (t) => {
      const signedUrl = await signTeacherImage(t.image);
      return { ...t, image: signedUrl || "" };
    })
  );

  return signed;
}

export async function getCourses(): Promise<CourseRow[]> {
  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      title,
      level,
      start_date,
      total_hours,
      price,
      days,
      time,
      format,
      href,
      teacher_id,
      teacher:teachers (
        id,
        name,
        title,
        image,
        description
      )
    `
    )
    .order("start_date", { ascending: true });

  if (error) throw error;

  const rows = (data ?? []) as any[];

  const signed = await Promise.all(
    rows.map(async (c) => {
      const teacher = c.teacher
        ? { ...c.teacher, image: await signTeacherImage(c.teacher.image) }
        : null;

      const level = (c.level ?? "N5") as CourseLevel;

      return { ...c, level, teacher } as CourseRow;
    })
  );

  return signed;
}

/**
 * Home: show upcoming; if none exist -> show most recent by start_date (descending)
 */
export async function getHomeCourses(limit = 6): Promise<CourseRow[]> {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const iso = `${yyyy}-${mm}-${dd}`;

  // 1) upcoming first
  let { data, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      title,
      level,
      start_date,
      total_hours,
      price,
      days,
      time,
      format,
      href,
      teacher_id,
      teacher:teachers (
        id,
        name,
        title,
        image,
        description
      )
    `
    )
    .gte("start_date", iso)
    .order("start_date", { ascending: true })
    .limit(limit);

  if (error) throw error;

  // 2) fallback: most recent if no upcoming
  if (!data || data.length === 0) {
    const res = await supabase
      .from("courses")
      .select(
        `
        id,
        title,
        level,
        start_date,
        total_hours,
        price,
        days,
        time,
        format,
        href,
        teacher_id,
        teacher:teachers (
          id,
          name,
          title,
          image,
          description
        )
      `
      )
      .order("start_date", { ascending: false })
      .limit(limit);

    if (res.error) throw res.error;
    data = res.data ?? [];
  }

  const rows = (data ?? []) as any[];

  const signed = await Promise.all(
    rows.map(async (c) => {
      const teacher = c.teacher
        ? { ...c.teacher, image: await signTeacherImage(c.teacher.image) }
        : null;

      const level = (c.level ?? "N5") as CourseLevel;

      return { ...c, level, teacher } as CourseRow;
    })
  );

  return signed;
}

/** -------------------- CALLIGRAPHY COURSES -------------------- **/

export type CalligraphyCourseRow = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  schedule_line: string;
  classes_count: number;

  // ✅ RESTORED (like your “before update” version)
  price: number | null;

  teacher_id: string | null;
  description: string[];
  note: string | null;
  href: string;
  teacher: TeacherRow | null;
};

export async function getCalligraphyCourses(): Promise<CalligraphyCourseRow[]> {
  const { data, error } = await supabase
    .from("calligraphy_courses")
    .select(
      `
      id,
      title,
      date,
      schedule_line,
      classes_count,
      price,
      teacher_id,
      description,
      note,
      href,
      teacher:teachers (
        id,
        name,
        title,
        image,
        description
      )
    `
    )
    .order("date", { ascending: true });

  if (error) throw error;

  const rows = (data ?? []) as any[];

  const signed = await Promise.all(
    rows.map(async (c) => {
      const teacher = c.teacher
        ? { ...c.teacher, image: await signTeacherImage(c.teacher.image) }
        : null;

      return { ...c, teacher } as CalligraphyCourseRow;
    })
  );

  return signed;
}

/** -------------------- NEWS -------------------- **/

export type NewsRow = {
  id: string;
  slug: string;
  title: string | null;
  content: string | null;
  created_at: string | null;
  image: string | null;
};

export async function getNews(limit?: number): Promise<NewsRow[]> {
  let q = supabase
    .from("news")
    .select("id,slug,title,content,created_at,image")
    .order("created_at", { ascending: false });

  if (typeof limit === "number") q = q.limit(limit);

  const { data, error } = await q;
  if (error) throw error;

  return (data ?? []) as NewsRow[];
}

export async function getNewsBySlug(slug: string): Promise<NewsRow | null> {
  const { data, error } = await supabase
    .from("news")
    .select("id,slug,title,content,created_at,image")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as NewsRow | null;
}

export async function getMoreNews(params: {
  excludeSlug?: string;
  limit?: number;
}): Promise<NewsRow[]> {
  const { excludeSlug, limit = 10 } = params;

  let q = supabase
    .from("news")
    .select("id,slug,title,content,created_at,image")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (excludeSlug) q = q.neq("slug", excludeSlug);

  const { data, error } = await q;
  if (error) throw error;

  return (data ?? []) as NewsRow[];
}

/** -------------------- QUIZ / TEST -------------------- **/

export type QuizQuestionRow = {
  id: string;
  question: string;
  options: string[]; // stored as jsonb in DB
  correct_index: number;
  explanation?: string | null;
  is_active: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
};

function normalizeQuizRow(q: any): QuizQuestionRow {
  return {
    id: q.id,
    question: q.question ?? "",
    options: Array.isArray(q.options) ? q.options : [],
    correct_index: typeof q.correct_index === "number" ? q.correct_index : 0,
    explanation: q.explanation ?? null,
    is_active: !!q.is_active,
    order_index: typeof q.order_index === "number" ? q.order_index : 0,
    created_at: q.created_at,
    updated_at: q.updated_at,
  };
}

/** Public: only active questions (ordered) */
export async function getActiveQuizQuestions(): Promise<QuizQuestionRow[]> {
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("id,question,options,correct_index,explanation,is_active,order_index")
    .eq("is_active", true)
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map(normalizeQuizRow);
}

/** Admin: all questions */
export async function getAllQuizQuestions(): Promise<QuizQuestionRow[]> {
  const { data, error } = await supabase
    .from("quiz_questions")
    .select(
      "id,question,options,correct_index,explanation,is_active,order_index,created_at,updated_at"
    )
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map(normalizeQuizRow);
}

/** Admin: create or update */
export async function upsertQuizQuestion(
  input: Partial<QuizQuestionRow> & {
    question: string;
    options: string[];
    correct_index: number;
  }
): Promise<QuizQuestionRow> {
  const payload = {
    id: input.id,
    question: input.question,
    options: input.options,
    correct_index: input.correct_index,
    explanation: input.explanation ?? null,
    is_active: input.is_active ?? true,
    order_index: input.order_index ?? 0,
  };

  const { data, error } = await supabase
    .from("quiz_questions")
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;

  return normalizeQuizRow(data);
}

/** Admin: delete */
export async function deleteQuizQuestion(id: string): Promise<void> {
  const { error } = await supabase.from("quiz_questions").delete().eq("id", id);
  if (error) throw error;
}

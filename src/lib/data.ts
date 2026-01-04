// src/lib/data.ts
import { supabase } from "@/lib/supabaseClient";

export type TeacherRow = {
  id: string;
  name: string;
  title: string | null;
  image: string;
  description: string | null;
};

export type CourseRow = {
  id: string;
  title: string;
  start_date: string;
  total_hours: number;
  price: number;
  days: string[] | null;
  time: string | null;
  format: "On-site" | "Online" | "Hybrid";
  href: string | null;
  teacher_id: string | null;
  teacher: {
    id: string;
    name: string;
    title: string | null;
    image: string;
    description: string | null;
  } | null;
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

      return { ...c, teacher } as CourseRow;
    })
  );

  return signed;
}

export async function getHomeCourses(limit = 6): Promise<CourseRow[]> {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const iso = `${yyyy}-${mm}-${dd}`;

  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      title,
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

  const rows = (data ?? []) as any[];

  const signed = await Promise.all(
    rows.map(async (c) => {
      const teacher = c.teacher
        ? { ...c.teacher, image: await signTeacherImage(c.teacher.image) }
        : null;

      return { ...c, teacher } as CourseRow;
    })
  );

  return signed;
}

/** -------------------- NEWS -------------------- **/

export type NewsRow = {
  id: string;
  slug: string; // ✅ NEW
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

// src/app/admin/teachers/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import type { TeacherRow } from "@/lib/data";

type FormState = {
  id?: string;
  name: string;
  title: string;
  image: string; // store storage path "<file>" OR legacy full url
  description: string;
};

const emptyForm: FormState = {
  name: "",
  title: "",
  image: "",
  description: "",
};

function extFromFileName(name: string) {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "png";
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "T";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

/**
 * Accepts either:
 * - "https://.../storage/v1/object/public/teachers/<file>"
 * - "<file>"
 * - "teachers/<file>"
 * and returns "<file>"
 */
function normalizeStoredPath(imageValue: string) {
  const v = (imageValue ?? "").trim();
  if (!v) return "";

  const idx = v.indexOf("/teachers/");
  if (idx !== -1) return v.slice(idx + "/teachers/".length);

  if (v.startsWith("teachers/")) return v.replace(/^teachers\//, "");

  return v;
}

async function getSignedUrl(filePathInBucket: string) {
  const { data, error } = await supabase.storage
    .from("teachers")
    .createSignedUrl(filePathInBucket, 60 * 60);

  if (error) throw error;
  return data.signedUrl;
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [signedMap, setSignedMap] = useState<Record<string, string>>({});
  const [previewSigned, setPreviewSigned] = useState<string>("");

  const isEdit = !!form.id;

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("teachers")
      .select("id,name,title,image,description")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setTeachers([]);
      setLoading(false);
      return;
    }

    const rows = (data ?? []) as TeacherRow[];
    setTeachers(rows);
    setLoading(false);

    try {
      const entries = await Promise.all(
        rows.map(async (t) => {
          const path = normalizeStoredPath(t.image);
          if (!path) return [t.id, ""] as const;
          const url = await getSignedUrl(path);
          return [t.id, url] as const;
        })
      );

      const next: Record<string, string> = {};
      for (const [id, url] of entries) next[id] = url;
      setSignedMap(next);
    } catch (e) {
      console.error(e);
      setSignedMap({});
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    (async () => {
      const path = normalizeStoredPath(form.image);
      if (!path) {
        setPreviewSigned("");
        return;
      }
      try {
        const url = await getSignedUrl(path);
        setPreviewSigned(url);
      } catch (e) {
        console.error(e);
        setPreviewSigned("");
      }
    })();
  }, [form.image]);

  function fillEdit(t: TeacherRow) {
    setForm({
      id: t.id,
      name: t.name,
      title: t.title ?? "",
      image: t.image ?? "",
      description: t.description ?? "",
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(emptyForm);
    setPreviewSigned("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onUploadPhoto(file: File) {
    try {
      setUploading(true);

      const ext = extFromFileName(file.name);
      const objectName = `${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("teachers")
        .upload(objectName, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || "image/*",
        });

      if (upErr) throw upErr;

      setForm((p) => ({ ...p, image: objectName }));

      const signed = await getSignedUrl(objectName);
      setPreviewSigned(signed);
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? "Неуспешно качване");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      title: form.title.trim() || null,
      image: normalizeStoredPath(form.image),
      description: form.description.trim() || null,
    };

    if (!payload.name) {
      alert("Името е задължително.");
      setSaving(false);
      return;
    }
    if (!payload.image) {
      alert("Снимката е задължителна. Качете снимка.");
      setSaving(false);
      return;
    }

    const q = form.id
      ? supabase.from("teachers").update(payload).eq("id", form.id)
      : supabase.from("teachers").insert(payload);

    const { error } = await q;
    if (error) {
      console.error(error);
      alert(error.message);
      setSaving(false);
      return;
    }

    resetForm();
    await load();
    setSaving(false);
  }

  async function removeTeacher(id: string) {
    if (
      !confirm(
        "Да изтрием ли този преподавател? Курсовете, които го използват, ще станат „TBA“."
      )
    )
      return;

    setDeletingId(id);
    const { error } = await supabase.from("teachers").delete().eq("id", id);
    if (error) {
      console.error(error);
      alert(error.message);
    }
    setDeletingId(null);
    await load();
  }

  const previewInitials = useMemo(
    () => initials(form.name || "Teacher"),
    [form.name]
  );

  return (
    <AdminGuard>
      <Navbar />

      <main className="min-h-screen bg-white text-black overflow-x-hidden">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Преподаватели</h1>
              <p className="mt-2 text-black/60">
                Добавяне, редакция и изтриване на преподаватели.
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
                  type="button"
                  onClick={resetForm}
                  className="h-10 px-4 rounded-xl border border-black/10 hover:bg-black/5 text-sm font-medium"
                >
                  Нов преподавател
                </button>
              ) : null}
            </div>
          </div>

          {/* EDITOR ON TOP */}
          <div className="mt-10 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">
              {isEdit ? "Редакция на преподавател" : "Добави преподавател"}
            </h2>

            {/* preview + upload */}
            <div className="mt-6 flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden border border-black/10 bg-black/5 grid place-items-center">
                {previewSigned ? (
                  <Image
                    src={previewSigned}
                    alt={form.name || "Teacher photo"}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <span className="text-sm font-bold text-black/60">
                    {previewInitials}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void onUploadPhoto(f);
                  }}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="h-10 px-4 rounded-xl border border-black/15 hover:bg-black/5 text-sm font-semibold disabled:opacity-60"
                >
                  {uploading ? "Качване…" : "Качи снимка"}
                </button>

                <div className="text-xs text-black/50">
                  Използваме подписани (signed) URL адреси автоматично.
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <div>
                <label className="text-xs font-semibold text-black/60">
                  Име
                </label>
                <input
                  className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                  placeholder="Yuki Tanaka"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-black/60">
                  Титла (по желание)
                </label>
                <input
                  className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                  placeholder="JLPT N5–N3"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-black/60">
                  Описание (по желание)
                </label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-black/15 px-4 py-3 h-40 overflow-y-auto resize-none"
                  placeholder="Кратко представяне…"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </div>

              <button
                type="button"
                onClick={save}
                disabled={saving || uploading}
                className="mt-2 h-11 rounded-xl bg-[var(--kizuna-red)] text-white font-semibold hover:opacity-95 disabled:opacity-60"
              >
                {saving
                  ? "Запазване…"
                  : isEdit
                  ? "Запази промените"
                  : "Добави преподавател"}
              </button>
            </div>
          </div>

          {/* LIST BELOW */}
          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Списък с преподаватели</h2>

            {loading ? (
              <p className="mt-6 text-black/60">Зареждане…</p>
            ) : teachers.length === 0 ? (
              <p className="mt-6 text-black/60">Няма добавени преподаватели.</p>
            ) : (
              <div className="mt-6 divide-y divide-black/10 rounded-xl border border-black/10 overflow-hidden">
                {teachers.map((t) => {
                  const signed = signedMap[t.id] || "";
                  const ini = initials(t.name);

                  return (
                    <div key={t.id} className="p-4 bg-white">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="relative h-12 w-12 rounded-full overflow-hidden border border-black/10 bg-black/5 grid place-items-center shrink-0">
                            {signed ? (
                              <Image
                                src={signed}
                                alt={t.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <span className="text-xs font-bold text-black/60">
                                {ini}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="font-semibold">{t.name}</div>
                            {t.title ? (
                              <div className="text-sm text-black/60">
                                {t.title}
                              </div>
                            ) : null}
                            {t.description ? (
                              <div className="mt-2 text-sm text-black/60">
                                {t.description}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fillEdit(t)}
                            className="h-9 px-3 rounded-xl border border-black/10 hover:bg-black/5 text-sm font-medium"
                          >
                            Редакция
                          </button>

                          <button
                            type="button"
                            onClick={() => removeTeacher(t.id)}
                            disabled={deletingId === t.id}
                            className="h-9 px-3 rounded-xl border border-black/10 hover:bg-black/5 text-sm font-medium"
                          >
                            {deletingId === t.id ? "Изтриване…" : "Изтрий"}
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

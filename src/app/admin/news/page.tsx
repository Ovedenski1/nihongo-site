// src/app/admin/news/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { NewsRow } from "@/lib/data";

type FormState = {
  id?: string;
  title: string;
  content: string;
  image: string; // public url stored in DB
};

const emptyForm: FormState = { title: "", content: "", image: "" };

function getExt(fileName: string) {
  const parts = fileName.split(".");
  const ext = parts.length > 1 ? parts.pop() : "png";
  return (ext ?? "png").toLowerCase();
}

function formatDate(val?: string | null) {
  if (!val) return "";
  const d = new Date(val);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("bg-BG");
}

export default function AdminNewsPage() {
  const [items, setItems] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(emptyForm);
  const isEdit = !!form.id;

  const fileRef = useRef<HTMLInputElement | null>(null);

  async function loadAll() {
    setLoading(true);

    const { data, error } = await supabase
      .from("news")
      .select("id,title,content,created_at,image")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setItems([]);
    } else {
      setItems((data ?? []) as NewsRow[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  function resetForm() {
    setForm(emptyForm);
    if (fileRef.current) fileRef.current.value = "";
  }

  function fillEdit(n: NewsRow) {
    setForm({
      id: n.id,
      title: n.title ?? "",
      content: n.content ?? "",
      image: (n as any).image ?? "",
    });
    if (fileRef.current) fileRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validate() {
    if (!form.title.trim()) return "Моля, въведете заглавие.";
    if (!form.content.trim()) return "Моля, въведете съдържание.";
    return null;
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const ext = getExt(file.name);
      const objectName = `${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("news")
        .upload(objectName, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || "image/*",
        });

      if (upErr) throw upErr;

      const { data } = supabase.storage.from("news").getPublicUrl(objectName);
      setForm((p) => ({ ...p, image: data.publicUrl }));

      if (fileRef.current) fileRef.current.value = "";
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? "Неуспешно качване");
    } finally {
      setUploading(false);
    }
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
      content: form.content.trim(),
      image: form.image ? form.image.trim() : null,
    };

    const q = form.id
      ? supabase.from("news").update(payload).eq("id", form.id)
      : supabase.from("news").insert(payload);

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
    if (!confirm("Да изтрием ли тази новина?")) return;

    setDeletingId(id);

    const { error } = await supabase.from("news").delete().eq("id", id);

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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Новини</h1>
              <p className="mt-2 text-black/60">
                Добавяне, редакция и изтриване на новини.
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
                  Нова новина
                </button>
              ) : null}
            </div>
          </div>

          {/* EDITOR ON TOP */}
          <div className="mt-10 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">
                {isEdit ? "Редакция на новина" : "Добави новина"}
              </h2>

              <div className="text-xs text-black/45">
                {form.content.length} символа
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <div>
                <label className="text-xs font-semibold text-black/60">
                  Заглавие
                </label>
                <input
                  className="mt-1 h-11 w-full rounded-xl border border-black/15 px-4"
                  placeholder="Ново съобщение"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-black/60">
                  Съдържание
                </label>

                <textarea
                  className="mt-1 w-full rounded-xl border border-black/15 px-4 py-3
                             h-48 overflow-y-auto resize-none"
                  placeholder="Напишете текста…"
                  value={form.content}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, content: e.target.value }))
                  }
                />
              </div>

              {/* IMAGE */}
              <div>
                <label className="text-xs font-semibold text-black/60">
                  Снимка (по желание)
                </label>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadImage(f);
                  }}
                />

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileRef.current?.click()}
                    className="h-10 px-4 rounded-xl border border-black/15 hover:bg-black/5 text-sm font-semibold disabled:opacity-60"
                  >
                    {uploading
                      ? "Качване…"
                      : form.image
                      ? "Смени снимката"
                      : "Качи снимка"}
                  </button>

                  {form.image ? (
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, image: "" }))}
                      className="h-10 px-4 rounded-xl border border-black/15 hover:bg-black/5 text-sm"
                    >
                      Премахни
                    </button>
                  ) : null}
                </div>

                {form.image ? (
                  <div className="mt-3 rounded-xl border border-black/10 bg-black/[0.03] p-3">
                    <div className="text-xs text-black/50 mb-2">Преглед</div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.image}
                      alt="Преглед на снимка"
                      className="w-full max-h-[240px] object-cover rounded-lg"
                    />
                  </div>
                ) : null}
              </div>

              <button
                onClick={save}
                disabled={saving || uploading}
                className="mt-1 h-11 rounded-xl bg-[var(--kizuna-red)] text-white font-semibold hover:opacity-95 disabled:opacity-60"
              >
                {saving
                  ? "Запазване…"
                  : isEdit
                  ? "Запази промените"
                  : "Добави новина"}
              </button>
            </div>
          </div>

          {/* LIST BELOW */}
          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Списък с новини</h2>

            {loading ? (
              <p className="mt-6 text-black/60">Зареждане…</p>
            ) : items.length === 0 ? (
              <p className="mt-6 text-black/60">Няма добавени новини.</p>
            ) : (
              <div className="mt-6 divide-y divide-black/10 rounded-xl border border-black/10 overflow-hidden">
                {items.map((n) => {
                  const img = (n as any).image as string | undefined;
                  const preview = (n.content ?? "").slice(0, 140);

                  return (
                    <div key={n.id} className="p-4 bg-white">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="font-semibold">{n.title}</div>
                          <div className="mt-1 text-sm text-black/60">
                            {preview}
                            {(n.content ?? "").length > 140 ? "…" : ""}
                          </div>

                          <div className="mt-2 flex items-center gap-3">
                            {img ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={img}
                                alt=""
                                className="h-12 w-20 object-cover rounded-lg border border-black/10"
                              />
                            ) : null}

                            <div className="text-xs text-black/50">
                              {formatDate(n.created_at)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => fillEdit(n)}
                            className="h-9 px-3 rounded-xl border border-black/10 hover:bg-black/5 text-sm font-medium"
                          >
                            Редакция
                          </button>
                          <button
                            onClick={() => remove(n.id)}
                            disabled={deletingId === n.id}
                            className="h-9 px-3 rounded-xl border border-black/10 hover:bg-black/5 text-sm font-medium"
                          >
                            {deletingId === n.id ? "Изтриване…" : "Изтрий"}
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

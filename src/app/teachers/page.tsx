// src/app/teachers/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { getTeachers, type TeacherRow } from "@/lib/data";

function isValidHttpUrl(value?: string | null) {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const rows = await getTeachers();
        if (!alive) return;

        setTeachers(rows);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "Failed to load teachers");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-black">
        {/* HEADER */}
        <section className="border-b border-black/10">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              {/* LEFT */}
              <div>
                <h1 className="text-4xl md:text-5xl font-semibold text-center md:text-left">
                  Teachers
                </h1>

                <p className="mt-3 text-black/60 max-w-2xl text-center md:text-left">
                  Учебен център Инфо България, град Варна предлага иновативно езиково
                  обучение и курсове по английски, немски, испански и руски език, както
                  и български език за чужденци. Уроците са за всички възрасти. Школата е
                  създадена през 2010 година. Учителите са квалифицирани и успешно
                  прилагат нови модели в преподаването, участват в езикови обучения и
                  семинари и организират открити уроци и тържества. Учебен център Инфо
                  България се стреми да предлага качествено езиково обучение,
                  отговарящо на европейските стандарти.
                </p>
              </div>

              {/* RIGHT — TANUKI */}
              <div className="hidden md:flex justify-end">
                <div className="relative w-[260px] h-[260px] opacity-90">
                  <Image
                    src="/images/tanuki4.png"
                    alt="Tanuki"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="mx-auto max-w-6xl px-6 py-10">
          {loading ? (
            <p className="text-black/60">Loading teachers…</p>
          ) : err ? (
            <p className="text-red-600">{err}</p>
          ) : (
            <div className="divide-y divide-black/10">
              {teachers.map((t, idx) => {
                const reversed = idx % 2 === 1;

                const img = isValidHttpUrl(t.image)
                  ? t.image
                  : "/placeholder-teacher.jpg";

                return (
                  <div key={t.id} className="py-10 md:py-14">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                      {/* IMAGE */}
                      <div
                        className={`md:col-span-4 flex justify-center ${
                          reversed ? "md:order-2 md:col-start-9" : ""
                        }`}
                      >
                        <div className="relative h-48 w-48 md:h-56 md:w-56 rounded-full overflow-hidden border border-black/10 bg-black/[0.03]">
                          {/* <img> so remote URLs work without next.config */}
                          <img
                            src={img}
                            alt={t.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      {/* TEXT */}
                      <div
                        className={`md:col-span-8 ${
                          reversed ? "md:order-1" : ""
                        }`}
                      >
                        <h2 className="text-2xl md:text-3xl font-semibold">
                          {t.name}
                        </h2>

                        {t.title ? (
                          <div className="mt-1 text-black/60 font-medium">
                            {t.title}
                          </div>
                        ) : null}

                        {t.description ? (
                          <p className="mt-4 text-black/70 leading-relaxed max-w-xl">
                            {t.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

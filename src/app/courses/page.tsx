// src/app/courses/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import CourseCard, { type CourseItem } from "@/components/CourseCard";
import LevelOverview, { type Level } from "@/components/LevelOverview";
import BookSlider from "@/components/BookSlider";
import WhyChooseKizuna from "@/components/WhyChooseKizuna";
import { supabase } from "@/lib/supabaseClient";
import {
  defaultCoursesConfig,
  type CoursesPageConfig,
} from "@/lib/coursesDefaults";

import { getCourses, type CourseRow } from "@/lib/data";
import { Mail, Phone, MapPin } from "lucide-react";

function mapCourseRowToCourseItem(c: CourseRow): CourseItem {
  return {
    date: c.start_date,
    title: c.title,
    totalHours: c.total_hours,
    price: String(c.price),
    days: c.days ?? [],
    time: c.time ?? undefined,
    format: c.format,
    teacher: {
      name: c.teacher?.name ?? "Предстои да бъде обявен",
      photo: c.teacher?.image ?? "/placeholder-teacher.jpg",
    },
    href: c.href ?? "/courses",
  };
}

export default function CoursesPage() {
  const [config, setConfig] = useState<CoursesPageConfig>(defaultCoursesConfig);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [coursesErr, setCoursesErr] = useState<string | null>(null);

  const [overviewLevel, setOverviewLevel] = useState<Level>("N5");

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("page_configs")
        .select("data")
        .eq("slug", "courses")
        .maybeSingle();

      if (!error && data?.data) {
        setConfig(data.data as CoursesPageConfig);
      }
      setLoadingConfig(false);
    }
    load();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoadingCourses(true);
        setCoursesErr(null);
        const rows = await getCourses();
        setCourses(rows.map(mapCourseRowToCourseItem));
      } catch (e: any) {
        setCoursesErr(e?.message ?? "Неуспешно зареждане на курсовете");
        setCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    })();
  }, []);

  function handleOverviewChange(lvl: Level) {
    setOverviewLevel(lvl);
  }

  // ✅ Filter courses by selected level.
  // Assumption: your DB course titles include the level (N5/N4/etc or Basic).
  // If you have a "level" column in DB later, swap to that.
  const filteredCourses = useMemo(() => {
    const needle = overviewLevel === "Basic" ? "Basic" : overviewLevel; // N5..N1
    return courses.filter((c) => {
      const hay = `${c.title} ${c.href ?? ""}`.toLowerCase();
      return hay.includes(needle.toLowerCase());
    });
  }, [courses, overviewLevel]);

  if (loadingConfig) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white text-black flex items-center justify-center">
          <p className="text-black/60">Зареждане…</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-black">
        <section className="mx-auto max-w-6xl px-6 py-16">
          <WhyChooseKizuna scrollTargetId="courses-cards" data={config.whyChoose} />

          <h1 className="text-3xl md:text-4xl font-bold">{config.pageTitle}</h1>

          <LevelOverview
            level={overviewLevel}
            onChange={handleOverviewChange}
            data={config.levelOverview}
          />

          <BookSlider
            title="Учебници"
            books={config.booksByLevel[overviewLevel] ?? config.booksByLevel.N5}
          />

          <div className="mt-16" id="courses-cards">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-2xl font-semibold">Курсове</h2>
              <span className="text-sm text-black/50">
                {loadingCourses ? "…" : `${filteredCourses.length} курса`}
              </span>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loadingCourses ? (
                <div className="col-span-full rounded-2xl border border-black/10 bg-white p-6 text-black/60">
                  Зареждане на курсовете…
                </div>
              ) : coursesErr ? (
                <div className="col-span-full rounded-2xl border border-red-200 bg-white p-6 text-red-600">
                  {coursesErr}
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-black/10 bg-white p-6 text-black/60">
                  Няма налични курсове за избраното ниво.
                </div>
              ) : (
                filteredCourses.map((course, idx) => (
                  <CourseCard
                    key={`${course.title}-${course.date}-${idx}`}
                    item={course}
                  />
                ))
              )}
            </div>

            {/* CONTACT ROW */}
            <div className="mt-20 flex flex-wrap items-center justify-center gap-16 text-lg font-medium">
              <div className="flex items-center gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
                  <Mail size={22} className="text-white" />
                </div>
                <span>info@kizuna.bg</span>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
                  <Phone size={22} className="text-white" />
                </div>
                <span>+359 000 000 000</span>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
                  <MapPin size={22} className="text-white" />
                </div>
                <span>ул. „Станца“ 19, Варна, България</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

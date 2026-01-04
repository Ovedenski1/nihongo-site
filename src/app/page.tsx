// src/app/page.tsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import LevelsInteractive from "@/components/LevelsInteractive";
import SectionHeader from "@/components/SectionHeader";
import EventCard, { type EventItem } from "@/components/EventCard";
import NewsFeaturedSlider, {
  type FeaturedNewsItem,
} from "@/components/NewsFeaturedSlider";
import TeachersSection, { type TeacherItem } from "@/components/TeachersSection";
import CalligraphyCard from "@/components/CalligraphyCard";

import {
  getHomeCourses,
  getTeachers,
  getNews,
  type CourseRow,
} from "@/lib/data";

type Slide = { title: string; image: string };

// ✅ FIX: days can be null from DB. EventItem expects string[] | undefined.
function mapCourseToEventItem(c: CourseRow): EventItem {
  return {
    date: c.start_date,
    title: c.title,
    days: c.days ?? [],
    time: c.time ?? "",
    totalHours: c.total_hours ?? 0,
    price: c.price != null ? String(c.price) : "0",
  };
}

export default function HomePage() {
  const slides: Slide[] = useMemo(
    () => [
      { title: "Kizuna - Slide 1", image: "/hero/student.jpg" },
      { title: "Kizuna - Slide 2", image: "/hero/student1.jpg" },
      { title: "Kizuna - Slide 3", image: "/hero/student2.jpg" },
      { title: "Kizuna - Slide 4", image: "/hero/student3.jpg" },
    ],
    []
  );

  // ✅ DB NEWS (5 latest)
  const [featuredNews, setFeaturedNews] = useState<FeaturedNewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  const [events, setEvents] = useState<EventItem[]>([]);
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const SLIDE_MS = 3500;

  // HERO slider
  useEffect(() => {
    const onVisibilityChange = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (paused) {
      return () =>
        document.removeEventListener("visibilitychange", onVisibilityChange);
    }

    const id = setInterval(() => {
      setActive((a) => (a + 1) % slides.length);
    }, SLIDE_MS);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [paused, slides.length]);

  // Load courses + teachers from DB
  useEffect(() => {
    (async () => {
      try {
        setLoadingCourses(true);

        const [coursesRows, teachersRows] = await Promise.all([
          getHomeCourses(6),
          getTeachers(),
        ]);

        setEvents(coursesRows.map(mapCourseToEventItem));

        setTeachers(
          teachersRows.map((t) => ({
            name: t.name,
            title: t.title ?? undefined,
            image: t.image ?? "/placeholder-teacher.jpg",
          }))
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingCourses(false);
      }
    })();
  }, []);

  // ✅ Load news from DB
  useEffect(() => {
    (async () => {
      try {
        setLoadingNews(true);
        const rows = await getNews(5);

        setFeaturedNews(
          rows.map((n) => ({
            kicker: undefined,
            title: n.title ?? "Без заглавие",
            dateRange: n.created_at
              ? new Date(n.created_at).toLocaleDateString("bg-BG")
              : "",
            excerpt: (n.content ?? "").slice(0, 120),
            ctaLabel: "Прочети",
            href: "/news",
            image: n.image || "/news/news1.png",
          }))
        );
      } catch (e) {
        console.error(e);
        setFeaturedNews([]);
      } finally {
        setLoadingNews(false);
      }
    })();
  }, []);

  return (
    <main className="min-h-screen text-black overflow-x-clip">
      {/* HERO */}
      <section
        className="hero-shell"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* ✅ UPDATED TOPBAR with dropdown (Курсове does NOT navigate) */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="relative h-10 w-10 sm:h-11 sm:w-11">
              <Image
                src="/logo2.png"
                alt="Kizuna logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="brand-lockup">
              <div className="brand-name">Кизуна</div>
              <div className="brand-sub">Езикова школа по японски език</div>
            </div>
          </div>

          <div className="topbar-right flex items-center gap-4">
  {/* NAV */}
  <nav
    className="
      hidden md:flex items-center gap-6
      text-sm font-semibold text-black
      bg-white/80 backdrop-blur-md
      px-6 py-3
      border border-black/10
      relative
    "
  >
    

    <a
      href="/courses"
      className="hover:text-[var(--kizuna-red)] transition"
    >
      Японски език
    </a>

    <a
      href="/calligraphy"
      className="hover:text-[var(--kizuna-red)] transition"
    >
      Калиграфия
    </a>

    <a
      href="/teachers"
      className="hover:text-[var(--kizuna-red)] transition"
    >
      Екип
    </a>

    <a
      href="/news"
      className="hover:text-[var(--kizuna-red)] transition"
    >
      Новини
    </a>

    <a
      href="/about"
      className="hover:text-[var(--kizuna-red)] transition"
    >
      За нас
    </a>
  </nav>

  {/* APPLY BUTTON */}
  <a className="btn-apply" href="#mission">
    Запиши се
  </a>
</div>

        </header>

        <div className="hero-bg" aria-hidden="true">
          {slides.map((s, i) => (
            <div
              key={s.image}
              className={`hero-bg-slide ${i === active ? "is-active" : ""}`}
            >
              <Image
                src={s.image}
                alt={s.title}
                fill
                priority={i === 0}
                className="object-cover"
              />
            </div>
          ))}
          <div className="hero-bg-dim" />
        </div>

        <div className="hero-center">
          <div>
            <h1 className="hero-title">КИЗУНА</h1>
            <div className="hero-divider" />
            <p className="hero-subtitle">
              Нова глава започва, следва възможност
            </p>
          </div>
        </div>

        <div className="hero-arrow">
          <a
            href="#mission"
            className="h-16 w-16 rounded-full bg-[var(--kizuna-red)] text-white grid place-items-center shadow-lg hover:scale-[1.02] transition"
            aria-label="Scroll to content"
          >
            <span className="text-2xl leading-none">→</span>
          </a>
        </div>
      </section>

      {/* MAROON SECTION */}
      <section id="mission" className="kizuna-maroon-flat">
        <div className="wrap">
          <h2 className="kizuna-maroon-title">
            Искаш да разбереш дали японският ти е в кръвта?
          </h2>

          <p className="kizuna-maroon-text">
            Направи този 5-минутен тест и разбери..
          </p>

          <a className="kizuna-btn" href="#">
            напред към теста
          </a>
        </div>
      </section>

      {/* WHITE SECTION */}
      <section className="kizuna-white">
        <div className="wrap">
          <div className="mt-5">
            <SectionHeader icon="🗓️" title="Предстоящи курсове" />

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingCourses ? (
                <div className="col-span-full rounded-2xl border border-black/10 bg-white p-6 text-black/70">
                  Зареждане на курсовете…
                </div>
              ) : events.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-black/10 bg-white p-6 text-black/70">
                  Няма курсове. Добави курсове от Admin Dashboard и ще се покажат
                  тук автоматично.
                </div>
              ) : (
                events.map((e, idx) => <EventCard key={idx} item={e} />)
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 text-sm text-black/70">
              <a href="/courses" className="hover:text-black">
                → Виж всички курсове
              </a>
            </div>
          </div>

          <div className="mt-16">
            <SectionHeader icon="🔊" title="Новини" />
            <div className="mt-6">
              {loadingNews ? (
                <div className="rounded-2xl border border-black/10 bg-white p-6 text-black/60">
                  Зареждане на новините…
                </div>
              ) : featuredNews.length === 0 ? (
                <div className="rounded-2xl border border-black/10 bg-white p-6 text-black/60">
                  Няма новини.
                </div>
              ) : (
                <NewsFeaturedSlider items={featuredNews} autoMs={6500} />
              )}
            </div>
          </div>
        </div>

        {/* TEACHERS full-bleed */}
        <div className="mt-16 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden bg-black">
          <TeachersSection heading="Екип" teachers={teachers} />
        </div>

        {/* LEVELS full-bleed */}
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#F4F3F2]">
          <div className="wrap py-10 md:py-14 xl:py-16">
            <div className="relative bg-[#F4F3F2] rounded-[28px] py-10 md:py-14 xl:py-16 overflow-visible">
              <div className="relative z-9 mb-10 md:mb-14 xl:mb-20 translate-x-0 xl:translate-x-30">
                <LevelsInteractive />
              </div>

              <Image
                src="/decor/sakura.svg"
                alt=""
                width={500}
                height={500}
                className="pointer-events-none absolute left-[-120px] top-[40px] xl:-left-62 xl:top-[5px] z-20 opacity-95 rotate-2 scale-[0.65] xl:scale-100 hidden xl:block"
              />
              <Image
                src="/decor/sakura.svg"
                alt=""
                width={500}
                height={500}
                className="pointer-events-none absolute left-[-120px] top-[40px] xl:-left-58 xl:top-[2px] z-19 opacity-20 rotate-2 scale-[0.65] xl:scale-100 hidden xl:block"
              />
              <Image
                src="/decor/sakura2.svg"
                alt=""
                width={900}
                height={500}
                className="pointer-events-none absolute right-[-140px] bottom-[0px] xl:-right-52 xl:bottom-[10px] z-10 opacity-95 scale-[0.6] xl:scale-100 hidden xl:block"
              />
              <Image
                src="/decor/sakura2.svg"
                alt=""
                width={900}
                height={500}
                className="pointer-events-none absolute right-[-140px] bottom-[0px] xl:-right-54 xl:bottom-[23px] z-9 opacity-20 scale-[0.6] xl:scale-100 hidden xl:block"
              />

              <div className="relative z-[210] translate-x-0 xl:-translate-x-30">
                <CalligraphyCard />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

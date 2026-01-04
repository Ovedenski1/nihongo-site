"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export type TeacherItem = {
  name: string;
  title?: string;
  image: string;
};

export default function TeachersSection({
  heading = "Teachers",
  teachers,
  autoMs = 5000,
}: {
  heading?: string;
  teachers: TeacherItem[];
  autoMs?: number;
}) {
  const list = teachers ?? [];
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // on mobile/tablet: we show 1 at a time
  const [index, setIndex] = useState(0);
  const canSlide = list.length > 1;

  // ✅ track loaded images so we can fade in (no yellow flash)
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  // seamless loop: append first 1 item
  const renderList = useMemo(() => {
    if (!canSlide) return list;
    return [...list, ...list.slice(0, 1)];
  }, [list, canSlide]);

  const scrollToIndex = (i: number, behavior: ScrollBehavior = "smooth") => {
    const el = scrollerRef.current;
    if (!el) return;

    const card = el.querySelector<HTMLElement>("[data-teacher-card='1']");
    if (!card) return;

    el.scrollTo({ left: i * card.offsetWidth, behavior });
  };

  useEffect(() => {
    if (!canSlide) return;

    const id = window.setInterval(() => {
      setIndex((prev) => prev + 1);
    }, autoMs);

    return () => window.clearInterval(id);
  }, [autoMs, canSlide]);

  useEffect(() => {
    if (!canSlide) return;
    scrollToIndex(index, "smooth");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, canSlide]);

  useEffect(() => {
    if (!canSlide) return;

    if (index >= list.length) {
      const t = window.setTimeout(() => {
        setIndex(0);
        scrollToIndex(0, "auto");
      }, 350);
      return () => window.clearTimeout(t);
    }
  }, [index, list.length, canSlide]);

  useEffect(() => {
    const onResize = () => scrollToIndex(index, "auto");
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <section className="w-full bg-white">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 w-full border-y border-black/10 bg-white">
          {/* LEFT: heading */}
          <div
            className="
              bg-black text-white
              flex items-center justify-center
              px-6 py-6
              min-h-0
              lg:p-12 lg:min-h-[260px]
            "
          >
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight leading-none">
              {heading}
            </h2>
          </div>

          {/* RIGHT: carousel */}
          <div className="lg:col-span-3 relative bg-white">
            <div
              ref={scrollerRef}
              className="
                flex bg-white
                overflow-x-auto lg:overflow-x-hidden
                snap-x snap-mandatory
                scroll-smooth
              "
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {renderList.map((t, idx) => {
                const key = `${t.image}-${t.name}`; // stable key for loaded state
                const isLoaded = !!loaded[key];

                return (
                  <div
                    key={`${t.image}-${idx}`}
                    data-teacher-card="1"
                    className="
                      w-full lg:w-1/3 flex-shrink-0
                      snap-start
                      flex flex-col items-center justify-center gap-4
                      p-10 lg:p-12
                      border-l border-black/10
                      min-h-[260px]
                      bg-white
                    "
                  >
                    {/* ✅ neutral placeholder + fade-in image */}
                    <div className="relative h-44 w-44 rounded-full overflow-hidden bg-black/5">
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        className={`object-cover transition-opacity duration-300 ${
                          isLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        sizes="176px"
                        priority={idx === 0}
                        onLoadingComplete={() =>
                          setLoaded((p) => ({ ...p, [key]: true }))
                        }
                      />

                      {/* Optional subtle loader ring (keeps it classy) */}
                      {!isLoaded ? (
                        <div className="absolute inset-0 grid place-items-center">
                          <div className="h-10 w-10 rounded-full border border-black/15 border-t-black/40 animate-spin" />
                        </div>
                      ) : null}
                    </div>

                    <div className="text-center">
                      <div className="text-xl font-semibold text-black">
                        {t.name}
                      </div>
                      {t.title ? (
                        <div className="mt-1 text-sm text-black/70">
                          {t.title}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* no dots */}
          </div>
        </div>
      </div>
    </section>
  );
}

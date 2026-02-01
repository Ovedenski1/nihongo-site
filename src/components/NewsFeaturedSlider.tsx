"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export type FeaturedNewsItem = {
  kicker?: string;
  title: string;
  dateRange?: string;
  excerpt?: string;
  ctaLabel?: string;
  href?: string;
  image: string;
};

export default function NewsFeaturedSlider({
  items,
  autoMs = 6000,
}: {
  items: FeaturedNewsItem[];
  autoMs?: number;
}) {
  const safeItems = useMemo(() => items ?? [], [items]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const canSlide = safeItems.length > 1;

  useEffect(() => {
    if (!canSlide || paused) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % safeItems.length);
    }, autoMs);
    return () => clearInterval(id);
  }, [autoMs, canSlide, paused, safeItems.length]);

  function prev() {
    if (!canSlide) return;
    setActive((a) => (a - 1 + safeItems.length) % safeItems.length);
  }

  function next() {
    if (!canSlide) return;
    setActive((a) => (a + 1) % safeItems.length);
  }

  if (!safeItems.length) return null;
  const current = safeItems[active];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-[18px] bg-white border border-black/10 shadow-[0_18px_44px_rgba(0,0,0,0.10)]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] lg:h-[420px]">
          {/* IMAGE */}
          <div className="relative w-full overflow-hidden bg-black/[0.02]">
            <div className="relative w-full aspect-[16/10] lg:aspect-auto lg:h-full">
              <Image
                src={current.image}
                alt=""
                fill
                aria-hidden="true"
                className="object-cover scale-110 blur-xl opacity-60"
                priority
              />

              <div className="absolute inset-0 bg-white/35" />

              <Image
                src={current.image}
                alt={current.title}
                fill
                className="object-contain p-4 sm:p-6 lg:p-7"
                priority
              />

              {canSlide && (
                <>
                  <button
                    onClick={prev}
                    aria-label="Previous"
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center
                               rounded-md bg-white/85 border border-black/10"
                  >
                    ‹
                  </button>

                  <button
                    onClick={next}
                    aria-label="Next"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center
                               rounded-md bg-white/85 border border-black/10"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </div>

          {/* TEXT */}
          <div className="relative p-5 sm:p-7 lg:p-10 flex items-center min-h-0 overflow-hidden">
            <div className="w-full text-center lg:text-left">
              {/* Kicker */}
              {current.kicker && (
                <div
                  className="font-extrabold leading-none"
                  style={{ fontSize: "clamp(24px, 7vw, 52px)" }}
                >
                  {current.kicker}
                </div>
              )}

              {/* TITLE — NEVER CLAMPED */}
              <div
                className="mt-3 font-extrabold leading-tight whitespace-normal break-words"
                style={{ fontSize: "clamp(18px, 5.4vw, 34px)" }}
              >
                {current.title}
              </div>

              {/* DATE */}
              {current.dateRange && (
                <div className="mt-2 text-black/70">
                  {current.dateRange}
                </div>
              )}

              {/* EXCERPT — ALWAYS GETS ... IF LONG */}
              {current.excerpt && (
                <p
                  className="
                    mt-4
                    text-[14px] sm:text-[15px] lg:text-[16px]
                    leading-relaxed text-black/75
                    max-w-[52ch]
                    mx-auto lg:mx-0
                    line-clamp-2
                  "
                >
                  {current.excerpt}
                </p>
              )}

              {/* CTA */}
              {current.href && (
                <a
                  href={current.href}
                  className="mt-5 inline-flex items-center gap-2 font-extrabold text-[var(--kizuna-red)]"
                >
                  {current.ctaLabel ?? "Learn More"} →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DOTS */}
      {canSlide && (
        <div className="mt-4 flex justify-center gap-2">
          {safeItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2.5 rounded-full transition ${
                i === active
                  ? "w-8 bg-[var(--kizuna-red)]"
                  : "w-2.5 bg-black/20"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

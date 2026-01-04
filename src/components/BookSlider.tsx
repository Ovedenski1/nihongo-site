"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export type BookFeature = {
  title: string;
  text: string;
};

export type BookItem = {
  title: string;
  subtitle?: string;
  image: string;
  features: BookFeature[];
  priceLine?: string;
  ctaText?: string;
  ctaHref?: string;
};

export default function BookSlider({
  title = "Books",
  books,
}: {
  title?: string;
  books: BookItem[];
}) {
  const safeBooks = useMemo(() => books?.filter(Boolean) ?? [], [books]);
  const [idx, setIdx] = useState(0);

  const count = safeBooks.length;
  const active = safeBooks[idx];

  if (!active) return null;

  function prev() {
    setIdx((v) => (v - 1 + count) % count);
  }

  function next() {
    setIdx((v) => (v + 1) % count);
  }

  return (
    <section className="mt-14">
      {/* TITLE ONLY — subtitle removed */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        {/* LEFT — IMAGE ONLY */}
        <div>
          <div className="relative overflow-hidden ">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={active.image}
                alt={active.title}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {count > 1 && (
            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={prev}
                className="rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-black/70 hover:bg-black/5"
              >
                ← Prev
              </button>

              <div className="flex gap-2">
                {safeBooks.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    className={`h-2.5 w-2.5 rounded-full ${
                      i === idx ? "bg-black" : "bg-black/25"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-black/70 hover:bg-black/5"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* RIGHT — FEATURES */}
        <div>
          <h3 className="text-3xl font-semibold tracking-tight text-[#1F3570]">
            {active.title}
          </h3>

          {active.subtitle && (
            <p className="mt-2 text-black/65">{active.subtitle}</p>
          )}

          <div className="mt-8 space-y-7">
            {active.features.map((f, i) => (
              <div key={i}>
                <div className="text-2xl font-semibold text-[#1F3570]">
                  {f.title}
                </div>
                <p className="mt-2 max-w-xl text-black/70 leading-7">
                  {f.text}
                </p>
              </div>
            ))}
          </div>

          {(active.priceLine || active.ctaText) && (
            <div className="mt-8">
              {active.priceLine && (
                <div className="text-black/70">{active.priceLine}</div>
              )}

              {active.ctaText && active.ctaHref && (
                <a
                  href={active.ctaHref}
                  className="mt-3 inline-block text-[#1F3570] underline underline-offset-4"
                >
                  {active.ctaText}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// src/app/news/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getNews, type NewsRow } from "@/lib/data";

function formatDate(d?: string | null) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("bg-BG");
  } catch {
    return "";
  }
}

function excerpt(text?: string | null, max = 140) {
  const t = (text ?? "").trim();
  if (t.length <= max) return t;
  return t.slice(0, max).trimEnd() + "…";
}

/* ---------------- IMAGE COMPONENT ---------------- */
function Img({
  src,
  alt,
  className = "",
  frameClassName = "",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  frameClassName?: string;
}) {
  if (!src) return null;

  if (frameClassName) {
    return (
      <div className={frameClassName}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover object-center"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`object-cover object-center ${className}`}
      loading="lazy"
    />
  );
}

/* ---------------- PAGE ---------------- */
export default function NewsPage() {
  const [items, setItems] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const rows = await getNews();
        setItems(rows);
      } catch (e) {
        console.error(e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const hero = items[0] ?? null;
  const right = useMemo(() => items.slice(1, 4), [items]);
  const rest = useMemo(() => items.slice(4), [items]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-black">
        <section className="mx-auto max-w-6xl px-6 py-16">
          {/* TITLE + TANUKI */}
          <div>
            <div className="flex items-center gap-4">
              <img
                src="/images/tanuki5.png"
                alt="Tanuki"
                className="hidden md:block w-12 h-12 object-contain"
              />
              <h1 className="text-3xl md:text-4xl font-bold">Новини</h1>
            </div>

            <p className="mt-4 text-black/60">Последни новини и съобщения.</p>
          </div>

          {loading ? (
            <p className="mt-10 text-black/60">Зареждане…</p>
          ) : items.length === 0 ? (
            <p className="mt-10 text-black/60">Няма новини.</p>
          ) : (
            <>
              {/* TOP SECTION */}
              <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* HERO */}
                {hero && (
                  <article className="lg:col-span-7">
                    <Link href={`/news/${hero.slug}`} className="block">
                      <Img
                        src={hero.image}
                        alt={hero.title ?? ""}
                        className="w-full aspect-[16/9]"
                      />

                      <h2 className="mt-6 text-2xl md:text-3xl font-bold">
                        {hero.title}
                      </h2>
                    </Link>

                    <div className="mt-2 text-sm text-black/50">
                      {formatDate(hero.created_at)}
                    </div>

                    <p className="mt-4 text-black/70 leading-relaxed">
                      {excerpt(hero.content, 260)}
                    </p>

                    <div className="mt-6">
                      <Link
                        href={`/news/${hero.slug}`}
                        className="text-[var(--kizuna-red)] font-semibold"
                      >
                        Прочети →
                      </Link>
                    </div>
                  </article>
                )}

                {/* RIGHT COLUMN */}
                {right.length > 0 && (
                  <div className="lg:col-span-5 space-y-10">
                    {right.map((n) => (
                      <article
                        key={n.id}
                        className="after:content-[''] after:block after:clear-both"
                      >
                        <Link href={`/news/${n.slug}`}>
                          <Img
                            src={n.image}
                            alt={n.title ?? ""}
                            frameClassName="
                              float-left
                              mr-4
                              mb-2
                              h-24
                              w-40
                              overflow-hidden
                              border border-black/10
                            "
                          />
                        </Link>

                        <Link
                          href={`/news/${n.slug}`}
                          className="font-semibold leading-snug block"
                        >
                          {n.title}
                        </Link>

                        <div className="mt-1 text-xs text-black/50">
                          {formatDate(n.created_at)}
                        </div>

                        <p className="mt-2 text-sm text-black/70">
                          {excerpt(n.content, 120)}
                        </p>

                        <div className="mt-3">
                          <Link
                            href={`/news/${n.slug}`}
                            className="text-[var(--kizuna-red)] font-semibold text-sm"
                          >
                            Прочети →
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              {/* RED DIVIDER */}
              <div className="mt-12 h-[2px] w-full bg-[var(--kizuna-red)]" />

              {/* REST */}
              {rest.length > 0 && (
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                  {rest.map((n) => (
                    <article key={n.id}>
                      <Link href={`/news/${n.slug}`} className="block">
                        <Img
                          src={n.image}
                          alt={n.title ?? ""}
                          className="w-full aspect-[16/9]"
                        />
                        <h3 className="mt-4 font-semibold">{n.title}</h3>
                      </Link>

                      <div className="mt-1 text-xs text-black/50">
                        {formatDate(n.created_at)}
                      </div>

                      <p className="mt-3 text-black/70">
                        {excerpt(n.content, 170)}
                      </p>

                      <div className="mt-4">
                        <Link
                          href={`/news/${n.slug}`}
                          className="text-[var(--kizuna-red)] font-semibold text-sm"
                        >
                          Прочети →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}

// src/app/news/[slug]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getMoreNews, getNewsBySlug, type NewsRow } from "@/lib/data";

function formatDate(d?: string | null) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("bg-BG");
  } catch {
    return "";
  }
}

export default function NewsDetailsPage() {
  const params = useParams<{ slug: string }>();
  const slug = useMemo(() => {
    const s = params?.slug;
    return Array.isArray(s) ? s[0] : s;
  }, [params]);

  const [item, setItem] = useState<NewsRow | null>(null);
  const [more, setMore] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);

  // how many items stay on the right (rest goes below)
  const RIGHT_COUNT_DESKTOP = 4;

  useEffect(() => {
    if (!slug) return;

    (async () => {
      try {
        setLoading(true);

        const one = await getNewsBySlug(slug);
        setItem(one);

        // fetch plenty; we’ll split them (right + below)
        const sidebar = await getMoreNews({ excludeSlug: slug, limit: 30 });
        setMore(sidebar);
      } catch (e) {
        console.error(e);
        setItem(null);
        setMore([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const rightItems = useMemo(
    () => more.slice(0, RIGHT_COUNT_DESKTOP),
    [more]
  );
  const belowItems = useMemo(
    () => more.slice(RIGHT_COUNT_DESKTOP),
    [more]
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-black">
        <section className="mx-auto max-w-6xl px-6 py-16">
          {loading ? (
            <p className="text-black/60">Зареждане…</p>
          ) : !item ? (
            <div>
              <h1 className="text-2xl font-bold">Новината не е намерена.</h1>
              <Link
                href="/news"
                className="mt-6 inline-block text-[var(--kizuna-red)] font-semibold"
              >
                ← Назад към новини
              </Link>
            </div>
          ) : (
            <>
              {/* TOP: article + right column */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* MAIN ARTICLE */}
                <article className="lg:col-span-8">
                  <Link
                    href="/news"
                    className="text-[var(--kizuna-red)] font-semibold"
                  >
                    ← Назад към новини
                  </Link>

                  <h1 className="mt-6 text-3xl md:text-4xl font-bold">
                    {item.title}
                  </h1>

                  <div className="mt-2 text-sm text-black/50">
                    {formatDate(item.created_at)}
                  </div>

                  {item.image ? (
                    <div className="mt-8">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.title ?? ""}
                        className="w-full aspect-[16/9] object-cover object-center"
                        loading="lazy"
                      />
                    </div>
                  ) : null}

                  <div className="mt-8 text-black/80 leading-relaxed whitespace-pre-line">
                    {item.content}
                  </div>
                </article>

                {/* RIGHT COLUMN (ONLY FIRST N) */}
                <aside className="lg:col-span-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Още новини</h2>
                    <img
                      src="/images/tanuki5.png"
                      alt="Tanuki"
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                  <div className="mt-4 border-t border-black/10" />

                  {/* ✅ no scroll; only limited amount */}
                  <div className="mt-4 space-y-6">
                    {rightItems.map((n) => (
                      <Link
                        key={n.id}
                        href={`/news/${n.slug}`}
                        className="block"
                      >
                        <div className="text-sm font-semibold leading-snug hover:underline">
                          {n.title}
                        </div>

                        <div className="mt-1 text-xs text-black/50">
                          {formatDate(n.created_at)}
                        </div>

                        {n.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={n.image}
                            alt=""
                            className="mt-3 w-full aspect-[16/9] object-cover object-center"
                            loading="lazy"
                          />
                        ) : null}
                      </Link>
                    ))}
                  </div>
                </aside>
              </div>

              {/* ✅ BELOW ARTICLE: remaining news "wrap" here */}
              {belowItems.length > 0 && (
                <>
                  <div className="mt-14 h-[2px] w-full bg-[var(--kizuna-red)]" />

                  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {belowItems.map((n) => (
                      <Link key={n.id} href={`/news/${n.slug}`} className="block">
                        {n.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={n.image}
                            alt=""
                            className="w-full aspect-[16/9] object-cover object-center"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full aspect-[16/9] border border-black/10" />
                        )}

                        <div className="mt-3 font-semibold leading-snug hover:underline">
                          {n.title}
                        </div>
                        <div className="mt-1 text-xs text-black/50">
                          {formatDate(n.created_at)}
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}

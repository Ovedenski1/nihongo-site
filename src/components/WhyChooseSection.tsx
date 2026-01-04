"use client";

import Image from "next/image";
import Link from "next/link";

type Highlight = {
  text: string;
};

export default function WhyChooseSection({
  title,
  paragraphs,
  teacherLink = { href: "/teachers", label: "преподаватели" },
  scrollTargetId,
  buttonText = "Към курсовете",
  imageSrc,
  imageAlt,
  accent = "#ed1925",
  highlights,
}: {
  title: string;
  paragraphs: Array<
    | { type: "text"; text: string }
    | { type: "teachers"; before?: string; after?: string }
  >;
  teacherLink?: { href: string; label: string };
  scrollTargetId?: string; // ако е undefined → няма бутон
  buttonText?: string;
  imageSrc: string;
  imageAlt: string;
  accent?: string;
  highlights?: Highlight[];
}) {
  function handleScroll() {
    if (!scrollTargetId) return;
    const el = document.getElementById(scrollTargetId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* LEFT */}
          <div>
            <h2
              className="text-4xl md:text-5xl font-extrabold"
              style={{ color: accent }}
            >
              {title}
            </h2>

            <div className="mt-6 space-y-4 max-w-xl text-black/70 leading-7">
              {paragraphs.map((p, i) => {
                if (p.type === "text") {
                  return <p key={i}>{p.text}</p>;
                }

                // teachers paragraph (with link)
                return (
                  <p key={i}>
                    {p.before ?? "Нашите "}
                    <Link
                      href={teacherLink.href}
                      className="font-semibold underline underline-offset-4 hover:opacity-80"
                      style={{ color: accent }}
                    >
                      {teacherLink.label}
                    </Link>
                    {p.after ??
                      " са внимателно подбрани заради ясния си стил на преподаване, търпението и умението да се адаптират към темпото на всеки ученик."}
                  </p>
                );
              })}
            </div>

            {/* Optional highlights */}
            {!!highlights?.length && (
              <div className="mt-8 max-w-xl rounded-2xl bg-black/[0.03] p-6">
                <ul className="space-y-3 text-sm text-black/70">
                  {highlights.map((h, idx) => (
                    <li key={idx}>• {h.text}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Optional button */}
            {!!scrollTargetId && (
              <div className="mt-10">
                <button
                  type="button"
                  onClick={handleScroll}
                  className="inline-flex items-center justify-center rounded-xl px-7 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
                  style={{ backgroundColor: accent }}
                >
                  {buttonText}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT – IMAGE */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={520}
                height={520}
                className="h-auto w-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

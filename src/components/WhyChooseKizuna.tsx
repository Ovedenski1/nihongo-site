"use client";

import Image from "next/image";
import Link from "next/link";

export type WhyChooseData = {
  title: string;
  paragraphs: string[];
  buttonText: string;
  imageSrc: string;
  teachersLinkText: string;
  teachersHref: string;
};

export default function WhyChooseKizuna({
  scrollTargetId = "courses-cards",
  data,
}: {
  scrollTargetId?: string;
  data: WhyChooseData;
}) {
  function handleScroll() {
    const el = document.getElementById(scrollTargetId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const p0 = data.paragraphs?.[0] ?? "";
  const p1 = data.paragraphs?.[1] ?? "";
  const p2 = data.paragraphs?.[2] ?? "";

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* LEFT */}
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#ed1925]">
              {data.title}
            </h2>

            {!!p0 && (
              <p className="mt-6 max-w-xl text-black/70 leading-7">{p0}</p>
            )}

            {!!p1 && (
              <p className="mt-4 max-w-xl text-black/70 leading-7">
                {/* Keep teachers link style */}
                {p1.includes("teachers") ? (
                  <>
                    {p1.split("teachers")[0]}
                    <Link
                      href={data.teachersHref}
                      className="font-semibold text-[#ed1925] underline underline-offset-4 hover:opacity-80"
                    >
                      {data.teachersLinkText}
                    </Link>
                    {p1.split("teachers")[1]}
                  </>
                ) : (
                  p1
                )}
              </p>
            )}

            {!!p2 && (
              <p className="mt-4 max-w-xl text-black/70 leading-7">{p2}</p>
            )}

            <div className="mt-10">
              <button
                type="button"
                onClick={handleScroll}
                className="inline-flex items-center justify-center rounded-xl bg-[#ed1925] px-7 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              >
                {data.buttonText}
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md">
              <Image
                src={data.imageSrc}
                alt="Талисманът на Kizuna"
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

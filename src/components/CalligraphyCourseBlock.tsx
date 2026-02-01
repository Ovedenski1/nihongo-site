"use client";

import Image from "next/image";
import DateBadgeBottomKana from "@/components/DateBadgeBottomKana";

export type CalligraphyCourseItem = {
  title: string;
  date: string; // YYYY-MM-DD
  scheduleLine: string;
  price?: number;
  teacher: { name: string; photo: string };
  description: string[];
  href: string;
};

export default function CalligraphyCourseBlock({
  item,
}: {
  item: CalligraphyCourseItem;
}) {
  return (
    <article className="border-b border-black/10 py-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
        {/* DATE */}
        <div className="shrink-0 md:w-[140px]">
          <DateBadgeBottomKana dateStr={item.date} />
        </div>

        {/* CONTENT */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-3xl font-extrabold tracking-tight text-black">
                {item.title}
              </h2>

              <div className="mt-5 text-lg font-semibold text-black/80">
                {item.scheduleLine}
              </div>

              {/* ✅ PRICE ONLY */}
              {typeof item.price === "number" && (
                <div className="mt-2 text-sm font-bold text-black">
                  Цена: {item.price} лв.
                </div>
              )}
            </div>

            {/* TEACHER (RIGHT SIDE) */}
            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
              <div className="relative h-12 w-12 rounded-full overflow-hidden border border-black/10 bg-black/5">
                <Image
                  src={item.teacher.photo}
                  alt={item.teacher.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-sm font-semibold text-black sm:text-right">
                {item.teacher.name}
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-7 space-y-4 text-[16px] leading-7 text-black/85 max-w-3xl">
            {item.description.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8">
            <a
              href={item.href}
              className="inline-flex items-center justify-center rounded-none bg-[var(--kizuna-red)] px-10 py-4 text-white font-semibold hover:opacity-95 transition"
            >
              Запиши се
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

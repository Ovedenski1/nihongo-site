// src/components/CalligraphyCourseBlock.tsx
"use client";

import Image from "next/image";
import DateBadgeBottomKana from "@/components/DateBadgeBottomKana";

export type CalligraphyCourseItem = {
  title: string;
  date: string; // e.g. "January 11, 2026" (used for gold badge)
  scheduleLine: string; // e.g. "Fridays, January 30–April 3, 6:30–7:30 pm"
  format: "Online" | "On-site" | "Hybrid";
  classesCount: number; // e.g. 10
  teacher: {
    name: string;
    photo: string;
  };
  description: string[]; // paragraphs
  note?: string; // italic note
  href: string; // register link
};

function CalendarIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 3v2M17 3v2M4 8h16M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function CalligraphyCourseBlock({
  item,
}: {
  item: CalligraphyCourseItem;
}) {
  const formatLabel =
    item.format === "Online"
      ? "Онлайн"
      : item.format === "Hybrid"
      ? "Хибридно"
      : "Присъствено";

  const meta = `${formatLabel.toUpperCase()} · ${item.classesCount} ЗАНЯТИЯ · ${item.teacher.name.toUpperCase()}`;

  return (
    <article className="border-b border-black/10 py-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
        {/* LEFT: Gold Date Badge */}
        <div className="shrink-0 md:w-[140px]">
          <DateBadgeBottomKana dateStr={item.date} />
        </div>

        {/* RIGHT: Content */}
        <div className="min-w-0 flex-1">
          {/* Title + teacher circle */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-3xl font-extrabold tracking-tight text-black">
                {item.title}
              </h2>

              {/* Schedule line (no calendar icon) */}
              <div className="mt-5 text-lg font-semibold text-black/80">
                {item.scheduleLine}
              </div>

              {/* Meta line */}
              <div className="mt-3 text-sm font-extrabold tracking-wide text-black">
                {meta}
              </div>
            </div>

            {/* Teacher circle */}
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

          {/* Description */}
          <div className="mt-7 space-y-4 text-[16px] leading-7 text-black/85 max-w-3xl">
            {item.description.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Note */}
          {item.note && (
            <p className="mt-6 italic text-black/70 max-w-3xl">{item.note}</p>
          )}

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

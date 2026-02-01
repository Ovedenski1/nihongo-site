"use client";

import DateBadge from "./DateBadge";
import Link from "next/link";
export type EventItem = {
  date: string;
  title: string;
  totalHours?: number;
  price?: string;
  days?: string[];
  time?: string;
};

/* ✅ EN → BG days map */
const DAYS_BG: Record<string, string> = {
  Monday: "Понеделник",
  Tuesday: "Вторник",
  Wednesday: "Сряда",
  Thursday: "Четвъртък",
  Friday: "Петък",
  Saturday: "Събота",
  Sunday: "Неделя",
};

export default function EventCard({ item }: { item: EventItem }) {
  const daysLine =
    item.days && item.days.length
      ? item.days
          .map((d) => DAYS_BG[d] ?? d)
          .map((d) => d.toUpperCase())
          .join(" · ")
      : "";

  return (
    <div className="group relative overflow-hidden rounded-[18px] border border-black/10 bg-white shadow-[0_16px_34px_rgba(0,0,0,0.10)] hover:shadow-[0_20px_44px_rgba(0,0,0,0.14)] transition">
      {/* Top accent */}
      <div className="h-[8px] bg-[var(--kizuna-red)]" />

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* DATE */}
          <DateBadge dateStr={item.date} />

          <div className="min-w-0">
            <div className="text-[11px] font-extrabold tracking-[0.22em] text-[var(--kizuna-red)]">
              Предстоящ
            </div>

            <div className="mt-2 text-[18px] font-extrabold leading-snug text-[#0c2a57] line-clamp-4">
              {item.title}
            </div>

            {(item.totalHours || item.price) && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-[12px] font-extrabold text-[#0c2a57] shadow-[0_10px_18px_rgba(0,0,0,0.06)]">
                {item.totalHours != null && (
                  <span>
                    {item.totalHours}
                    <span className="ml-0.5 text-black/50"> ч.</span>
                  </span>
                )}

                {item.totalHours != null && item.price && (
                  <span className="mx-1 h-3 w-px bg-black/15" />
                )}

                {item.price && (
                  <span>
                    {item.price}
                    <span className="ml-0.5 text-black/50"> €</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* DAYS + TIME */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-[10px] font-extrabold tracking-[0.18em] text-black/50">
            {daysLine}
            {item.time && (
              <>
                <span className="mx-2 opacity-40">|</span>
                <span>{item.time}</span>
              </>
            )}
          </span>

          <Link
  href="/courses"
  className="text-[14px] font-extrabold text-[var(--kizuna-red)] hover:underline"
>
  Детайли{" "}
  <span className="ml-2 inline-block transition group-hover:translate-x-0.5">
    →
  </span>
</Link>

        </div>
      </div>
    </div>
  );
}

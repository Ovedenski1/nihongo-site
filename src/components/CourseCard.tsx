"use client";

import Image from "next/image";
import DateBadgeBottomKana from "@/components/DateBadgeBottomKana";

export type CourseItem = {
  level: "Basic" | "N5" | "N4" | "N3" | "N2" | "N1";
  date: string;
  title: string;
  totalHours: number;
  price: string;
  days: string[];
  time?: string;
  format: "On-site" | "Online" | "Hybrid";
  teacher: { name: string; photo: string };
  href: string;
};

function MetaRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-black/55">{label}</span>
      <span className="text-black/85 font-medium">{value}</span>
    </div>
  );
}

/** ✅ Convert English day names (DB) -> Bulgarian */
function bgDay(d: string) {
  const key = (d || "").trim().toLowerCase();

  const map: Record<string, string> = {
    monday: "Понеделник",
    mon: "Понеделник",

    tuesday: "Вторник",
    tue: "Вторник",
    tues: "Вторник",

    wednesday: "Сряда",
    wed: "Сряда",

    thursday: "Четвъртък",
    thu: "Четвъртък",
    thur: "Четвъртък",
    thurs: "Четвъртък",

    friday: "Петък",
    fri: "Петък",

    saturday: "Събота",
    sat: "Събота",

    sunday: "Неделя",
    sun: "Неделя",
  };

  // If it's already Bulgarian (or unknown), keep it as-is:
  return map[key] ?? d;
}

export default function CourseCard({ item }: { item: CourseItem }) {
  const daysBg = (item.days ?? []).map(bgDay);

  return (
    <div className="group relative rounded-[24px] bg-white shadow-lg border border-black/5 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[6px] bg-[var(--kizuna-red)]" />

      <div className="p-6">
        <div className="flex items-center justify-between gap-6 pt-4">
          <div className="max-w-[70%]">
            
            <h3 className="text-[26px] leading-tight font-bold text-black">
              {item.title}
            </h3>
          </div>
          <DateBadgeBottomKana dateStr={item.date} />
        </div>

        <div className="mt-6 space-y-3">
          <MetaRow label="Часове" value={`${item.totalHours} ч.`} />

          <MetaRow
            label="Дни"
            value={
              <span className="text-black/75">
                {daysBg.join(" · ")}
                {item.time ? ` | ${item.time}` : ""}
              </span>
            }
          />

          <MetaRow
            label="Цена"
            value={<span className="text-black font-bold">{item.price} €</span>}
          />
        </div>

        <div className="mt-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 rounded-full overflow-hidden border border-black/10 bg-black/5">
              <Image
                src={item.teacher.photo}
                alt={item.teacher.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="leading-tight">
              <div className="text-xs text-black/50">Преподавател</div>
              <div className="text-sm font-semibold text-black">
                {item.teacher.name}
              </div>
            </div>
          </div>

          {/* ✅ SAME PAGE scroll to contacts on Courses page */}
          <a
            href="/contact"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--kizuna-red)] text-white shadow-md transition group-hover:scale-[1.03] hover:opacity-95"
            aria-label="Контакти"
          >
            <span className="text-xl leading-none">→</span>
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition">
        <div className="absolute inset-0 blur-3xl bg-[var(--kizuna-red)]/5" />
      </div>
    </div>
  );
}

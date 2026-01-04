"use client";

export type NewsItem = { date: string; type: string; title: string };

export default function NewsRow({ item }: { item: NewsItem }) {
  return (
    <div className="border-b border-black/10 py-6">
      <div className="text-sm text-black/70">
        {item.date} ・ <span className="text-[#0c2a57]">{item.type}</span>
      </div>

      <div className="mt-2 flex items-start justify-between gap-6">
        <div className="text-lg font-semibold text-[#0c2a57]">{item.title}</div>
        <span className="text-2xl text-[#0c2a57]">→</span>
      </div>
    </div>
  );
}

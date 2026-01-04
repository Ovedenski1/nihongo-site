"use client";

export default function SectionHeader(props: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-2xl">{props.icon}</div>
      <div className="text-3xl font-extrabold text-[#ed1925]">{props.title}</div>
      <div className="ml-auto h-[4px] flex-1 bg-[#ed1925]" />
    </div>
  );
}

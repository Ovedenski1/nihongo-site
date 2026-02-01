"use client";

import { useMemo, useState } from "react";

type LevelKey = "N5" | "N4" | "N3" | "N2" | "N1";

export type LevelInfo = {
  key: LevelKey;
  title: string;
  short: string;
  color: string;
  bullets: string[];
  image: string;
};

const DEFAULT_LEVELS: LevelInfo[] = [
  {
    key: "N5",
    short: "N5",
    title: "N5 – Начинаещ",
    color: "#38BDF8",
    image: "/jlpt/N5.png",
    bullets: [
      "Разбира много основни изрази и прости изречения на японски.",
      "Може да чете хирагана/катакана и малък набор от базови канджи.",
      "Може да следи много бавни и прости ежедневни разговори.",
    ],
  },
  {
    key: "N4",
    short: "N4",
    title: "N4 – Основно ниво",
    color: "#22C55E",
    image: "/jlpt/N4.png",
    bullets: [
      "Разбира базов японски, използван в ежедневни ситуации.",
      "Може да чете кратки текстове по познати теми с основен речник и канджи.",
      "Разбира разговори, когато се говори бавно и ясно.",
    ],
  },
  {
    key: "N3",
    short: "N3",
    title: "N3 – Средно ниво",
    color: "#FACC15",
    image: "/jlpt/N3.png",
    bullets: [
      "Разбира японски в ежедневни ситуации в добра степен.",
      "Може да чете текстове по ежедневни теми и да схваща основните идеи.",
      "Може да следи разговори с почти естествена скорост, ако темата е позната.",
    ],
  },
  {
    key: "N2",
    short: "N2",
    title: "N2 – Високо средно ниво",
    color: "#F97316",
    image: "/jlpt/N2.png",
    bullets: [
      "Разбира японски в ежедневни ситуации и в различни контексти.",
      "Може да чете статии/коментари и да разбира логиката и детайлите.",
      "Може да следи новини и разговори с почти естествена скорост.",
    ],
  },
  {
    key: "N1",
    short: "N1",
    title: "N1 – Напреднало ниво",
    color: "#EF4444",
    image: "/jlpt/N1.png",
    bullets: [
      "Разбира японски на високо ниво в много ситуации.",
      "Може да чете сложни текстове (статии, анализи, критики) и да улавя нюансите.",
      "Може да следи лекции, дискусии и новини с естествена скорост и висока точност.",
    ],
  },
];

export default function LevelsInteractive({
  initial = "N1",
  levels = DEFAULT_LEVELS,
}: {
  initial?: LevelKey;
  levels?: LevelInfo[];
}) {
  const map = useMemo(() => {
    const m = new Map<LevelKey, LevelInfo>();
    levels.forEach((l) => m.set(l.key, l));
    return m;
  }, [levels]);

  const [active, setActive] = useState<LevelKey>(initial);
  const current = map.get(active)!;

  // Desktop pyramid order (top -> bottom)
  const stacked = ["N1", "N2", "N3", "N4", "N5"].map(
    (k) => map.get(k as LevelKey)!
  );

  // Mobile button order (left -> right)
  const mobileRow = ["N5", "N4", "N3", "N2", "N1"].map(
    (k) => map.get(k as LevelKey)!
  );

  const PYR_W = 360;
  const LAYER_H = 74;
  const GAP = 10;
  const TOTAL_H = LAYER_H * stacked.length + GAP * (stacked.length - 1);

  return (
    <section className="w-full">
      <div className="rounded-[18px] bg-[#fafafa] border border-black/10 shadow-[0_16px_34px_rgba(0,0,0,0.10)] overflow-hidden">
        <div className="p-4 sm:p-6 md:p-7">
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 lg:gap-10 items-center">
            {/* LEFT SIDE */}
            <div className="relative">
              {/* ✅ MOBILE: colored buttons row */}
              <div className="lg:hidden">
                <div className="flex items-stretch gap-2">
                  {mobileRow.map((lvl) => {
                    const isActive = lvl.key === active;
                    return (
                      <button
                        key={`m-${lvl.key}`}
                        type="button"
                        onClick={() => setActive(lvl.key)}
                        className={[
                          "flex-1 rounded-[12px] px-0 py-3",
                          "text-white font-extrabold tracking-[0.12em] text-[12px]",
                          "transition-transform duration-200 ease-out",
                          "active:scale-[0.98]",
                        ].join(" ")}
                        style={{
                          background: lvl.color,
                          boxShadow: isActive
                            ? "0 0 0 3px rgba(255,255,255,0.90) inset, 0 10px 18px rgba(0,0,0,0.10)"
                            : "0 10px 18px rgba(0,0,0,0.08)",
                          filter: isActive ? "brightness(1.05)" : undefined,
                        }}
                        aria-label={`Избери ${lvl.key}`}
                        title={lvl.title}
                      >
                        {lvl.key}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 text-center text-[11px] font-semibold tracking-[0.18em] text-black/35">
                  ИЗБЕРИ НИВО
                </div>
              </div>

              {/* ✅ DESKTOP: pyramid */}
              <div className="hidden lg:block">
                <div className="relative w-full max-w-[420px] mx-auto p-6">
                  <div className="mx-auto" style={{ width: PYR_W }}>
                    <div
                      className="relative mx-auto"
                      style={{ width: PYR_W, height: TOTAL_H }}
                    >
                      {stacked.map((lvl, idx) => {
                        const top = idx * (LAYER_H + GAP);
                        const shift = -idx * (LAYER_H + GAP);

                        return (
                          <button
                            key={lvl.key}
                            onClick={() => setActive(lvl.key)}
                            className="absolute left-0 right-0 transition hover:translate-x-[14px]"
                            style={{ top, height: LAYER_H }}
                            aria-label={`Избери ${lvl.key}`}
                            title={lvl.title}
                          >
                            <div className="relative h-full w-full overflow-hidden rounded-[10px]">
                              <div
                                className="absolute left-0 right-0"
                                style={{
                                  top: shift,
                                  height: TOTAL_H,
                                  background: lvl.color,
                                  clipPath:
                                    "polygon(50% 0%, 100% 100%, 0% 100%)",
                                }}
                              />
                              <div className="absolute inset-0 grid place-items-center">
                                <span className="text-white font-extrabold tracking-[0.14em]">
                                  {lvl.key}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-5 text-center text-[12px] font-semibold tracking-[0.18em] text-black/35">
                      ИЗБЕРИ НИВО
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: TEXT + IMAGE */}
            <div className="relative">
              {/* ✅ Mobile: normal flow, image as watermark */}
              <div className="relative lg:hidden mt-4">
                <div className="absolute right-0 top-0 pointer-events-none">
                  <img
                    src={current.image}
                    alt=""
                    className="w-[170px] h-[240px] object-contain opacity-18"
                  />
                </div>

                <div className="relative z-10 pr-[110px]">
                  <h3 className="text-[20px] font-extrabold text-black">
                    {current.title}
                  </h3>

                  <div className="mt-3 space-y-2.5 text-black/70 leading-relaxed text-[14px]">
                    {current.bullets.map((b, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-black/40 shrink-0" />
                        <p>{b}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ✅ Desktop: centered look with image behind */}
              <div className="hidden lg:block relative min-h-[420px]">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                  <img
                    src={current.image}
                    alt=""
                    className="w-[260px] h-[420px] object-contain opacity-30"
                  />
                </div>

                <div className="absolute top-1/2 -translate-y-1/2 z-10 max-w-[520px]">
                  <h3 className="text-[22px] md:text-[26px] font-extrabold text-black">
                    {current.title}
                  </h3>

                  <div className="mt-4 space-y-3 text-black/70 leading-relaxed">
                    {current.bullets.map((b, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-black/40 shrink-0" />
                        <p>{b}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* end desktop */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

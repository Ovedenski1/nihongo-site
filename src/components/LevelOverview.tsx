"use client";

export type Level = "Basic" | "N5" | "N4" | "N3" | "N2" | "N1";

export type LevelOverviewData = Record<
  Level,
  { heading: string; intro: string[]; contents: string[]; eligibility: string }
>;

const levelLabelBg: Record<Level, string> = {
  Basic: "Основно ниво",
  N5: "N5",
  N4: "N4",
  N3: "N3",
  N2: "N2",
  N1: "N1",
};

function Segmented({
  value,
  onChange,
  options,
}: {
  value: Level;
  onChange: (lvl: Level) => void;
  options: Level[];
}) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-2xl border border-black/10 bg-black/[0.03] p-1">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={[
              "px-4 py-2 text-sm font-semibold rounded-xl transition",
              active
                ? "bg-black text-white shadow-sm"
                : "text-black/70 hover:bg-white/60",
            ].join(" ")}
          >
            {levelLabelBg[opt]}
          </button>
        );
      })}
    </div>
  );
}

export default function LevelOverview({
  level,
  onChange,
  data,
}: {
  level: Level;
  onChange: (lvl: Level) => void;
  data: LevelOverviewData;
}) {
  const lvls: Level[] = ["Basic", "N5", "N4", "N3", "N2", "N1"];
  const info = data[level];

  if (!info) return null;

  return (
    <section className="mt-10 bg-white">
      <div className="rounded-2xl bg-white p-8">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{info.heading}</h2>
            <p className="mt-2 text-black/60">
              Изберете ниво, за да видите целите, темите и изискванията.
            </p>
          </div>

          <div>
            <Segmented value={level} onChange={onChange} options={lvls} />
          </div>
        </div>

        <div className="mt-8">
          {info.intro.map((p, i) => (
            <p key={i} className="text-black/70 leading-7 mb-4 last:mb-0">
              {p}
            </p>
          ))}

          <h3 className="mt-7 text-sm font-semibold text-black/80">
            Съдържание на курса:
          </h3>
          <ul className="mt-3 list-disc pl-5 text-black/70 space-y-2">
            {info.contents.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>

          <h3 className="mt-7 text-sm font-semibold text-black/80">
            Изисквания:
          </h3>
          <p className="mt-2 text-black/70 leading-7">{info.eligibility}</p>
        </div>
      </div>
    </section>
  );
}

// src/components/CalligraphyCurriculum.tsx
"use client";

import Image from "next/image";

const sections = [
  {
    number: "1",
    title: "Въведение в японската калиграфия и нейната история",
    text: [
      "Накратко ще обясним историята и културния контекст на калиграфията.",
      "Ще научите основните понятия и връзката ѝ с японската култура.",
    ],
    image: "/calligraphy/history.jpg",
  },
  {
    number: "2",
    title: "Въведение в инструментите за японска калиграфия",
    text: [
      "Ще дадем подробно обяснение на основните инструменти: четки, туш, тушници (камък за туш) и хартия.",
      "Ще научите как да използвате и поддържате правилно всеки инструмент.",
    ],
    image: "/calligraphy/tools.png",
  },
  {
    number: "3",
    title: "Правилни техники за държане на четката",
    text: [
      "Ще бъдете обучени как да държите четката правилно и как да контролирате натиска.",
    ],
    image: "/calligraphy/brush.jpg",
  },
  {
    number: "4",
    title: "Стриване на туш и приготвяне на тушова разтвор",
    text: [
      "Изживейте традиционния процес на стрива̀не на туш с тушник (камък за туш).",
      "Научете как плътността на туша влияе на тона, дълбочината и изразителността в калиграфията.",
    ],
    image: "/calligraphy/grind.jpg",
  },
  {
    number: "5",
    title: "Практика на основни техники с четка",
    text: [
      "Практикувайте фундаментални техники: изтегляне на линии, движения на четката и контрол на натиска.",
      "Научете базови калиграфски елементи като ten (точки) и harai (изтеглени щрихи).",
    ],
    image: "/calligraphy/brush2.jpg",
  },
];

export default function CalligraphyCurriculum() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 space-y-28">
        {sections.map((section, index) => (
          <div
            key={section.number}
            className={`grid items-center gap-12 lg:grid-cols-2 ${
              index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
            }`}
          >
            {/* IMAGE */}
            <div
              className={`relative aspect-[4/3] w-full overflow-hidden bg-black/5 ${
                index % 2 === 1 ? "lg:col-start-2" : ""
              }`}
            >
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-cover"
              />
            </div>

            {/* TEXT */}
            <div className="max-w-xl">
              <div className="flex items-baseline gap-4">
                <span className="text-2xl font-bold text-black/40">
                  {section.number}.
                </span>
                <h3 className="text-xl md:text-2xl font-semibold">
                  {section.title}
                </h3>
              </div>

              <div className="mt-6 space-y-4 text-black/70 leading-7">
                {section.text.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

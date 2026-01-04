// src/components/CalligraphyCard.tsx
"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type TabKey = "culture" | "learning" | "mindset";

export default function CalligraphyCard() {
  const [tab, setTab] = useState<TabKey>("culture");

  const content = useMemo(() => {
    const map: Record<
      TabKey,
      {
        title: string;
        points: Array<React.ReactNode>;
        imageSrc: string;
        imageAlt: string;
        meaning: string;
      }
    > = {
      culture: {
        title: "Калиграфията като култура",
        points: [
          <>
            Докосни се до жива традиция — <strong>шодō</strong> се практикува в
            училища, храмове и домове.
          </>,
          <>
            Научи културни ценности като <strong>баланс</strong>,{" "}
            <strong>простота</strong> и уважение към процеса.
          </>,
          <>
            Разбери защо писането с четка присъства в церемонии, сезонни картички
            и изкуство.
          </>,
          <>Свържи се с Япония отвъд учебниците — чрез естетична практика.</>,
        ],
        imageSrc: "/decor/kanji-culture.png",
        imageAlt: "Канджи, символизиращо култура",
        meaning: "Култура",
      },
      learning: {
        title: "Калиграфия за учене",
        points: [
          <>
            Подобри <strong>разпознаването на канджи</strong> чрез правилен ред
            на щрихите и структура.
          </>,
          <>
            Повиши точността на писане — разстояния, пропорции и контрол на
            линията се пренасят и в почерка.
          </>,
          <>Подсили паметта, като изписваш знаците осъзнато.</>,
          <>Помага да забелязваш радикали, модели и визуален баланс.</>,
        ],
        imageSrc: "/decor/kanji-learning.png",
        imageAlt: "Канджи, символизиращо учене",
        meaning: "Учене",
      },
      mindset: {
        title: "Калиграфия за нагласа",
        points: [
          <>
            Изгражда <strong>фокус</strong> — щрихът с четка не търпи бързане.
          </>,
          <>
            Насърчава <strong>търпение</strong> и спокойна повторяемост.
          </>,
          <>
            Тренира <strong>дисциплина</strong> чрез постоянство.
          </>,
          <>
            Осъзнат „рестарт“ — намалява стреса и подобрява устойчивостта при
            учене.
          </>,
        ],
        imageSrc: "/decor/kanji-mindset.png",
        imageAlt: "Канджи, символизиращо нагласа",
        meaning: "Ум",
      },
    };

    return map[tab];
  }, [tab]);

  const pillBase =
    "px-4 py-2 rounded-xl text-sm font-semibold transition select-none";
  const pillActive = "bg-black text-white";
  const pillInactive = "bg-black/5 text-black hover:bg-black/10";

  return (
    <div className="relative bg-[#f3cada] rounded-[22px] shadow-lg border border-black/5 px-6 sm:px-10 py-8 sm:py-12 min-h-[520px] sm:min-h-[560px] flex items-center overflow-hidden">
      {/* MOBILE ONLY — Kanji behind text */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center md:hidden">
        <Image
          src={content.imageSrc}
          alt=""
          width={520}
          height={520}
          className="opacity-[0.12] scale-[1.05]"
        />
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full">
        {/* LEFT: pills + text */}
        <div>
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setTab("culture")}
              className={`${pillBase} ${
                tab === "culture" ? pillActive : pillInactive
              }`}
            >
              Култура
            </button>
            <button
              onClick={() => setTab("learning")}
              className={`${pillBase} ${
                tab === "learning" ? pillActive : pillInactive
              }`}
            >
              Учене
            </button>
            <button
              onClick={() => setTab("mindset")}
              className={`${pillBase} ${
                tab === "mindset" ? pillActive : pillInactive
              }`}
            >
              Нагласа
            </button>
          </div>

          <h3 className="text-2xl font-bold mb-4">{content.title}</h3>

          <ul className="space-y-3 text-black/70 text-sm sm:text-base list-disc pl-5">
            {content.points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>

        {/* DESKTOP ONLY — Kanji + meaning */}
        <div className="relative hidden md:flex flex-col items-center justify-center">
          <Image
            key={content.imageSrc}
            src={content.imageSrc}
            alt={content.imageAlt}
            width={260}
            height={260}
            className="opacity-90"
          />
          <span className="mt-3 text-sm tracking-wide uppercase text-black/50">
            {content.meaning}
          </span>
        </div>
      </div>
    </div>
  );
}

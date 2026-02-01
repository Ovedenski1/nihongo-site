"use client";

import { useMemo, useState } from "react";
import type { QuizQuestionRow } from "@/lib/data";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function QuizRunner({
  questions,
  title = "Тест: Японският ти в кръвта ли е?",
}: {
  questions: QuizQuestionRow[];
  title?: string;
}) {
  const normalized = useMemo(() => {
    // Keep only valid questions
    return (questions ?? [])
      .filter((q) => q.question && q.options?.length >= 2)
      .map((q) => ({
        ...q,
        correct_index: clamp(q.correct_index ?? 0, 0, (q.options?.length ?? 1) - 1),
      }));
  }, [questions]);

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const total = normalized.length;
  const current = normalized[idx];

  const score = useMemo(() => {
    let s = 0;
    for (const q of normalized) {
      const a = answers[q.id];
      if (typeof a === "number" && a === q.correct_index) s++;
    }
    return s;
  }, [answers, normalized]);

  const resultLabel = useMemo(() => {
    if (total === 0) return "";
    const pct = (score / total) * 100;

    if (pct >= 85) return "🔥 Японец по душа";
    if (pct >= 60) return "✨ Много добър старт";
    if (pct >= 35) return "🙂 Добра основа";
    return "🌱 Начинаещ (но това е супер!)";
  }, [score, total]);

  function reset() {
    setIdx(0);
    setAnswers({});
    setSubmitted(false);
  }

  if (total === 0) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-10 shadow-[0_25px_60px_rgba(0,0,0,0.08)] text-center">
        <h1 className="text-3xl font-bold">Тестът скоро идва</h1>
        <p className="mt-3 text-black/70">
          Все още няма активни въпроси. Добави ги от Admin → Тест.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-10 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.08)] text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold">{title}</h1>

        <p className="mt-6 text-xl font-semibold">
          Резултат: {score} / {total}
        </p>
        <p className="mt-2 text-black/70">{resultLabel}</p>

        <button
          onClick={reset}
          className="mt-8 rounded-full bg-[#F5C84B] px-8 py-4 font-extrabold hover:brightness-95 transition"
        >
          Опитай пак
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-8 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">{title}</h1>
          <p className="mt-2 text-black/60">
            Въпрос {idx + 1} от {total}
          </p>
        </div>

        <div className="text-right text-sm text-black/60">
          Текущ резултат: <span className="font-semibold text-black">{score}</span>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-lg md:text-xl font-semibold">{current.question}</p>

        <div className="mt-5 grid gap-3">
          {current.options.map((opt, i) => {
            const selected = answers[current.id] === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setAnswers((a) => ({ ...a, [current.id]: i }))}
                className={[
                  "w-full text-left rounded-2xl border px-5 py-4 transition",
                  "hover:shadow-sm",
                  selected ? "border-black/30 bg-black/[0.03]" : "border-black/10 bg-white",
                ].join(" ")}
              >
                <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            );
          })}
        </div>

        {current.explanation ? (
          <p className="mt-5 text-sm text-black/60">
            <span className="font-semibold">Подсказка/обяснение:</span> {current.explanation}
          </p>
        ) : null}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIdx((v) => Math.max(0, v - 1))}
            disabled={idx === 0}
            className="rounded-full border border-black/10 px-6 py-3 font-semibold disabled:opacity-40"
          >
            ← Назад
          </button>

          {idx < total - 1 ? (
            <button
              type="button"
              onClick={() => setIdx((v) => Math.min(total - 1, v + 1))}
              className="rounded-full bg-[#F5C84B] px-7 py-3 font-extrabold hover:brightness-95 transition"
            >
              Напред →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              className="rounded-full bg-[#F5C84B] px-7 py-3 font-extrabold hover:brightness-95 transition"
            >
              Завърши теста
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

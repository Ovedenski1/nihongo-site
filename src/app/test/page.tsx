// src/app/test/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { getActiveQuizQuestions, type QuizQuestionRow } from "@/lib/data";

type AnyQuizRow = QuizQuestionRow & {
  correctIndex?: number;
  correct_index?: number;
  correctOptionIndex?: number;
  correct_option_index?: number;

  correctAnswer?: string;
  correct_answer?: string;

  correctOption?: string;
  correct_option?: string;

  answer?: string;
};

function getCorrectIndex(q: AnyQuizRow): number | null {
  const idx =
    q.correctIndex ??
    q.correct_index ??
    q.correctOptionIndex ??
    q.correct_option_index;

  if (typeof idx === "number" && Number.isFinite(idx)) return idx;

  const correctText =
    q.correctAnswer ??
    q.correct_answer ??
    q.correctOption ??
    q.correct_option ??
    q.answer;

  if (typeof correctText === "string" && correctText.trim()) {
    const found = (q.options ?? []).findIndex(
      (o) => String(o).trim() === correctText.trim()
    );
    return found >= 0 ? found : null;
  }

  return null;
}

function scoreMessage(score: number, total: number) {
  if (total <= 0) return { title: "Готово!", text: "Благодарим ти!" };

  if (score >= total) {
    return {
      title: "Перфектно! 🌸",
      text: "5/5 – изглежда вече имаш японския в кръвта! Разгледай курсовете и започвай!",
    };
  }

  if (score >= total - 1) {
    return {
      title: "Супер резултат! ⭐",
      text: "Много близо до перфектното! С още малко практика ще си топ.",
    };
  }

  if (score >= 3) {
    return {
      title: "Браво! 🙌",
      text: "Имаш добра основа! Ако продължиш – ще напреднеш много бързо.",
    };
  }

  return {
    title: "Добър старт 🙂",
    text: "Не се притеснявай – всички започват отнякъде. Разгледай курсовете и ще стане лесно!",
  };
}

export default function TestPage() {
  const [qs, setQs] = useState<AnyQuizRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const rows = await getActiveQuizQuestions();
        setQs(rows as AnyQuizRow[]);
      } catch (e) {
        console.error(e);
        setQs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const total = qs.length;

  const answeredCount = useMemo(() => {
    return qs.reduce((acc, q) => acc + (selected[q.id] != null ? 1 : 0), 0);
  }, [qs, selected]);

  const canFinish = total > 0 && answeredCount === total;

  const score = useMemo(() => {
    if (!submitted) return 0;
    let s = 0;
    for (const q of qs) {
      const correctIdx = getCorrectIndex(q);
      const pickedIdx = selected[q.id];
      if (correctIdx != null && pickedIdx === correctIdx) s += 1;
    }
    return s;
  }, [submitted, qs, selected]);

  const canScore = useMemo(() => {
    if (!submitted) return false;
    return qs.every((q) => getCorrectIndex(q) != null);
  }, [submitted, qs]);

  const resultCopy = useMemo(() => scoreMessage(score, total), [score, total]);

  function pick(qId: string, optIndex: number) {
    if (submitted) return;
    setSelected((prev) => ({ ...prev, [qId]: optIndex }));
  }

  function finish() {
    if (!canFinish) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function retry() {
    setSelected({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <Navbar />

      {/* FULL WHITE SHEET that hides the waves behind it */}
      <main className="bg-white">
        <div className="min-h-[calc(100vh-80px)] bg-white">
          <div className="mx-auto max-w-6xl px-6 pt-24 pb-20">
            <div className="mx-auto max-w-4xl rounded-3xl border border-black/10 bg-white p-10 shadow-[0_25px_60px_rgba(0,0,0,0.10)]">
              {loading ? (
                <>
                  <h1 className="text-2xl md:text-3xl font-bold text-center">
                    Зареждане…
                  </h1>
                  <p className="mt-3 text-center text-black/60">
                    Моля изчакай.
                  </p>
                </>
              ) : qs.length === 0 ? (
                <>
                  <h1 className="text-2xl md:text-3xl font-bold text-center">
                    Тестът скоро идва
                  </h1>
                  <p className="mt-3 text-center text-black/60">
                    Все още няма активни въпроси. Добави ги от Admin → Тест.
                  </p>
                </>
              ) : (
                <>
                  {/* header with a bit more color */}
                  <div className="rounded-2xl border border-black/10 bg-gradient-to-b from-[#FFF5D6] to-white p-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-center">
                      Тест
                    </h1>
                    <p className="mt-2 text-center text-black/60">
                      Отговори на въпросите по-долу.
                    </p>

                    {!submitted && (
                      <div className="mt-4 flex justify-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/70">
                          <span className="font-semibold">Прогрес:</span>
                          <span className="font-extrabold">
                            {answeredCount}/{total}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RESULT PANEL */}
                  {submitted && (
                    <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                      <div className="flex flex-col items-center">
                        <div
                          className="
                            inline-flex items-center gap-3
                            rounded-full px-5 py-2
                            bg-[#F5C84B]/30 border border-[#F5C84B]/60
                          "
                        >
                          <span className="text-sm font-semibold text-black/70">
                            Резултат
                          </span>
                          <span className="text-lg font-extrabold">
                            {canScore ? `${score} / ${total}` : "—"}
                          </span>
                        </div>

                        <h2 className="mt-4 text-xl md:text-2xl font-extrabold text-center">
                          {resultCopy.title}
                        </h2>
                        <p className="mt-2 text-center text-black/70 max-w-xl">
                          {canScore
                            ? resultCopy.text
                            : "Няма отбелязани верни отговори в базата, затова не мога да изчисля резултат. (Но тестът работи!)"}
                        </p>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                          <a
                            href="/courses"
                            className="
                              rounded-full px-7 py-3 font-extrabold text-center
                              bg-[#F5C84B] hover:brightness-95 transition
                            "
                          >
                            Разгледай курсовете
                          </a>

                          <button
                            type="button"
                            onClick={retry}
                            className="
                              rounded-full px-7 py-3 font-bold
                              border border-black/10 bg-white
                              hover:bg-black/5 transition
                            "
                          >
                            Опитай отново
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* QUESTIONS */}
                  <div className="mt-10 space-y-6">
                    {qs.map((q, idx) => {
                      const pickedIdx = selected[q.id];
                      const correctIdx = getCorrectIndex(q);

                      return (
                        <div
                          key={q.id}
                          className="rounded-2xl border border-black/10 bg-white p-6"
                        >
                          <div className="text-sm text-black/50 mb-2">
                            Въпрос {idx + 1}
                          </div>

                          <div className="text-lg font-semibold">
                            {q.question}
                          </div>

                          <div className="mt-4 grid gap-3">
                            {q.options.map((opt, i) => {
                              const isPicked = pickedIdx === i;
                              const isCorrect = submitted && correctIdx === i;
                              const isWrongPicked =
                                submitted &&
                                isPicked &&
                                correctIdx != null &&
                                correctIdx !== i;

                              return (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => pick(q.id, i)}
                                  className={[
                                    "w-full text-left rounded-xl border px-4 py-3 transition",
                                    "border-black/10 hover:bg-black/5",
                                    !submitted && isPicked
                                      ? "border-[#F5C84B] bg-[#FFF5D6]"
                                      : "",
                                    isCorrect
                                      ? "border-green-500 bg-green-50"
                                      : "",
                                    isWrongPicked
                                      ? "border-red-500 bg-red-50"
                                      : "",
                                  ].join(" ")}
                                  aria-pressed={isPicked}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {submitted && (
                            <div className="mt-4 text-sm text-black/70 space-y-1">
                              <div>
                                Твоят отговор:{" "}
                                <span className="font-semibold">
                                  {pickedIdx != null ? q.options[pickedIdx] : "—"}
                                </span>
                              </div>

                              <div>
                                Верен отговор:{" "}
                                <span className="font-semibold">
                                  {correctIdx != null ? q.options[correctIdx] : "—"}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* FINISH BUTTON */}
                  {!submitted && (
                    <div className="mt-10 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={finish}
                        disabled={!canFinish}
                        className="
                          rounded-full px-8 py-4 text-lg font-extrabold
                          bg-[#F5C84B] hover:brightness-95 transition
                          disabled:opacity-50 disabled:cursor-not-allowed
                        "
                        title={
                          canFinish
                            ? "Приключи теста"
                            : "Отговори на всички въпроси"
                        }
                      >
                        Приключи теста ({answeredCount}/{total})
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

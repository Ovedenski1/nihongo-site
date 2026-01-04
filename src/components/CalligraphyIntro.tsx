// src/components/CalligraphyIntro.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function CalligraphyIntro() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-10">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* LEFT */}
          <div className="relative">
            <div className="flex gap-10">
              {/* Vertical text (desktop) */}
              <div className="hidden md:block relative">
                {/* TOP LEFT CORNER */}
                <span className="absolute -left-8 top-0 h-14 w-14 border-l-2 border-t-2 border-black/40" />

                {/* BOTTOM RIGHT CORNER */}
                <span className="absolute -right-8 bottom-0 h-14 w-14 border-r-2 border-b-2 border-black/40" />

                {/* ✅ vertical spacing ONLY top & bottom */}
                <div className="flex items-start gap-8 py-6">
                  {/* vertical label */}
                  <div
                    className="text-black/80 font-semibold tracking-wide"
                    style={{
                      writingMode: "vertical-rl",
                      textOrientation: "upright",
                    }}
                  >
                    КУРС ПО КАЛИГРАФИЯ
                  </div>

                  {/* vertical title */}
                  <div
                    className="text-black font-medium"
                    style={{
                      writingMode: "vertical-rl",
                      textOrientation: "mixed",
                    }}
                  >
                    „Миг, в който да преживееш традиционна Япония“
                  </div>
                </div>
              </div>

              {/* Mobile headline */}
              <div className="md:hidden">
                <div className="text-xs font-semibold tracking-[0.22em] text-black/50 uppercase">
                  Калиграфия (Шодō)
                </div>
                <h2 className="mt-3 text-3xl font-bold leading-tight">
                  Миг, в който да преживееш традиционна Япония
                </h2>
              </div>

              {/* Body */}
              <div className="max-w-xl">
                <p className="text-black/70 leading-7">
                  Японската калиграфия (Шодō) е традиционно изкуство, което
                  изразява красота чрез четка, туш, ритъм и баланс.
                </p>

                <p className="mt-5 text-black/70 leading-7">
                  Повече от изписване на знаци, тя развива фокус, спокойствие и
                  по-дълбока връзка с японската естетика и култура.
                </p>

                <div className="mt-10">
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center bg-black px-10 py-4 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Цени и записване
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative overflow-hidden bg-black/5">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src="/calligraphy/hero.jpg"
                alt="Курс по калиграфия"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type Props = {
  source?: string;
  nextUrl?: string;
  onSubmitted?: () => void;
};

export default function ContactForm({
  source = "contact",
  nextUrl = "https://kizuna.bg/contact",
  onSubmitted,
}: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const didSubmitRef = useRef(false);

  function handleSubmit() {
    setSending(true);
    didSubmitRef.current = true;
  }

  function handleIframeLoad() {
    // only after we actually submitted
    if (!didSubmitRef.current) return;

    setSending(false);
    setSubmitted(true);
    onSubmitted?.();
  }

  if (submitted) {
    // ✅ back to your OLD tanuki success image
    return (
      <div className="mx-auto mt-16 max-w-4xl rounded-3xl bg-white p-14 md:p-20 text-center shadow-xl">
        <Image
          src="/images/success-kizuna.png"
          alt="Успешно изпратено"
          width={260}
          height={260}
          className="mx-auto mb-6 w-[200px] md:w-[240px] h-auto"
          priority
        />

        <h3 className="font-serif text-4xl md:text-5xl text-[var(--kizuna-red)]">
          そうしんしました
        </h3>

        <p className="mt-4 text-lg md:text-xl text-black/70">
          Благодарим ти! Ще се свържем с теб възможно най-скоро.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* hidden iframe target for FormSubmit */}
      <iframe
        name="hidden_iframe"
        style={{ display: "none" }}
        onLoad={handleIframeLoad}
        title="hidden_iframe"
      />

      <div className="mx-auto mt-12 max-w-2xl rounded-3xl bg-[var(--kizuna-red)] p-10 shadow-xl md:p-14">
        <form
          action="https://formsubmit.co/craxhack@gmail.com"
          method="POST"
          target="hidden_iframe"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* NAME */}
          <div className="space-y-2">
            <label className="block text-base font-bold tracking-wide text-[var(--kizuna-yellow)]">
              なまえ
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Име"
              className="w-full rounded-md border border-white/20 bg-white px-5 py-4 text-base text-black
                         focus:outline-none focus:ring-2 focus:ring-[var(--kizuna-yellow)]"
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="block text-base font-bold tracking-wide text-[var(--kizuna-yellow)]">
              メール
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="Имейл"
              className="w-full rounded-md border border-white/20 bg-white px-5 py-4 text-base text-black
                         focus:outline-none focus:ring-2 focus:ring-[var(--kizuna-yellow)]"
            />
          </div>

          {/* PHONE */}
          <div className="space-y-2">
            <label className="block text-base font-bold tracking-wide text-[var(--kizuna-yellow)]">
              でんわ
            </label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="Телефон"
              className="w-full rounded-md border border-white/20 bg-white px-5 py-4 text-base text-black
                         focus:outline-none focus:ring-2 focus:ring-[var(--kizuna-yellow)]"
            />
          </div>

          {/* MESSAGE */}
          <div className="space-y-2">
            <label className="block text-base font-bold tracking-wide text-[var(--kizuna-yellow)]">
              メッセージ
            </label>
            <textarea
              name="message"
              rows={6}
              required
              placeholder="Съобщение"
              className="w-full rounded-md border border-white/20 bg-white px-5 py-4 text-base text-black
                         focus:outline-none focus:ring-2 focus:ring-[var(--kizuna-yellow)]"
            />
          </div>

          {/* meta */}
          <input type="hidden" name="source" value={source} />

          {/* FormSubmit config */}
          <input type="hidden" name="_subject" value="Ново съобщение от сайта" />
          <input
            type="hidden"
            name="_autoresponse"
            value="Благодарим ти! Получихме съобщението ти и ще се свържем с теб скоро."
          />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" value={nextUrl} />
          <input type="text" name="_honey" style={{ display: "none" }} />

          <button
            type="submit" // ✅ ensures submit always works
            disabled={sending}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full
                       bg-[var(--kizuna-yellow)] px-10 py-4 text-lg font-extrabold text-black shadow-md
                       hover:opacity-90 disabled:opacity-60"
          >
            {sending ? "Изпращане…" : "Изпрати"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-white/80">
          * Всички полета са задължителни.
        </p>
      </div>
    </>
  );
}

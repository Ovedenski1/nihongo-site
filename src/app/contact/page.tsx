"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Navbar />

      <main className="bg-white text-black">
        <section
          className={[
            "mx-auto max-w-6xl px-6 pt-20",
            // ✅ keep lots of white space on success so footer pattern doesn't jump up
            submitted ? "pb-40 min-h-[75vh]" : "pb-24",
          ].join(" ")}
        >
          {/* HEADER ROW (hide after submit) */}
          {!submitted && (
            <div className="flex items-start justify-between gap-8">
              <div className="max-w-2xl">
                <h1 className="font-serif text-4xl text-[var(--kizuna-red)]">
                  Свържи се с нас
                </h1>

                <p className="mt-4 text-black/70">
                  Ако имаш въпроси за курсовете или занятията, пиши ни — с радост
                  ще отговорим.
                </p>
              </div>

              {/* small tanuki in header */}
              <Image
                src="/images/letter.png"
                alt="Tanuki writing a letter"
                width={90}
                height={90}
                className="w-[90px] h-auto"
                priority
              />
            </div>
          )}

          <ContactForm
            source="contact-page"
            nextUrl="https://kizuna.bg/contact"
            onSubmitted={() => setSubmitted(true)}
          />
        </section>
      </main>
    </>
  );
}

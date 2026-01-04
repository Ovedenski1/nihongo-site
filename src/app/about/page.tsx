// src/app/about/page.tsx
"use client";

import React from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { Mail, Phone, MapPin } from "lucide-react";

function Divider() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="my-16 h-[2px] w-full bg-[var(--kizuna-red)]" />
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-black/70 leading-relaxed">{children}</p>;
}

function Hero() {
  return (
    <section className="relative w-full">
      <div className="relative h-[28vh] min-h-[200px] w-full">
        <Image
          src="/about/hero.jpg"
          alt="Кизуна"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>
    </section>
  );
}

function KizunaMeaning() {
  return (
    <section className="w-full bg-[var(--kizuna-red)]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 text-white">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Какво значи „Кизуна“
            </h2>

            <p className="mt-4 text-white/90 leading-relaxed max-w-4xl">
              Кизуна (絆) е японска дума за връзка — онази невидима нишка, която
              свързва хората чрез доверие, подкрепа и споделен път.
            </p>

            <p className="mt-4 text-white/90 leading-relaxed max-w-4xl">
              В нашата школа „Кизуна“ е обещание за среда, в която ученето е
              спокойно и последователно — с ясни стъпки и реална практика.
              Създаваме място, където езикът води към културата, а културата
              вдъхновява увереност — в разговорите, в навиците и в ежедневните
              малки победи.
            </p>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end justify-start">
            <div className="relative w-44 h-44 md:w-100 md:h-56">
              <Image
                src="/logo3.png"
                alt="Kizuna logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <Divider />
    </section>
  );
}

function Story() {
  const paragraphs: string[] = [
    "Вдъхновени от идеята за kizuna — връзка, която свързва хората, ние развиваме среда за учене, в която знанието постепенно се превръща в увереност. За нас ученето не е състезание, а път — личен, осъзнат и споделен с други хора със сходни интереси и цели.",
    "В Кизуна вярваме, че езикът е много повече от правила и граматични конструкции. Той е врата към нова култура, начин на мислене, нови приятелства и възможности за личностно развитие. Затова нашият подход съчетава ясна структура, последователност и достатъчно практика, подкрепени от модерни методи на обучение.",
    "Работим с внимателно подбрани материали, насочени към реалната употреба на езика — говорене, слушане, четене и писане в баланс. Упражненията са подредени логично, така че всяка нова стъпка да надгражда предишната. Не бързаме излишно, но поддържаме постоянство, което води до стабилни и дълготрайни резултати.",
    "Калиграфията добавя още един дълбок слой към цялостното преживяване. Тя носи фокус, търпение и уважение към формата и детайла. В нашата философия калиграфията е пространство за тишина и концентрация — момент, в който умът се успокоява, а ръката и мисълта работят в хармония.",
    "Най-важното за нас остава общността. Кизуна е място за хора, които си помагат, мотивират се взаимно и споделят пътя си. Тук празнуваме малките успехи, защото знаем, че именно те водят до големите постижения.",
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 pt-4">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
        Нашата история
      </h2>

      <div className="mt-10">
        <div className="lg:float-right lg:w-[520px] lg:ml-10 lg:mb-6 w-full mb-8">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src="/about/story.jpg"
              alt="Кизуна – история"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-5 max-w-3xl">
          {paragraphs.map((t, i) => (
            <P key={i}>{t}</P>
          ))}
        </div>

        <div className="clear-both" />
      </div>

      <Divider />
    </section>
  );
}

function WhatWeDo() {
  const paragraphs: string[] = [
    "Организираме курсове по японски език за различни нива — от напълно начинаещи до напреднали. Освен това правим тематични работилници, клубни срещи и специални събития, които те приближават до Япония не само като език, а като културно преживяване.",
    "Обучението се провежда по ясна и добре структурирана програма, с редовни домашни задания и постоянна подкрепа от преподавател. Учиш в група, която мотивира и създава чувство за принадлежност — без напрежение и без страх от грешки.",
    "Вярваме, че най-доброто учене се случва в спокойна среда, където всеки се чувства уверен да задава въпроси, да експериментира и да напредва със собствено темпо.",
  ];

  return (
    <section className="mx-auto max-w-6xl px-6">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
        Какво правим
      </h2>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-6 space-y-5">
          {paragraphs.map((t, i) => (
            <P key={i}>{t}</P>
          ))}

          <div className="pt-2">
            <a
              href="/teachers"
              className="inline-flex bg-black text-white px-5 py-2.5 text-sm font-semibold hover:opacity-90"
            >
              Запознай се с екипа
            </a>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src="/about/what-we-do.jpg"
              alt="Какво правим"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <Divider />
    </section>
  );
}

function Place() {
  return (
    <section className="mx-auto max-w-6xl px-6">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center">
        Нашето място
      </h2>

      <div className="mt-4 max-w-4xl mx-auto text-center space-y-3">
        <p className="text-black/65 leading-relaxed">
          Спокойна атмосфера, чиста визия и детайли, които създават чувство за
          фокус. Пространството е подредено така, че да ти е удобно да учиш, да
          задаваш въпроси и да напредваш в собствен ритъм.
        </p>
        <p className="text-black/65 leading-relaxed">
          Използваме средата за занятия, работилници и тематични срещи — така
          ученето става преживяване, а не просто урок. Тук има място и за
          тишина, и за разговор.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative aspect-[16/10] w-full">
          <Image
            src="/about/space-1.jpg"
            alt="Пространство"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative aspect-[16/10] w-full">
          <Image
            src="/about/space-2.jpg"
            alt="Пространство"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="relative aspect-[21/9] w-full">
          <Image
            src="/about/space-wide.jpg"
            alt="Кизуна – пространство"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <Divider />
    </section>
  );
}

function Info() {
  const MAP_HEIGHT = 420;

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center">
        Информация
      </h2>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-5 flex justify-center">
          <div
            className="h-full flex flex-col justify-center"
            style={{ minHeight: MAP_HEIGHT }}
          >
            <div className="space-y-10">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-[var(--kizuna-red)] mt-1" />
                <div>
                  
                  <div className="mt-1 text-lg font-semibold text-black">
                    info@kizuna.bg
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-[var(--kizuna-red)] mt-1" />
                <div>
                  
                  <div className="mt-1 text-lg font-semibold text-black">
                    +359 000 000 000
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-[var(--kizuna-red)] mt-1" />
                <div>
                  
                  <div className="mt-1 text-lg font-semibold text-black">
                    Standza 19, Varna, Bulgaria
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18266.48472124086!2d72.8197954828476!3d18.92759496362098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1db6c8bffff%3A0xb193d3eb83727466!2sKizuna%20Advisers!5e0!3m2!1sbg!2sbg!4v1767531343015!5m2!1sbg!2sbg"
            width="600"
            height={MAP_HEIGHT}
            style={{ border: 0, height: MAP_HEIGHT }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
            title="Google Map"
          />
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-black">
        <Hero />
        <KizunaMeaning />
        <Story />
        <WhatWeDo />
        <Place />
        <Info />
      </main>
    </>
  );
}

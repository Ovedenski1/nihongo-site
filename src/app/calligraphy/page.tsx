// src/app/calligraphy/page.tsx
"use client";

import Navbar from "@/components/Navbar";
import CalligraphyIntro from "@/components/CalligraphyIntro";
import CalligraphyCourseBlock, {
  type CalligraphyCourseItem,
} from "@/components/CalligraphyCourseBlock";
import CalligraphyCurriculum from "@/components/CalligraphyCurriculum";
import WhyChooseSection from "@/components/WhyChooseSection";

// ✅ Lucide icons
import { Mail, Phone, MapPin } from "lucide-react";

const calligraphyCourses: CalligraphyCourseItem[] = [
  {
    title: "Шодō за начинаещи",
    date: "January 11, 2026",
    scheduleLine: "Петък, 18:30–19:30",
    format: "Online",
    classesCount: 10,
    teacher: { name: "Sanae Asai", photo: "/teachers/teacher2.png" },
    description: [
      "Учениците ще научат щрихите с четката, използвани в основния стил каишо (редовен/стандартен стил). Групата е малка, а курсът включва и домашна работа, и време за практика по време на Zoom занятията.",
      "По време на Zoom часа учениците се очаква да показват работата си на преподавателя и останалите курсисти, за да може всички да се учат един от друг.",
      "Учениците трябва да закупят собствените си материали преди началото на курса. След като преминат този курс веднъж, могат да продължат към Шодō – Основни канджи.",
    ],
    note: "Не се изисква предишен опит по Шодō или японски език.",
    href: "/pricing",
  },
  {
    title: "Кана калиграфия",
    date: "January 18, 2026",
    scheduleLine: "Събота и неделя, 10:00–11:30",
    format: "Hybrid",
    classesCount: 6,
    teacher: { name: "Kenji Nakamura", photo: "/teachers/teacher5.png" },
    description: [
      "Научете красиво изписване на хирагана и катакана чрез ритъм, разстояния и контрол на четката.",
      "Фокус върху плавност и баланс, докато изграждате чист и елегантен стил, подходящ за картички и кратки стихове.",
    ],
    note: "Препоръчително е след „Шодō за начинаещи“ (но не е задължително).",
    href: "/pricing",
  },
  {
    title: "Композиция с канджи",
    date: "December 21, 2026",
    scheduleLine: "Уикенди, 12:00–14:00",
    format: "On-site",
    classesCount: 8,
    teacher: { name: "Mina Kobayashi", photo: "/teachers/teacher3.png" },
    description: [
      "Развийте по-силни композиции с канджи, като научите принципи за структура, разстояния и композиция.",
      "Ще създавате завършени творби и ще се научите как да прецизирате щрихите за по-силен ефект и яснота.",
    ],
    note: "Средно ниво — силно препоръчителен е опит с четка.",
    href: "/pricing",
  },
];

export default function CalligraphyPage() {
  return (
    <>
      <Navbar />
      {/* ✅ WHY SECTION (TOP, uses tanuki2.png) */}
      <WhyChooseSection
        title="Защо да учиш Шодō с Kizuna?"
        accent="#ed1925"
        imageSrc="/images/tanuki2.png"
        imageAlt="Тануки на Kizuna, което практикува калиграфия"
        scrollTargetId="calligraphy-classes"
        buttonText="Към занятията"
        teacherLink={{ href: "/teachers", label: "преподаватели" }}
        paragraphs={[
          {
            type: "text",
            text: "Шодō е повече от писане — това е спокойна практика за ритъм, баланс и фокус. Нашите занятия те водят стъпка по стъпка, за да се насладиш на традицията без да се чувстваш претоварен/а.",
          },
          {
            type: "teachers",
            before: "Нашите ",
            after:
              " преподават с ясни демонстрации, деликатни корекции и практични съвети, така че щрихите ти да се подобряват всяка седмица.",
          },
          {
            type: "text",
            text: "Ще научиш техника, стойка, контрол на четката и как да създаваш завършени творби — с обратна връзка, която е насърчаваща и конкретна.",
          },
        ]}
      />
      {/* HERO / INTRO */}
      <CalligraphyIntro />

      {/* Curriculum (optional placement — keep if you want it here) */}
      <CalligraphyCurriculum />

      {/* COURSES LIST */}
      <main className="min-h-screen bg-[#fafbfa] text-black">
        <section
          id="calligraphy-classes"
          className="mx-auto max-w-6xl px-6 py-16"
        >
          <h1 className="text-3xl md:text-4xl font-bold">
            Калиграфия (Шодō)
          </h1>
          <p className="mt-4 max-w-2xl text-black/70">
            Традиционни занятия по писане с четка — техника, ритъм, баланс и
            композиция.
          </p>

          <div className="mt-10">
            {calligraphyCourses.map((course, idx) => (
              <CalligraphyCourseBlock
                key={`${course.title}-${course.date}-${idx}`}
                item={course}
              />
            ))}
          </div>

          {/* CONTACT ROW (same style as Courses page) */}
          <div className="mt-20 flex flex-wrap items-center justify-center gap-16 text-lg font-medium">
            {/* Email */}
            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
                <Mail size={22} className="text-white" />
              </div>
              <span>info@kizuna.bg</span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
                <Phone size={22} className="text-white" />
              </div>
              <span>+359 000 000 000</span>
            </div>

            {/* Address */}
            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
                <MapPin size={22} className="text-white" />
              </div>
              <span>ул. „Станца“ 19, Варна, България</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

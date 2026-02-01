// src/app/calligraphy/page.tsx
"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import CalligraphyIntro from "@/components/CalligraphyIntro";
import CalligraphyCourseBlock, {
  type CalligraphyCourseItem,
} from "@/components/CalligraphyCourseBlock";
import CalligraphyCurriculum from "@/components/CalligraphyCurriculum";
import WhyChooseSection from "@/components/WhyChooseSection";

// ✅ Lucide icons
import { Mail, Phone, MapPin } from "lucide-react";

// ✅ DB
import { getCalligraphyCourses } from "@/lib/data";

export default function CalligraphyPage() {
  const [calligraphyCourses, setCalligraphyCourses] = useState<
    CalligraphyCourseItem[]
  >([]);

  useEffect(() => {
    (async () => {
      try {
        const rows = await getCalligraphyCourses();

        const mapped: CalligraphyCourseItem[] = rows.map((r) => ({
          title: r.title,
          date: r.date,
          scheduleLine: r.schedule_line,

          // keep prop present (even if block ignores it)
          format: "On-site",

          classesCount: r.classes_count,

          // ✅ NEW: price from DB (make sure your query returns it)
          price: typeof r.price === "number" ? r.price : undefined,

          teacher: {
            name: r.teacher?.name ?? "Предстои да бъде обявен",
            photo: r.teacher?.image ?? "/teachers/teacher1.png",
          },
          description: r.description ?? [],
          note: r.note ?? undefined,

          // legacy; button is handled inside CalligraphyCourseBlock (it goes to /contact)
          href: r.href ?? "/contact",
        }));

        setCalligraphyCourses(mapped);
      } catch (e) {
        console.error("getCalligraphyCourses error:", e);
        setCalligraphyCourses([]);
      }
    })();
  }, []);

  return (
    <>
      <Navbar />

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

      <CalligraphyIntro />
      <CalligraphyCurriculum />

      <main className="bg-[#fafbfa] text-black">
        <section id="calligraphy-classes" className="mx-auto max-w-6xl px-6 py-16">
          <h1 className="text-3xl md:text-4xl font-bold">Калиграфия (Шодō)</h1>

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

          <div className="mt-20 flex flex-wrap items-center justify-center gap-16 text-lg font-medium">
            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
                <Mail size={22} className="text-white" />
              </div>
              <span>info@kizuna.bg</span>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
                <Phone size={22} className="text-white" />
              </div>
              <span>+359 000 000 000</span>
            </div>

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

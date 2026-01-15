import type { BookItem } from "@/components/BookSlider";
import type { Level } from "@/components/LevelOverview";
import type { CourseItem } from "@/components/CourseCard";

// Level now includes "All" in the UI, but config data should NOT require it.
export type ConfigLevel = Exclude<Level, "All">;

export type CourseWithLevel = CourseItem & { level: ConfigLevel };

export type LevelOverviewData = Record<
  ConfigLevel,
  { heading: string; intro: string[]; contents: string[]; eligibility: string }
>;

export type CoursesPageConfig = {
  pageTitle: string;
  whyChoose: {
    title: string;
    paragraphs: string[];
    buttonText: string;
    imageSrc: string;
    teachersLinkText: string;
    teachersHref: string;
  };
  levelOverview: LevelOverviewData;
  booksByLevel: Record<ConfigLevel, BookItem[]>;
  courses: CourseWithLevel[];
};

export const defaultCoursesConfig: CoursesPageConfig = {
  pageTitle: "Езикови курсове",
  whyChoose: {
    title: "Защо да изберете Kizuna?",
    paragraphs: [
      "В Kizuna изучаването на японски език е свързано с общуване — не със заучаване наизуст. Уроците ни са създадени така, че да ви помогнат да общувате естествено и уверено в реални ситуации.",
      // keep the token "teachers" because the component splits by it
      "Нашите teachers са носители на езика с богат преподавателски опит, внимателно подбрани заради ясния си стил, търпението и умението да се адаптират към темпото на всеки ученик.",
      "Независимо дали се подготвяте за JLPT или учите за ежедневието, ние ви водим стъпка по стъпка — така винаги знаете какво учите и защо е важно.",
    ],
    buttonText: "Към курсовете",
    imageSrc: "/images/tanuki.png",
    teachersLinkText: "преподаватели",
    teachersHref: "/teachers",
  },

  levelOverview: {
    Basic: {
      heading: "Основен японски",
      intro: [
        "Основното ниво е приятелска начална точка, ако никога не сте учили японски.",
        "Ще научите произношение, поздрави и основите, които са нужни преди преминаване към JLPT нивата.",
      ],
      contents: [
        "Хирагана + начална катакана",
        "Основни поздрави и ежедневни фрази",
        "Базови изреченски модели",
        "Упражнения за слушане и говорене",
        "Кратка практика по четене",
      ],
      eligibility:
        "Не се изисква предишен опит. Перфектно за напълно начинаещи или за всеки, който иска да започне отначало.",
    },
    N5: {
      heading: "JLPT N5",
      intro: [
        "JLPT N5 е първото базово ниво на изпита Japanese Language Proficiency Test.",
        "Ще изградите основи в четене, слушане, речник и базови канджи, за да се справяте с ежедневни ситуации.",
      ],
      contents: [
        "Граматика, слушане, канджи, четене, речник",
        "Редовна домашна работа и практическо упражнение",
        "Месечни проверки за устойчив напредък",
        "Задачи в JLPT формат",
        "Пробен тест в края на курса",
      ],
      eligibility:
        "Добре е да се чувствате уверени с хирагана и катакана. Ако не — започнете първо с Основно ниво.",
    },
    N4: {
      heading: "JLPT N4",
      intro: [
        "JLPT N4 затвърждава основната граматика и разширява ежедневния речник.",
        "Ще четете по-естествени изречения и ще изградите увереност в реален разговор.",
      ],
      contents: [
        "Разширени граматични модели и частици",
        "По-дълги задачи за слушане и четене",
        "Развитие на речника + затвърждаване на канджи",
        "Ролеви упражнения за разговор",
        "Пробен тест и стратегия за JLPT подготовка",
      ],
      eligibility:
        "Препоръчително след завършено N5 или доказани еквивалентни умения.",
    },
    N3: {
      heading: "JLPT N3",
      intro: [
        "JLPT N3 е мостът към средно ниво японски.",
        "Ще се справяте с по-сложни текстове, по-бързо слушане и по-широк речник за ежедневието.",
      ],
      contents: [
        "Средно ниво граматика + нюанси",
        "Четене на кратки статии и известия",
        "Слушане: диалози с естествена скорост",
        "Разширяване на канджи и речник",
        "JLPT упражнения + пробни тестове",
      ],
      eligibility:
        "Препоръчително след N4 или еквивалент (увереност в базова граматика и четене на кана).",
    },
    N2: {
      heading: "JLPT N2",
      intro: [
        "JLPT N2 е напреднало-средно ниво и важен етап за цели, свързани с работа/учене.",
        "Ще развивате скорост, разбиране и точност при по-дълги материали и сложна граматика.",
      ],
      contents: [
        "Напреднали граматични структури и синоними",
        "Дълги текстове за четене и обобщения",
        "Практика по слушане с висока скорост",
        "Канджи/речник за новини и формални контексти",
        "Пробни тестове + обучение за управление на времето",
      ],
      eligibility:
        "Препоръчително след N3 или еквивалент (стабилно средно ниво четене и слушане).",
    },
    N1: {
      heading: "JLPT N1",
      intro: [
        "JLPT N1 е най-високото JLPT ниво и се фокусира върху много напреднал японски.",
        "Ще тренирате с плътни текстове, абстрактни теми и слушане с естествена скорост на носители на езика.",
      ],
      contents: [
        "Високо ниво граматика и изрази",
        "Новини/редакционни текстове и академично четене",
        "Слушане с естествена скорост + извеждане на смисъл",
        "Канджи/речник за сложни теми",
        "Интензивни пробни тестове + преговор",
      ],
      eligibility:
        "Препоръчително след N2 или еквивалент. Изисква се висока скорост на четене и отлично слушане с разбиране.",
    },
  },

    booksByLevel: {
    Basic: [
      {
        title: "Beginner 1: Survival Japanese (Basic)",
        subtitle: "Започнете да говорите с прости и полезни фрази.",
        image: "/books/basic.jpg",
        features: [
          {
            title: "Лесно и практично",
            text: "Научете поздрави и ежедневни фрази, които можете да използвате веднага.",
          },
          {
            title: "Стабилна основа",
            text: "Изградете увереност със слушане + първи навици за четене още от първия ден.",
          },
          {
            title: "Подходящо за клас",
            text: "Перфектно за начинаещи — ясна структура и повторение.",
          },
        ],
        priceLine: "Отлична подготовка преди JLPT N5.",
      },
    ],

    N5: [
      {
        title: "Beginner 1: Japanese Textbook N5",
        subtitle: "Разговорен японски за начинаещи",
        image: "/books/book1.jpg",
        features: [
          {
            title: "Говорете естествено",
            text: "Разговорният стил помага да звучите по-естествено на японски.",
          },
          {
            title: "Учете това, което ви вълнува",
            text: "Различни ситуации и фрази за „survival“ японски.",
          },
          {
            title: "Гъвкаво, практично и актуално",
            text: "Полезна граматика и реални ситуации за вашите приключения.",
          },
          {
            title: "Практика, практика и още практика!",
            text: "Много упражнения във всеки урок за усвояване на естествени фрази.",
          },
          {
            title: "Достъпна цена + аудио",
            text: "Цена: ¥2090 с включен данък. Аудио материалите са включени.",
          },
        ],
        ctaText: "Можете да изтеглите всички аудио записи от книгата оттук.",
        ctaHref: "/pricing",
      },
    ],

    N4: [
      {
        title: "JLPT N4 Main Textbook",
        subtitle: "Граматика + структура за четене",
        image: "/books/n4.jpg",
        features: [
          {
            title: "По-задълбочена граматика",
            text: "Усвоете ключови модели с ясни примери.",
          },
          {
            title: "Практика по четене",
            text: "Кратки текстове за скорост и разбиране.",
          },
        ],
      },
    ],

    N3: [
      {
        title: "JLPT N3 Textbook",
        subtitle: "Средно ниво граматика + четене",
        image: "/books/n3.jpg",
        features: [
          {
            title: "Реални материали",
            text: "Мост към съдържание, близко до нивото на носители на езика.",
          },
          {
            title: "Развитие на слушането",
            text: "Разбирайте по-дълги разговори и съобщения.",
          },
        ],
      },
    ],

    N2: [
      {
        title: "JLPT N2 Textbook",
        subtitle: "Напреднало четене + граматика",
        image: "/books/n2.jpg",
        features: [
          {
            title: "Плътно четене",
            text: "Тренировка с по-дълги текстове и въпроси по смисъл.",
          },
          {
            title: "Високо ниво граматика",
            text: "Усвоете нюансирани форми, използвани във формален японски.",
          },
        ],
      },
    ],

    N1: [
      {
        title: "JLPT N1 Textbook",
        subtitle: "Почти ниво на носител на езика",
        image: "/books/n1.jpg",
        features: [
          {
            title: "Сложно съдържание",
            text: "Академични и редакционни текстове.",
          },
          {
            title: "Нюансиран език",
            text: "Фини разлики в граматика и речник.",
          },
        ],
      },
    ],
  },


  courses: [
    {
      level: "Basic",
      date: "6 януари 2026",
      title: "Японски – основно ниво",
      totalHours: 40,
      price: "620",
      days: ["Пон", "Сря"],
      time: "18:00–20:00",
      format: "On-site",
      teacher: { name: "Yuki Tanaka", photo: "/teachers/teacher1.png" },
      href: "/pricing",
    },
    {
      level: "N5",
      date: "20 януари 2026",
      title: "Японски N5",
      totalHours: 60,
      price: "980",
      days: ["Пон", "Сря", "Пет"],
      time: "18:00–21:00",
      format: "On-site",
      teacher: { name: "Yuki Tanaka", photo: "/teachers/teacher1.png" },
      href: "/pricing",
    },
    {
      level: "N4",
      date: "13 януари 2026",
      title: "Японски N4",
      totalHours: 40,
      price: "720",
      days: ["Вто", "Чет"],
      time: "19:00–21:00",
      format: "Hybrid",
      teacher: { name: "Mina Kobayashi", photo: "/teachers/teacher3.png" },
      href: "/pricing",
    },
    {
      level: "N3",
      date: "21 януари 2026",
      title: "Японски N3",
      totalHours: 60,
      price: "980",
      days: ["Пон", "Сря", "Пет"],
      time: "18:00–21:00",
      format: "On-site",
      teacher: { name: "Yuki Tanaka", photo: "/teachers/teacher1.png" },
      href: "/pricing",
    },
    {
      level: "N2",
      date: "11 януари 2026",
      title: "Японски N2",
      totalHours: 30,
      price: "540",
      days: ["Съб"],
      time: "10:00–13:00",
      format: "Online",
      teacher: { name: "Haruto Sato", photo: "/teachers/teacher4.png" },
      href: "/pricing",
    },
    {
      level: "N1",
      date: "30 януари 2026",
      title: "Японски N1",
      totalHours: 60,
      price: "980",
      days: ["Пон", "Сря", "Пет"],
      time: "18:00–21:00",
      format: "On-site",
      teacher: { name: "Yuki Tanaka", photo: "/teachers/teacher1.png" },
      href: "/pricing",
    },
  ],
};

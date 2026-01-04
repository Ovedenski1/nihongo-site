// app/components/HomeHeader.tsx
import Image from "next/image";

export default function HomeHeader() {
  return (
    <header className="relative z-30 bg-[#f3f2e8]">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
        {/* left spacer so title/pills don't overlap the wedge logo area */}
        <div className="w-[88px] sm:w-[140px] shrink-0" />

        {/* title */}
        <h1 className="hidden sm:block pill-text text-3xl tracking-widest text-[#2b2b2b] select-none">
          Kizuna
        </h1>

        {/* pills */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Pill label="Courses" icon="💬" accent />
          <Pill label="Pricing" icon="✍️" />
          <Pill label="News" icon="🌐" />
          <Pill label="About" icon="▾" />
        </div>

        {/* search box inside header area */}
        <div className="ml-4 hidden md:block">
          <div className="search-box">
            <div className="search-icon">🔍</div>
            <div className="search-title">
              Search for
              <br />
              information
            </div>
            <div className="search-arrow">⌄</div>
          </div>
        </div>
      </nav>

      {/* red circle logo (optional) */}
      <div className="absolute left-[clamp(56px,8vw,110px)] top-[clamp(10px,2vw,25px)] z-40 -translate-x-1/2">
        <div className="h-20 w-20 sm:h-28 sm:w-28 rounded-full bg-[#ed1925] ring-4 ring-[#f30909] shadow-lg flex items-center justify-center">
          <Image
            src="/logo1.png"
            alt="Logo"
            width={66}
            height={66}
            priority
            className="object-contain w-[44px] h-[44px] sm:w-[66px] sm:h-[66px]"
          />
        </div>
      </div>
    </header>
  );
}

function Pill({
  label,
  icon,
  accent,
}: {
  label: string;
  icon: string;
  accent?: boolean;
}) {
  return (
    <a
      href="#"
      className={[
        "inline-flex items-center gap-2",
        "h-10 sm:h-11 px-4 sm:px-5 rounded-2xl",
        "border shadow-sm transition",
        "hover:-translate-y-[1px] hover:shadow-md",
        "text-sm sm:text-base whitespace-nowrap pill-text",
        accent
          ? "bg-[#bfe9e1] border-white/70 text-black"
          : "bg-white border-black/10 text-black",
      ].join(" ")}
    >
      <span>{icon}</span>
      <span className="font-medium">{label}</span>
    </a>
  );
}

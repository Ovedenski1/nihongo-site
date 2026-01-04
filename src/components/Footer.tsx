import Image from "next/image";
import Link from "next/link";

/* ------------------ DATA ------------------ */

const quickLinks = [
  { label: "Японски език", href: "/japanese" },
  { label: "Калиграфия", href: "/calligraphy" },
  { label: "Екип", href: "/team" },
  { label: "Новини", href: "/news" },
  { label: "За нас", href: "/about" },
];

const socialLinks = [
  { id: "instagram", label: "@kizuna_japan", href: "https://instagram.com", icon: InstagramIcon },
  { id: "facebook", label: "Kizuna Japan", href: "https://facebook.com", icon: FacebookIcon },
  { id: "youtube", label: "@kizunajapan", href: "https://youtube.com", icon: YouTubeIcon },
  { id: "x", label: "@kizunajapan", href: "https://x.com", icon: XIcon },
  { id: "tiktok", label: "@kizunajapan", href: "https://tiktok.com", icon: TikTokIcon },
];

/* ------------------ COMPONENT ------------------ */

export default function Footer() {
  return (
    <>
      {/* RED FOOTER */}
      <footer className="bg-[#ed1925] text-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-3">
            {/* LEFT COLUMN */}
            <div>
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-4">
                  <div className="relative h-14 w-14">
                    <Image
                      src="/logo3.png"
                      alt="Kizuna"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div>
                    <div className="text-4xl font-light tracking-[0.35em]">
                      KIZUNA
                    </div>
                    <div className="text-xs opacity-90 -mt-1">
                      КЛУБ ПО ЯПОНСКИ ЕЗИК
                    </div>
                  </div>
                </Link>
              </div>

              <h3 className="mt-6 text-lg font-semibold text-[#F6B81A]">
                Централен офис на Kizuna Education
              </h3>

              <div className="mt-4 space-y-3 text-sm leading-6">
                <div className="flex gap-3">
                  <span className="mt-0.5 opacity-90">
                    <PinIcon />
                  </span>
                  <p>
                    Standza 19, Varna, Bulgaria
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="mt-0.5 opacity-90">
                    <MailIcon />
                  </span>
                  <a
                    href="mailto:info@kizuna.bg"
                    className="underline underline-offset-4 hover:opacity-90"
                  >
                    info@kizuna.bg
                  </a>
                </div>

                <div className="flex gap-3">
                  <span className="mt-0.5 opacity-90">
                    <PhoneIcon />
                  </span>
                  <a
                    href="tel:+359000000000"
                    className="underline underline-offset-4 hover:opacity-90"
                  >
                    +359 000 000 000
                  </a>
                </div>
              </div>
            </div>

            {/* MIDDLE COLUMN */}
            <div>
              <h3 className="text-xl font-semibold text-[#F6B81A]">
                Бързи връзки
              </h3>

              <ul className="mt-5 space-y-3 text-sm">
                {quickLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:opacity-90">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT COLUMN */}
            <div>
              <h3 className="text-xl font-semibold text-[#F6B81A]">
                Социални мрежи
              </h3>

              <ul className="mt-5 space-y-4 text-sm">
                {socialLinks.map((s) => (
                  <li key={s.id} className="flex items-center gap-4">
                    <span className="opacity-95">
                      <s.icon />
                    </span>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:opacity-90"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* DIVIDER + PRIVACY */}
          <div className="mt-12 h-px w-full bg-white/40" />
          <div className="mt-6 flex justify-end text-sm opacity-95">
            <Link href="/privacy" className="hover:opacity-90">
              Политика за защита на личните данни
            </Link>
          </div>
        </div>
      </footer>

      {/* BLACK BAR */}
      <div className="bg-black text-white text-xs">
        <div className="mx-auto max-w-6xl px-6 py-3 text-center opacity-80">
          © 2009–2023 Всички права запазени
        </div>
      </div>
    </>
  );
}

/* ------------------ ICONS ------------------ */

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="2" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L9 10a16 16 0 0 0 5 5l.6-.9a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v3H7v3h3v6h3v-6h3l1-3h-4v-3c0-.6.4-1 1-1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 12s0-3.5-.4-5.1c-.2-.9-.9-1.6-1.8-1.8C17.2 4.7 12 4.7 12 4.7s-5.2 0-6.8.4c-.9.2-1.6.9-1.8 1.8C3 8.5 3 12 3 12s0 3.5.4 5.1c.2.9.9 1.6 1.8 1.8 1.6.4 6.8.4 6.8.4s5.2 0 6.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-5.1.4-5.1Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M10 9.5v5l5-2.5-5-2.5Z" fill="currentColor" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 4v10.2a3.8 3.8 0 1 1-3-3.7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 6c1.2 1.8 3 3 5 3.2V6.8c-2.2-.2-3.8-1.2-5-2.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

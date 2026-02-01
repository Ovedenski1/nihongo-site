"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-6xl px-6 h-[76px] flex items-center">
        {/* LEFT — LOGO = HOME */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-9 w-9">
            <Image
              src="/logo2.png"
              alt="Kizuna logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="leading-tight">
            <div className="font-extrabold tracking-wide text-lg">
              Кизуна
            </div>
            <div className="text-[11px] text-black/60 font-semibold">
              Езикова школа по японски език
            </div>
          </div>
        </Link>

        {/* CENTER NAV */}
        <nav className="ml-10 hidden md:flex gap-6 text-sm font-medium text-black/70">
          <Link
            href="/courses"
            className="hover:text-black transition-colors"
          >
            Японски език
          </Link>

          <Link
            href="/calligraphy"
            className="hover:text-black transition-colors"
          >
            Калиграфия
          </Link>

          <Link
            href="/teachers"
            className="hover:text-black transition-colors"
          >
            Екип
          </Link>

          <Link
            href="/news"
            className="hover:text-black transition-colors"
          >
            Новини
          </Link>

          <Link
            href="/contact"
            className="hover:text-black transition-colors"
          >
            Контакти
          </Link>

          <Link
            href="/about"
            className="hover:text-black transition-colors"
          >
            За нас
          </Link>
        </nav>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden sm:inline-flex rounded-full bg-[var(--kizuna-red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Запиши се
          </Link>

          {/* Mobile menu placeholder */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-lg border border-black/10 p-2 text-black"
            aria-label="Меню"
          >
            <span className="grid gap-1">
              <span className="block h-0.5 w-5 bg-black" />
              <span className="block h-0.5 w-5 bg-black" />
              <span className="block h-0.5 w-5 bg-black" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

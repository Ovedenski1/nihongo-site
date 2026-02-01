// src/app/admin/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import AdminGuard from "@/components/AdminGuard";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";

function SimpleCard({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="
        block rounded-2xl border border-black/10 bg-white
        px-8 py-10 text-xl font-semibold
        shadow-sm transition
        hover:shadow-md hover:-translate-y-0.5
        focus:outline-none focus:ring-2 focus:ring-black/20
      "
    >
      {label}
    </Link>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await supabase.auth.signOut();

      // send them away from admin after logout
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error("Logout error:", e);
      setLoggingOut(false);
    }
  }

  return (
    <AdminGuard>
      <Navbar />

      <main className="min-h-screen bg-white text-black overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-6 py-14">
          {/* Title row + logout */}
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              Администраторски панел
            </h1>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="
                inline-flex items-center justify-center
                rounded-full border border-black/10 bg-white
                px-5 py-2 text-sm font-semibold
                shadow-sm transition
                hover:shadow-md
                disabled:opacity-60
              "
            >
              {loggingOut ? "Излизане…" : "Изход"}
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-4">
            <SimpleCard href="/admin/courses" label="Добави курсове" />
            <SimpleCard href="/admin/teachers" label="Добави преподаватели" />
            <SimpleCard href="/admin/news" label="Добави новини" />
            <SimpleCard href="/admin/calligraphy" label="Добави калиграфия" />
            <SimpleCard href="/admin/test" label="Добави тест" />
          </div>
        </div>
      </main>
    </AdminGuard>
  );
}

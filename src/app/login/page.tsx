"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // ✅ If already logged in, redirect away from /login
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      if (data.session) {
        router.replace("/admin");
        return;
      }

      setCheckingSession(false);
    })();

    // ✅ Also react to auth changes (login/logout in another tab)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.replace("/admin");
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) setError(error.message);
    else router.push("/admin");
  }

  // ✅ While checking session, render nothing (prevents “flash” of login form)
  if (checkingSession) return null;

  return (
    <>
      <Navbar />

      {/* ✅ Fills screen so footer stays below */}
      <main className="bg-white min-h-[calc(100vh-80px)] flex items-center">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mx-auto max-w-xl">
            <form
              onSubmit={signIn}
              className="
                rounded-3xl bg-white
                border border-black/10
                p-10 md:p-12
                shadow-[0_25px_60px_rgba(0,0,0,0.10)]
              "
            >
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
                Администраторски вход
              </h1>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Имейл
                </label>
                <input
                  type="email"
                  className="
                    w-full rounded-xl
                    border border-black/10
                    px-4 py-3
                    focus:outline-none focus:ring-2 focus:ring-black/20
                  "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold mb-2">
                  Парола
                </label>
                <input
                  type="password"
                  className="
                    w-full rounded-xl
                    border border-black/10
                    px-4 py-3
                    focus:outline-none focus:ring-2 focus:ring-black/20
                  "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="mb-5 text-sm text-red-600 text-center">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full rounded-full
                  bg-[#F5C84B]
                  py-4
                  text-lg
                  font-extrabold
                  transition
                  hover:brightness-95
                  disabled:opacity-60
                "
              >
                {loading ? "Влизане…" : "Вход"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

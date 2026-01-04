"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);
    else router.push("/admin");
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={signIn}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <h1 className="text-xl font-bold">Admin Login</h1>

        <input
          className="mt-4 w-full rounded-lg px-3 py-2 text-black"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mt-3 w-full rounded-lg px-3 py-2 text-black"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <button className="mt-4 w-full rounded-lg bg-white px-4 py-2 text-black font-medium">
          Login
        </button>
      </form>
    </main>
  );
}

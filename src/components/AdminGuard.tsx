"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      const { data: sessionData } = await supabase.auth.getSession();

      // 1) must be logged in
      const user = sessionData.session?.user;
      if (!user) {
        router.replace("/login");
        return;
      }

      // 2) must be admin (in admins table)
      const { data: adminRow, error } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error || !adminRow) {
        router.replace("/");
        return;
      }

      setLoading(false);
    }

    check();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-white/70">Checking admin access...</p>
      </main>
    );
  }

  return <>{children}</>;
}

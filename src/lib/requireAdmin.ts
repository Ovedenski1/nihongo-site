import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export async function requireAdmin() {
  // IMPORTANT: this uses anon key, but checks the user's session via cookies won't work
  // in server components unless we use SSR auth helpers.
  // So for now we do a simpler approach: protect admin pages on the client (next step).
  // We'll upgrade to true server-side protection after.
  return;
}

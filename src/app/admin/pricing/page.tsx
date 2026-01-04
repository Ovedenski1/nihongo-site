"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminGuard from "@/components/AdminGuard";

type Plan = {
  id: string;
  name: string;
  price: string;
  description: string;
};

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [saving, setSaving] = useState(false);
const [message, setMessage] = useState<string>("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("pricing_plans").select("*");
      if (data) setPlans(data);
    }
    load();
  }, []);

  async function savePlan(plan: Plan) {
  setSaving(true);
  setMessage("");

  const { error } = await supabase
    .from("pricing_plans")
    .update({
      name: plan.name,
      price: plan.price,
      description: plan.description,
    })
    .eq("id", plan.id);

  setSaving(false);

  if (error) {
    setMessage("❌ Save failed: " + error.message);
  } else {
    setMessage("✅ Saved!");
  }
}

  return (
    <AdminGuard>
      <main className="min-h-screen px-6 py-16">
        <h1 className="text-3xl font-bold">Edit Pricing</h1>
        {message && <p className="mt-3 text-sm text-white/70">{message}</p>}

        <div className="mt-8 space-y-6 max-w-2xl">
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <input
  className="w-full rounded-lg bg-white px-3 py-2 text-black font-medium outline-none"
  value={plan.name}
  onChange={(e) => {
    const copy = [...plans];
    copy[i].name = e.target.value;
    setPlans(copy);
  }}
/>

<input
  className="mt-3 w-full rounded-lg bg-white px-3 py-2 text-black outline-none"
  value={plan.price}
  onChange={(e) => {
    const copy = [...plans];
    copy[i].price = e.target.value;
    setPlans(copy);
  }}
/>

<textarea
  className="mt-3 w-full rounded-lg bg-white px-3 py-2 text-black outline-none"
  value={plan.description}
  onChange={(e) => {
    const copy = [...plans];
    copy[i].description = e.target.value;
    setPlans(copy);
  }}
/>


              <button
                onClick={() => savePlan(plan)}
                className="mt-4 rounded-lg bg-white px-4 py-2 text-black font-medium"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </AdminGuard>
  );
}

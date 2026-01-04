import { supabase } from "@/lib/supabaseClient";

export default async function PricingPage() {
  const { data: plans } = await supabase
    .from("pricing_plans")
    .select("*");

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold">Pricing</h1>
        <p className="mt-4 text-white/70">
          Prices are loaded directly from the database.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans?.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <div className="mt-3 text-3xl font-bold">{p.price}</div>
              <p className="mt-4 text-sm text-white/70">{p.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

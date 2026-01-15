import AdminGuard from "@/components/AdminGuard";
import Navbar from "@/components/Navbar";
import Link from "next/link";

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
  return (
    <AdminGuard>
      <Navbar />

      <main className="min-h-screen bg-white text-black overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h1 className="text-3xl md:text-4xl font-bold">
            Администраторски панел
          </h1>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-4">
            <SimpleCard href="/admin/courses" label="Добави курсове" />
            <SimpleCard href="/admin/teachers" label="Добави преподаватели" />
            <SimpleCard href="/admin/news" label="Добави новини" />
            <SimpleCard href="/admin/calligraphy" label="Добави калиграфия" />
          </div>
        </div>
      </main>
    </AdminGuard>
  );
}

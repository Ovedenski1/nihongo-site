"use client";

import Image from "next/image";

export type BookItem = {
  title: string;
  subtitle?: string;
  image: string;

  features?: { title: string; text: string }[];

  // optional extras used in your defaults
  priceLine?: string;
  ctaText?: string;
  ctaHref?: string;
};

export default function BookSlider({
  title,
  books,
}: {
  title: string;
  books: BookItem[];
}) {
  // ✅ Show only one book (no slider)
  const book = books?.[0];

  if (!book) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold">{title}</h2>

      {/* SAME “book showcase” layout: image left, text right */}
      <div className="mt-8 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* LEFT: IMAGE */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-[520px]">
              {/* keep it “big” like your screenshot */}
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* RIGHT: TEXT */}
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-[#0B1E54]">
              {book.title}
            </h3>

            {book.subtitle ? (
              <p className="mt-2 text-black/60">{book.subtitle}</p>
            ) : null}

            <div className="mt-10 space-y-10">
              {(book.features ?? []).map((f) => (
                <div key={`${f.title}-${f.text}`}>
                  <div className="text-xl font-bold text-[#0B1E54]">
                    {f.title}
                  </div>
                  <div className="mt-2 text-black/70 leading-7">{f.text}</div>
                </div>
              ))}
            </div>

            {/* Optional extra line like in your screenshot: "Цена..." */}
            {book.priceLine ? (
              <p className="mt-10 text-black/70 leading-7">{book.priceLine}</p>
            ) : null}

            {/* Optional link like "Можете да изтеглите..." */}
            {book.ctaText && book.ctaHref ? (
              <div className="mt-8">
                <a
                  href={book.ctaHref}
                  className="text-[#0B1E54] underline underline-offset-4"
                >
                  {book.ctaText}
                </a>
              </div>
            ) : null}
          </div>
        </div>

        {/* ✅ Removed slider controls (Prev/Next + dots) */}
      </div>
    </section>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { SpecialsData } from "@/lib/types";

function formatPrice(price: string): string {
  const trimmed = price.trim();
  if (trimmed.startsWith("£")) return trimmed;
  return `£${trimmed}`;
}

export function SpecialsBoard({ specials }: { specials: SpecialsData }) {
  const router = useRouter();

  useEffect(() => {
    const refresh = setInterval(() => router.refresh(), 5 * 60 * 1000);
    return () => clearInterval(refresh);
  }, [router]);

  return (
    <div className="tv-screen flex min-h-screen flex-col bg-[#14110e] px-16 py-12 text-[#f5efe6]">
      <header className="mb-10 border-b-4 border-[#d4a853] pb-6">
        <h1 className="text-7xl font-black uppercase tracking-wide text-[#d4a853]">
          {specials.title}
        </h1>
        <p className="mt-3 text-3xl font-light text-[#c9bfb0]">
          Available today only
        </p>
      </header>

      <div className="flex flex-1 flex-col gap-10">
        <section className="rounded-3xl border-4 border-[#d4a853] bg-[#d4a853]/10 p-12">
          {specials.hero.badge && (
            <span className="mb-4 inline-block rounded-full bg-[#d4a853] px-6 py-2 text-2xl font-bold uppercase tracking-wider text-[#14110e]">
              {specials.hero.badge}
            </span>
          )}
          <div className="flex items-end justify-between gap-8">
            <div>
              <h2 className="text-6xl font-black text-[#f5efe6]">
                {specials.hero.name}
              </h2>
              {specials.hero.description && (
                <p className="mt-4 max-w-3xl text-3xl leading-snug text-[#c9bfb0]">
                  {specials.hero.description}
                </p>
              )}
            </div>
            <span className="shrink-0 text-8xl font-black text-[#d4a853]">
              {formatPrice(specials.hero.price)}
            </span>
          </div>
        </section>

        {specials.offers.length > 0 && (
          <section className="grid flex-1 grid-cols-2 gap-8">
            {specials.offers.map((offer) => (
              <article
                key={offer.id}
                className="rounded-2xl border-2 border-[#d4a853]/30 bg-[#1c1814] p-8"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-4xl font-bold">{offer.name}</h3>
                  <span className="shrink-0 text-4xl font-bold text-[#d4a853]">
                    {formatPrice(offer.price)}
                  </span>
                </div>
                {offer.description && (
                  <p className="mt-3 text-2xl leading-snug text-[#a89a88]">
                    {offer.description}
                  </p>
                )}
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

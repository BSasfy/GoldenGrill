"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { DisplayTheme } from "@/lib/types";
import { tvScreenClass } from "@/lib/display-theme";
import type { SpecialsData } from "@/lib/types";

function formatPrice(price: string): string {
  const trimmed = price.trim();
  if (trimmed.startsWith("£")) return trimmed;
  return `£${trimmed}`;
}

export function SpecialsBoard({
  specials,
  theme = "dark",
}: {
  specials: SpecialsData;
  theme?: DisplayTheme;
}) {
  const router = useRouter();

  useEffect(() => {
    const refresh = setInterval(() => router.refresh(), 5 * 60 * 1000);
    return () => clearInterval(refresh);
  }, [router]);

  return (
    <div className={`${tvScreenClass(theme)} flex min-h-screen flex-col px-16 py-12`}>
      <header className="tv-header mb-10 border-b-4 pb-6">
        <h1 className="tv-title text-7xl font-black uppercase tracking-wide">
          {specials.title}
        </h1>
        <p className="tv-tagline mt-3 text-3xl">Available today only</p>
      </header>

      <div className="flex flex-1 flex-col gap-10">
        <section className="tv-hero rounded-3xl border-4 p-12">
          {specials.hero.badge && (
            <span className="tv-badge mb-4 inline-block rounded-full px-6 py-2 text-2xl font-bold uppercase tracking-wider">
              {specials.hero.badge}
            </span>
          )}
          <div className="flex items-end justify-between gap-8">
            <div>
              <h2 className="tv-item-name text-6xl font-black">{specials.hero.name}</h2>
              {specials.hero.description && (
                <p className="tv-tagline mt-4 max-w-3xl text-3xl leading-snug">
                  {specials.hero.description}
                </p>
              )}
            </div>
            <span className="tv-price shrink-0 text-8xl font-black">
              {formatPrice(specials.hero.price)}
            </span>
          </div>
        </section>

        {specials.offers.length > 0 && (
          <section className="grid flex-1 grid-cols-2 gap-8">
            {specials.offers.map((offer) => (
              <article key={offer.id} className="tv-offer-card rounded-2xl border-2 p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="tv-item-name text-4xl font-bold">{offer.name}</h3>
                  <span className="tv-price shrink-0 text-4xl font-bold">
                    {formatPrice(offer.price)}
                  </span>
                </div>
                {offer.description && (
                  <p className="tv-description mt-3 text-2xl leading-snug">
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

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
    <div className={`${tvScreenClass(theme)} tv-layout`}>
      <header className="tv-header tv-header-block border-b">
        <h1 className="tv-title font-black uppercase tracking-wide">{specials.title}</h1>
        <p className="tv-tagline">Available today only</p>
      </header>

      <div className="tv-specials-body">
        <section className="tv-hero border">
          {specials.hero.badge && (
            <span className="tv-badge inline-block rounded-full">{specials.hero.badge}</span>
          )}
          <div className="flex items-end justify-between gap-8">
            <div>
              <h2 className="tv-hero-name">{specials.hero.name}</h2>
              {specials.hero.description && (
                <p className="tv-hero-description">{specials.hero.description}</p>
              )}
            </div>
            <span className="tv-hero-price shrink-0">{formatPrice(specials.hero.price)}</span>
          </div>
        </section>

        {specials.offers.length > 0 && (
          <section className="tv-offers-grid">
            {specials.offers.map((offer) => (
              <article key={offer.id} className="tv-offer-card border">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="tv-offer-name">{offer.name}</h3>
                  <span className="tv-offer-price shrink-0">{formatPrice(offer.price)}</span>
                </div>
                {offer.description && (
                  <p className="tv-offer-description">{offer.description}</p>
                )}
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

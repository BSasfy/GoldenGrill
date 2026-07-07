"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { DisplayTheme } from "@/lib/display-theme";
import { tvScreenClass } from "@/lib/display-theme";
import type { MenuData } from "@/lib/types";

function formatPrice(price: string): string {
  const trimmed = price.trim();
  if (trimmed.startsWith("£")) return trimmed;
  return `£${trimmed}`;
}

export function MenuBoard({
  menu,
  theme = "bright",
}: {
  menu: MenuData;
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
          {menu.title}
        </h1>
        {menu.tagline && (
          <p className="tv-tagline mt-3 text-3xl">{menu.tagline}</p>
        )}
      </header>

      <div className="grid flex-1 grid-cols-3 gap-12">
        {menu.categories.map((category) => (
          <section key={category.id}>
            <h2 className="tv-category mb-6 border-b-2 pb-3 text-4xl font-bold uppercase tracking-wider">
              {category.name}
            </h2>
            <ul className="space-y-5">
              {category.items.map((item) => (
                <li key={item.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-3xl font-semibold">{item.name}</span>
                    <span className="tv-price shrink-0 text-3xl font-bold">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  {item.description && (
                    <p className="tv-description mt-1 text-xl leading-snug">
                      {item.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

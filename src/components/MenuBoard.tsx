"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { DisplayTheme } from "@/lib/types";
import { tvScreenClass } from "@/lib/display-theme";
import type { MenuData } from "@/lib/types";

function formatPrice(price: string): string {
  const trimmed = price.trim();
  if (trimmed.startsWith("£")) return trimmed;
  return `£${trimmed}`;
}

export function MenuBoard({
  menu,
  theme = "dark",
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
    <div className={`${tvScreenClass(theme)} tv-layout`}>
      <header className="tv-header tv-header-block border-b">
        <h1 className="tv-title font-black uppercase tracking-wide">{menu.title}</h1>
        {menu.tagline && <p className="tv-tagline">{menu.tagline}</p>}
      </header>

      <div className="tv-content">
        <div className="tv-menu-grid">
          {menu.categories.map((category) => (
            <section key={category.id}>
              <h2 className="tv-category border-b font-bold uppercase tracking-wider">
                {category.name}
              </h2>
              <ul className="tv-item-list">
                {category.items.filter((item) => !item.hidden).map((item) => (
                  <li key={item.id}>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="tv-item-name">{item.name}</span>
                      <span className="tv-item-price shrink-0">{formatPrice(item.price)}</span>
                    </div>
                    {item.description && (
                      <p className="tv-description">{item.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

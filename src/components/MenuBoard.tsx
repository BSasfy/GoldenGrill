"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { MenuData } from "@/lib/types";

function formatPrice(price: string): string {
  const trimmed = price.trim();
  if (trimmed.startsWith("£")) return trimmed;
  return `£${trimmed}`;
}

export function MenuBoard({ menu }: { menu: MenuData }) {
  const router = useRouter();

  useEffect(() => {
    const refresh = setInterval(() => router.refresh(), 5 * 60 * 1000);
    return () => clearInterval(refresh);
  }, [router]);

  return (
    <div className="tv-screen flex min-h-screen flex-col bg-[#14110e] px-16 py-12 text-[#f5efe6]">
      <header className="mb-10 border-b-4 border-[#d4a853] pb-6">
        <h1 className="text-7xl font-black uppercase tracking-wide text-[#d4a853]">
          {menu.title}
        </h1>
        {menu.tagline && (
          <p className="mt-3 text-3xl font-light text-[#c9bfb0]">{menu.tagline}</p>
        )}
      </header>

      <div className="grid flex-1 grid-cols-3 gap-12">
        {menu.categories.map((category) => (
          <section key={category.id}>
            <h2 className="mb-6 border-b-2 border-[#d4a853]/40 pb-3 text-4xl font-bold uppercase tracking-wider text-[#d4a853]">
              {category.name}
            </h2>
            <ul className="space-y-5">
              {category.items.map((item) => (
                <li key={item.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-3xl font-semibold">{item.name}</span>
                    <span className="shrink-0 text-3xl font-bold text-[#d4a853]">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  {item.description && (
                    <p className="mt-1 text-xl leading-snug text-[#a89a88]">
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

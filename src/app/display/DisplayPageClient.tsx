"use client";

import { useState } from "react";
import { DisplayRotator } from "@/components/DisplayRotator";
import type { DisplayTheme, MenuData, SpecialsData } from "@/lib/types";

/** TEMP: demo theme toggle for /display — remove when no longer needed. */
export function DisplayPageClient({
  menu,
  specials,
  initialTheme,
  rotationSeconds,
}: {
  menu: MenuData;
  specials: SpecialsData;
  initialTheme: DisplayTheme;
  rotationSeconds: number;
}) {
  const [theme, setTheme] = useState(initialTheme);

  return (
    <>
      <DisplayRotator
        menu={menu}
        specials={specials}
        theme={theme}
        rotationSeconds={rotationSeconds}
      />

      <div
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg border border-white/25 bg-black/60 p-1 text-sm text-white shadow-lg backdrop-blur-sm"
        aria-label="Demo theme toggle"
      >
        <span className="px-2 text-xs font-medium uppercase tracking-wide text-white/70">
          Theme
        </span>
        <button
          type="button"
          onClick={() => setTheme("bright")}
          aria-pressed={theme === "bright"}
          className={`rounded-md px-3 py-1.5 font-semibold transition ${
            theme === "bright"
              ? "bg-white text-black"
              : "text-white/80 hover:text-white"
          }`}
        >
          Light
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          aria-pressed={theme === "dark"}
          className={`rounded-md px-3 py-1.5 font-semibold transition ${
            theme === "dark"
              ? "bg-white text-black"
              : "text-white/80 hover:text-white"
          }`}
        >
          Dark
        </button>
      </div>
    </>
  );
}

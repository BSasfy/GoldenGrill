"use client";

import { useEffect, useState } from "react";
import type { DisplayTheme } from "@/lib/types";
import type { MenuData, SpecialsData } from "@/lib/types";
import { MenuBoard } from "./MenuBoard";
import { SpecialsBoard } from "./SpecialsBoard";

const ROTATION_MS = 2_000; // 1 second

export function DisplayRotator({
  menu,
  specials,
  theme = "dark",
}: {
  menu: MenuData;
  specials: SpecialsData;
  theme?: DisplayTheme;
}) {
  const [showSpecials, setShowSpecials] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setShowSpecials((current) => !current);
    }, ROTATION_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-dvh overflow-hidden">
      <div
        className={`transition-opacity duration-1000 ${
          showSpecials ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-hidden={showSpecials}
      >
        <MenuBoard menu={menu} theme={theme} />
      </div>
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          showSpecials ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!showSpecials}
      >
        <SpecialsBoard specials={specials} theme={theme} />
      </div>
    </div>
  );
}

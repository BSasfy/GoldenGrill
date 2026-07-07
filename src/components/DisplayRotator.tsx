"use client";

import { useEffect, useState } from "react";
import type { MenuData, SpecialsData } from "@/lib/types";
import { MenuBoard } from "./MenuBoard";
import { SpecialsBoard } from "./SpecialsBoard";

const ROTATION_MS = 45_000;

export function DisplayRotator({
  menu,
  specials,
}: {
  menu: MenuData;
  specials: SpecialsData;
}) {
  const [showSpecials, setShowSpecials] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setShowSpecials((current) => !current);
    }, ROTATION_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className={`transition-opacity duration-1000 ${
          showSpecials ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-hidden={showSpecials}
      >
        <MenuBoard menu={menu} />
      </div>
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          showSpecials ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!showSpecials}
      >
        <SpecialsBoard specials={specials} />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import type { DisplayTheme } from "@/lib/types";
import type { MenuData, SpecialsData } from "@/lib/types";
import { paginateMenuCategories } from "@/lib/menu-pagination";
import { MenuBoard } from "./MenuBoard";
import { SpecialsBoard } from "./SpecialsBoard";

export function DisplayRotator({
  menu,
  specials,
  theme = "dark",
  rotationSeconds = 2,
}: {
  menu: MenuData;
  specials: SpecialsData;
  theme?: DisplayTheme;
  rotationSeconds?: number;
}) {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const visibleCategories = useMemo(
    () => menu.categories.filter((category) => !category.hidden),
    [menu.categories],
  );
  const menuPages = useMemo(
    () => paginateMenuCategories(visibleCategories),
    [visibleCategories],
  );
  const totalScreens = menuPages.length + 1; // +1 for specials
  const visibleScreenIndex = currentScreenIndex % totalScreens;
  const rotationMs = Math.max(rotationSeconds, 0.1) * 1000;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScreenIndex((current) => (current + 1) % totalScreens);
    }, rotationMs);
    return () => clearInterval(timer);
  }, [rotationMs, totalScreens]);

  return (
    <div className="relative h-dvh overflow-hidden">
      {menuPages.map((categories, pageIndex) => (
        <div
          key={`menu-page-${pageIndex}`}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            visibleScreenIndex === pageIndex
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          aria-hidden={visibleScreenIndex !== pageIndex}
        >
          <MenuBoard menu={menu} categories={categories} theme={theme} />
        </div>
      ))}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          visibleScreenIndex === totalScreens - 1
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={visibleScreenIndex !== totalScreens - 1}
      >
        <SpecialsBoard specials={specials} theme={theme} />
      </div>
    </div>
  );
}

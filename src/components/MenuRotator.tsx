"use client";

import { useEffect, useMemo, useState } from "react";
import type { DisplayTheme, MenuData } from "@/lib/types";
import { paginateMenuCategories } from "@/lib/menu-pagination";
import { MenuBoard } from "./MenuBoard";

export function MenuRotator({
  menu,
  theme = "dark",
  rotationSeconds = 2,
}: {
  menu: MenuData;
  theme?: DisplayTheme;
  rotationSeconds?: number;
}) {
  const visibleCategories = useMemo(
    () => menu.categories.filter((category) => !category.hidden),
    [menu.categories],
  );
  const menuPages = useMemo(
    () => paginateMenuCategories(visibleCategories),
    [visibleCategories],
  );
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const visiblePageIndex = currentPageIndex % menuPages.length;
  const rotationMs = Math.max(rotationSeconds, 0.1) * 1000;

  useEffect(() => {
    if (menuPages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentPageIndex((current) => (current + 1) % menuPages.length);
    }, rotationMs);
    return () => clearInterval(timer);
  }, [menuPages.length, rotationMs]);

  return (
    <div className="relative h-dvh overflow-hidden">
      {menuPages.map((categories, pageIndex) => (
        <div
          key={`menu-only-page-${pageIndex}`}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            visiblePageIndex === pageIndex
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          aria-hidden={visiblePageIndex !== pageIndex}
        >
          <MenuBoard menu={menu} categories={categories} theme={theme} />
        </div>
      ))}
    </div>
  );
}

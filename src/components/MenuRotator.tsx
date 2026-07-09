"use client";

import { useEffect, useMemo, useState } from "react";
import type { DisplayTheme, MenuData } from "@/lib/types";
import { paginateMenuCategories } from "@/lib/menu-pagination";
import { MenuBoard } from "./MenuBoard";

const ROTATION_MS = 2_000;

export function MenuRotator({
  menu,
  theme = "dark",
}: {
  menu: MenuData;
  theme?: DisplayTheme;
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

  useEffect(() => {
    if (menuPages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentPageIndex((current) => (current + 1) % menuPages.length);
    }, ROTATION_MS);
    return () => clearInterval(timer);
  }, [menuPages.length]);

  useEffect(() => {
    if (currentPageIndex >= menuPages.length) {
      setCurrentPageIndex(0);
    }
  }, [currentPageIndex, menuPages.length]);

  return (
    <div className="relative h-dvh overflow-hidden">
      {menuPages.map((categories, pageIndex) => (
        <div
          key={`menu-only-page-${pageIndex}`}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentPageIndex === pageIndex
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          aria-hidden={currentPageIndex !== pageIndex}
        >
          <MenuBoard menu={menu} categories={categories} theme={theme} />
        </div>
      ))}
    </div>
  );
}

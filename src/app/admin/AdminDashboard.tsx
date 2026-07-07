"use client";

import type { DisplayTheme, MenuData, SpecialsData } from "@/lib/types";
import { MenuEditor, SpecialsEditor } from "./AdminPanel";
import { ThemeToggle } from "./ThemeToggle";

export function AdminDashboard({
  menu,
  specials,
  displayTheme,
  saveMenu,
  saveSpecials,
  saveTheme,
}: {
  menu: MenuData;
  specials: SpecialsData;
  displayTheme: DisplayTheme;
  saveMenu: (data: MenuData) => Promise<{ ok: boolean; error?: string }>;
  saveSpecials: (data: SpecialsData) => Promise<{ ok: boolean; error?: string }>;
  saveTheme: (theme: DisplayTheme) => Promise<{ ok: boolean; error?: string }>;
}) {
  return (
    <div className="space-y-12">
      <ThemeToggle initialTheme={displayTheme} onSave={saveTheme} />
      <SpecialsEditor initialSpecials={specials} onSave={saveSpecials} />
      <MenuEditor initialMenu={menu} onSave={saveMenu} />
    </div>
  );
}

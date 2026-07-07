"use client";

import type { DisplayTheme, MenuData, SpecialsData } from "@/lib/types";
import { saveMenuAction, saveSpecialsAction, saveThemeAction } from "./actions";
import { MenuEditor, SpecialsEditor } from "./AdminPanel";
import { ThemeToggle } from "./ThemeToggle";

export function AdminDashboard({
  menu,
  specials,
  displayTheme,
}: {
  menu: MenuData;
  specials: SpecialsData;
  displayTheme: DisplayTheme;
}) {
  return (
    <div className="space-y-12">
      <ThemeToggle initialTheme={displayTheme} onSave={saveThemeAction} />
      <SpecialsEditor initialSpecials={specials} onSave={saveSpecialsAction} />
      <MenuEditor initialMenu={menu} onSave={saveMenuAction} />
    </div>
  );
}

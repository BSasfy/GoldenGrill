"use client";

import type { DisplayTheme, MenuData, SpecialsData } from "@/lib/types";
import {
  saveDisplaySpeedAction,
  saveMenuAction,
  saveSpecialsAction,
  saveThemeAction,
} from "./actions";
import { MenuEditor, SpecialsEditor } from "./AdminPanel";
import { ThemeToggle } from "./ThemeToggle";

export function AdminDashboard({
  menu,
  specials,
  displayTheme,
  displaySpeedSeconds,
}: {
  menu: MenuData;
  specials: SpecialsData;
  displayTheme: DisplayTheme;
  displaySpeedSeconds: number;
}) {
  return (
    <div className="space-y-12">
      <ThemeToggle
        initialTheme={displayTheme}
        initialDisplaySpeedSeconds={displaySpeedSeconds}
        onSave={saveThemeAction}
        onSaveDisplaySpeed={saveDisplaySpeedAction}
      />
      <SpecialsEditor initialSpecials={specials} onSave={saveSpecialsAction} />
      <MenuEditor initialMenu={menu} onSave={saveMenuAction} />
    </div>
  );
}

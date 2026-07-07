"use client";

import type { MenuData, SpecialsData } from "@/lib/types";
import { MenuEditor, SpecialsEditor } from "./AdminPanel";

export function AdminDashboard({
  menu,
  specials,
  saveMenu,
  saveSpecials,
}: {
  menu: MenuData;
  specials: SpecialsData;
  saveMenu: (data: MenuData) => Promise<{ ok: boolean; error?: string }>;
  saveSpecials: (data: SpecialsData) => Promise<{ ok: boolean; error?: string }>;
}) {
  return (
    <div className="space-y-12">
      <SpecialsEditor initialSpecials={specials} onSave={saveSpecials} />
      <MenuEditor initialMenu={menu} onSave={saveMenu} />
    </div>
  );
}

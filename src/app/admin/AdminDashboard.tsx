"use client";

import type { MenuData, SpecialsData } from "@/lib/types";
import { saveMenuAction, saveSpecialsAction } from "./actions";
import { MenuEditor, SpecialsEditor } from "./AdminPanel";

export function AdminDashboard({
  menu,
  specials,
}: {
  menu: MenuData;
  specials: SpecialsData;
}) {
  return (
    <div className="space-y-12">
      <SpecialsEditor initialSpecials={specials} onSave={saveSpecialsAction} />
      <MenuEditor initialMenu={menu} onSave={saveMenuAction} />
    </div>
  );
}

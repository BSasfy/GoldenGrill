"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  createAdminSession,
  isAdminAuthenticated,
  verifyPassword,
} from "@/lib/auth";
import { getMenu, getSpecials, saveMenu, saveSpecials } from "@/lib/storage";
import type { MenuData, SpecialsData } from "@/lib/types";

export async function loginAction(
  _prevState: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string } | null> {
  const password = formData.get("password")?.toString() ?? "";
  if (!verifyPassword(password)) {
    return { error: "Incorrect password" };
  }
  await createAdminSession();
  return null;
}

export async function logoutAction(): Promise<void> {
  await clearAdminSession();
  redirect("/admin");
}

export async function requireAuth(): Promise<boolean> {
  return isAdminAuthenticated();
}

export async function fetchMenuData(): Promise<MenuData> {
  return getMenu();
}

export async function fetchSpecialsData(): Promise<SpecialsData> {
  return getSpecials();
}

export async function saveMenuAction(data: MenuData): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, error: "Not authenticated" };
  }
  await saveMenu(data);
  revalidatePath("/menu");
  revalidatePath("/display");
  return { ok: true };
}

export async function saveSpecialsAction(
  data: SpecialsData,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, error: "Not authenticated" };
  }
  await saveSpecials(data);
  revalidatePath("/specials");
  revalidatePath("/display");
  return { ok: true };
}

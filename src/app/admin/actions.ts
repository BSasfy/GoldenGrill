"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  createAdminSession,
  isAdminAuthenticated,
  verifyPassword,
} from "@/lib/auth";
import { getMenu, getSpecials, getSettings, saveMenu, saveSpecials, saveSettings } from "@/lib/storage";
import type { DisplayTheme, MenuData, SettingsData, SpecialsData } from "@/lib/types";

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
  try {
    await saveMenu(data);
    revalidatePath("/menu");
    revalidatePath("/display");
    return { ok: true };
  } catch (error) {
    console.error("saveMenuAction failed:", error);
    const message = error instanceof Error ? error.message : "Failed to save menu";
    return { ok: false, error: message };
  }
}

export async function saveSpecialsAction(
  data: SpecialsData,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, error: "Not authenticated" };
  }
  try {
    await saveSpecials(data);
    revalidatePath("/specials");
    revalidatePath("/display");
    return { ok: true };
  } catch (error) {
    console.error("saveSpecialsAction failed:", error);
    const message = error instanceof Error ? error.message : "Failed to save specials";
    return { ok: false, error: message };
  }
}

export async function saveThemeAction(
  theme: DisplayTheme,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, error: "Not authenticated" };
  }
  try {
    const currentSettings = await getSettings();
    const settings: SettingsData = { ...currentSettings, displayTheme: theme };
    await saveSettings(settings);
    revalidatePath("/display");
    revalidatePath("/menu");
    revalidatePath("/specials");
    return { ok: true };
  } catch (error) {
    console.error("saveThemeAction failed:", error);
    const message = error instanceof Error ? error.message : "Failed to save theme";
    return { ok: false, error: message };
  }
}

export async function saveDisplaySpeedAction(
  displaySpeedSeconds: number,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, error: "Not authenticated" };
  }

  if (!Number.isFinite(displaySpeedSeconds) || displaySpeedSeconds <= 0) {
    return { ok: false, error: "Display speed must be a positive number of seconds." };
  }

  try {
    const currentSettings = await getSettings();
    const settings: SettingsData = {
      ...currentSettings,
      displaySpeedSeconds,
    };
    await saveSettings(settings);
    revalidatePath("/display");
    revalidatePath("/menu");
    return { ok: true };
  } catch (error) {
    console.error("saveDisplaySpeedAction failed:", error);
    const message =
      error instanceof Error ? error.message : "Failed to save display speed";
    return { ok: false, error: message };
  }
}

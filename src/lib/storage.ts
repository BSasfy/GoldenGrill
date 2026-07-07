import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { get, put } from "@vercel/blob";
import type { DisplayTheme, MenuData, SettingsData, SpecialsData } from "./types";

const DATA_DIR = join(process.cwd(), "data");

const FILES = {
  menu: "menu.json",
  specials: "specials.json",
  settings: "settings.json",
} as const;

function defaultDisplayTheme(): DisplayTheme {
  if (process.env.NEXT_PUBLIC_DISPLAY_THEME === "dark") return "dark";
  return "bright";
}

function defaultSettings(): SettingsData {
  return { displayTheme: defaultDisplayTheme() };
}

function hasBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readFromDisk<T>(filename: string): Promise<T> {
  const content = await readFile(join(DATA_DIR, filename), "utf-8");
  return JSON.parse(content) as T;
}

async function writeToDisk(filename: string, data: unknown): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(
    join(DATA_DIR, filename),
    JSON.stringify(data, null, 2),
    "utf-8",
  );
}

async function readFromBlob<T>(filename: string, fallback: T): Promise<T> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return fallback;

  try {
    const result = await get(`data/${filename}`, {
      access: "private",
      token,
    });
    if (!result || result.statusCode !== 200 || !result.stream) {
      return fallback;
    }
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

async function writeToBlob(filename: string, data: unknown): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. In Vercel, create a Blob store, connect it to this project, and ensure the token is enabled for Production.",
    );
  }

  try {
    await put(`data/${filename}`, JSON.stringify(data, null, 2), {
      access: "private",
      addRandomSuffix: false,
      token,
      allowOverwrite: true,
      contentType: "application/json",
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to save to Vercel Blob (${filename}): ${detail}`);
  }
}

async function readJson<T>(filename: string, fallback: T): Promise<T> {
  if (hasBlobStorage()) {
    return readFromBlob(filename, fallback);
  }
  try {
    return await readFromDisk<T>(filename);
  } catch {
    return fallback;
  }
}

async function writeJson(filename: string, data: unknown): Promise<void> {
  if (hasBlobStorage()) {
    await writeToBlob(filename, data);
    return;
  }
  await writeToDisk(filename, data);
}

export async function getMenu(): Promise<MenuData> {
  return readJson<MenuData>(FILES.menu, {
    title: "Golden Grill",
    categories: [],
  });
}

export async function saveMenu(data: MenuData): Promise<void> {
  await writeJson(FILES.menu, data);
}

export async function getSpecials(): Promise<SpecialsData> {
  return readJson<SpecialsData>(FILES.specials, {
    title: "Today's Specials",
    hero: {
      id: "hero",
      name: "Today's Deal",
      description: "Ask at the counter",
      price: "0.00",
    },
    offers: [],
  });
}

export async function saveSpecials(data: SpecialsData): Promise<void> {
  await writeJson(FILES.specials, data);
}

export async function getSettings(): Promise<SettingsData> {
  return readJson<SettingsData>(FILES.settings, defaultSettings());
}

export async function saveSettings(data: SettingsData): Promise<void> {
  await writeJson(FILES.settings, data);
}

export async function getDisplayTheme(): Promise<DisplayTheme> {
  const settings = await getSettings();
  return settings.displayTheme;
}

import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { head, put } from "@vercel/blob";
import type { MenuData, SpecialsData } from "./types";

const DATA_DIR = join(process.cwd(), "data");

const FILES = {
  menu: "menu.json",
  specials: "specials.json",
} as const;

function useBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readFromDisk<T>(filename: string): Promise<T> {
  const content = await readFile(join(DATA_DIR, filename), "utf-8");
  return JSON.parse(content) as T;
}

async function writeToDisk(filename: string, data: unknown): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(join(DATA_DIR, filename), JSON.stringify(data, null, 2), "utf-8");
}

async function readFromBlob<T>(filename: string, fallback: T): Promise<T> {
  try {
    const blobMeta = await head(`data/${filename}`, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    const response = await fetch(blobMeta.url);
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

async function writeToBlob(filename: string, data: unknown): Promise<void> {
  await put(`data/${filename}`, JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: false,
    token: process.env.BLOB_READ_WRITE_TOKEN,
    allowOverwrite: true,
  });
}

async function readJson<T>(filename: string, fallback: T): Promise<T> {
  if (useBlobStorage()) {
    return readFromBlob(filename, fallback);
  }
  try {
    return await readFromDisk<T>(filename);
  } catch {
    return fallback;
  }
}

async function writeJson(filename: string, data: unknown): Promise<void> {
  if (useBlobStorage()) {
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

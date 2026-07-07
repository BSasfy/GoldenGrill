import type { DisplayTheme } from "@/lib/types";

export type { DisplayTheme };

export function tvScreenClass(theme: DisplayTheme): string {
  return theme === "bright" ? "tv-screen tv-screen--bright" : "tv-screen";
}

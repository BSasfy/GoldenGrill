export type DisplayTheme = "dark" | "bright";

export function getDisplayTheme(): DisplayTheme {
  return process.env.NEXT_PUBLIC_DISPLAY_THEME === "dark" ? "dark" : "bright";
}

export function tvScreenClass(theme: DisplayTheme): string {
  return theme === "bright" ? "tv-screen tv-screen--bright" : "tv-screen";
}

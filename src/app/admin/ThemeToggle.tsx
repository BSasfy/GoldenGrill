"use client";

import { useState } from "react";
import type { DisplayTheme } from "@/lib/types";

export function ThemeToggle({
  initialTheme,
  onSave,
}: {
  initialTheme: DisplayTheme;
  onSave: (theme: DisplayTheme) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [theme, setTheme] = useState(initialTheme);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSelect(next: DisplayTheme) {
    if (next === theme || saving) return;
    setSaving(true);
    setStatus(null);
    try {
      const result = await onSave(next);
      if (result.ok) {
        setTheme(next);
        document
          .querySelector(".admin-page")
          ?.classList.toggle("admin-page--dark", next === "dark");
        setStatus(
          "TV theme updated. Please refresh the page on the TV to see the changes.",
        );
      } else {
        setStatus(result.error ?? "Could not save theme.");
      }
    } catch {
      setStatus("Could not save theme.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-card rounded-xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="admin-heading text-2xl font-bold">TV display theme</h2>
          <p className="admin-muted mt-1 text-sm">
            Controls how the menu looks on the live TV. Changes apply
            immediately.
          </p>
        </div>
        <div
          className="admin-theme-toggle flex rounded-lg p-1"
          role="group"
          aria-label="TV display theme"
        >
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSelect("bright")}
            aria-pressed={theme === "bright"}
            className={`admin-theme-option rounded-md px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${
              theme === "bright" ? "admin-theme-option-active" : ""
            }`}
          >
            Light
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSelect("dark")}
            aria-pressed={theme === "dark"}
            className={`admin-theme-option rounded-md px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${
              theme === "dark" ? "admin-theme-option-active" : ""
            }`}
          >
            Dark
          </button>
        </div>
      </div>
      {status && <p className="admin-subtle mt-3 text-sm">{status}</p>}
    </section>
  );
}

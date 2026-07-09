"use client";

import { useState } from "react";
import type { DisplayTheme } from "@/lib/types";

export function ThemeToggle({
  initialTheme,
  initialDisplaySpeedSeconds,
  onSave,
  onSaveDisplaySpeed,
}: {
  initialTheme: DisplayTheme;
  initialDisplaySpeedSeconds: number;
  onSave: (theme: DisplayTheme) => Promise<{ ok: boolean; error?: string }>;
  onSaveDisplaySpeed: (
    displaySpeedSeconds: number,
  ) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [theme, setTheme] = useState(initialTheme);
  const [displaySpeedSeconds, setDisplaySpeedSeconds] = useState(
    initialDisplaySpeedSeconds.toString(),
  );
  const [saving, setSaving] = useState(false);
  const [savingDisplaySpeed, setSavingDisplaySpeed] = useState(false);
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

  async function handleSaveDisplaySpeed() {
    if (savingDisplaySpeed) return;
    const nextValue = Number(displaySpeedSeconds);
    if (!Number.isFinite(nextValue) || nextValue <= 0) {
      setStatus("Display speed must be a positive number of seconds.");
      return;
    }

    setSavingDisplaySpeed(true);
    setStatus(null);
    try {
      const result = await onSaveDisplaySpeed(nextValue);
      if (result.ok) {
        setStatus(
          "Display speed updated. Please refresh the page on the TV to see the changes.",
        );
      } else {
        setStatus(result.error ?? "Could not save display speed.");
      }
    } catch {
      setStatus("Could not save display speed.");
    } finally {
      setSavingDisplaySpeed(false);
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
      <div className="mt-5 flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="admin-muted mb-1 block text-sm">Display speed (seconds)</span>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={displaySpeedSeconds}
            onChange={(e) => setDisplaySpeedSeconds(e.target.value)}
            className="admin-input w-44 rounded-lg px-3 py-2"
            disabled={savingDisplaySpeed}
          />
        </label>
        <button
          type="button"
          onClick={handleSaveDisplaySpeed}
          disabled={savingDisplaySpeed}
          className="admin-btn-primary rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-60"
        >
          {savingDisplaySpeed ? "Saving…" : "Save display speed"}
        </button>
      </div>
      {status && <p className="admin-subtle mt-3 text-sm">{status}</p>}
    </section>
  );
}

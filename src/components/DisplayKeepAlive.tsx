"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/** Soft-reload Server Components so admin edits appear without a full page load. */
const SOFT_RELOAD_MS = 5 * 60 * 1000;

/**
 * Full browser reload to clear memory/leaks on long-running TV browsers.
 * Soft reload alone does not fully reset Chromium tab state.
 */
const HARD_RELOAD_MS = 60 * 60 * 1000;

/**
 * Keeps the TV display awake and fresh on Chromium browsers (Chrome,
 * Fire TV, many Android TV browsers). Mount once per display route.
 *
 * - Screen Wake Lock API when supported
 * - Soft reload via router.refresh() every 5 minutes
 * - Hard reload every hour as a memory fallback
 * - Re-acquires wake lock when the tab becomes visible again
 */
export function DisplayKeepAlive() {
  const router = useRouter();
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function requestWakeLock() {
      if (cancelled) return;
      if (!("wakeLock" in navigator)) return;

      try {
        // Release any existing sentinel before re-requesting.
        if (wakeLockRef.current) {
          try {
            await wakeLockRef.current.release();
          } catch {
            // Already released.
          }
          wakeLockRef.current = null;
        }

        const sentinel = await navigator.wakeLock.request("screen");
        if (cancelled) {
          await sentinel.release();
          return;
        }

        wakeLockRef.current = sentinel;
        sentinel.addEventListener("release", () => {
          if (wakeLockRef.current === sentinel) {
            wakeLockRef.current = null;
          }
        });
      } catch {
        // Permission denied, unsupported page state, or low battery — ignore.
      }
    }

    void requestWakeLock();

    const softReload = setInterval(() => {
      router.refresh();
    }, SOFT_RELOAD_MS);

    const hardReload = setInterval(() => {
      window.location.reload();
    }, HARD_RELOAD_MS);

    // Wake locks are released when the tab is hidden; reclaim on return.
    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        void requestWakeLock();
        router.refresh();
      }
    }

    // Some TV browsers fire pagehide/pageshow when power-saving kicks in.
    function onPageShow() {
      void requestWakeLock();
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      cancelled = true;
      clearInterval(softReload);
      clearInterval(hardReload);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pageshow", onPageShow);
      if (wakeLockRef.current) {
        void wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, [router]);

  return null;
}

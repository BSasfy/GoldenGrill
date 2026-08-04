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

/** Re-check wake lock / video playback — locks can drop without visibility changes. */
const KEEP_AWAKE_POLL_MS = 30 * 1000;

/**
 * Tiny muted H.264 clip (NoSleep-style). Some browsers treat playing media as
 * "user is active" when Screen Wake Lock is missing or fails.
 */
const SILENT_VIDEO_SRC =
  "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAr1tZGF0AAACrgYF//+q3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0OCByMjYwMSBhMGNkN2QzIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNSAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAOWWIhAA3//728P4FNjuZQQAAAu5tb292AAAAbG12aGQAAAAAAAAAAAAAAAAAAAPoAAAAAAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACGHRyYWsAAABcdGtoZAAAAAMAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAQAAAAEAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAAEAAAAAAQAAAAEAAAAACmxhdG0AAAAWdGF0YQAAAAAAAAEAAAAATGF2YzE0OC4yNw==";

/**
 * Keeps the TV display awake and fresh on Chromium browsers (Chrome,
 * Fire TV, many Android TV browsers). Mount once per display route.
 *
 * - Screen Wake Lock API when supported (polled if it drops)
 * - Muted looping video fallback when Wake Lock is missing / fails
 * - Soft reload via router.refresh() every 5 minutes (skips while offline)
 * - Hard reload every hour as a memory fallback
 * - Fullscreen after first remote / keyboard interaction
 * - Re-acquires keep-awake when the tab becomes visible again
 */
export function DisplayKeepAlive() {
  const router = useRouter();
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function ensureWakeLock() {
      if (cancelled) return;
      if (typeof navigator === "undefined" || !("wakeLock" in navigator)) return;

      const held = wakeLockRef.current && !wakeLockRef.current.released;
      if (held) return;
      if (document.visibilityState !== "visible") return;

      try {
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
        // Permission denied, unsupported state, or low power — try video fallback.
      }
    }

    function ensureSilentVideo() {
      if (cancelled || typeof document === "undefined") return;

      let video = videoRef.current;
      if (!video) {
        video = document.createElement("video");
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");
        video.setAttribute("muted", "");
        video.muted = true;
        video.defaultMuted = true;
        video.loop = true;
        video.autoplay = true;
        video.playsInline = true;
        video.preload = "auto";
        video.setAttribute("aria-hidden", "true");
        video.tabIndex = -1;
        // Off-screen / zero-opacity so TVs never show a black flash.
        Object.assign(video.style, {
          position: "fixed",
          width: "1px",
          height: "1px",
          opacity: "0",
          pointerEvents: "none",
          bottom: "0",
          right: "0",
          zIndex: "-1",
        });
        video.src = SILENT_VIDEO_SRC;
        document.body.appendChild(video);
        videoRef.current = video;
      }

      if (video.paused) {
        void video.play().catch(() => {
          // Autoplay may require a remote click — unlocked on first interaction.
        });
      }
    }

    async function keepAwake() {
      await ensureWakeLock();
      // Always run the muted loop as a second line; cheap when Wake Lock works.
      ensureSilentVideo();
    }

    function softReloadIfOnline() {
      if (typeof navigator !== "undefined" && navigator.onLine === false) return;
      router.refresh();
    }

    async function enterFullscreen() {
      const root = document.documentElement;
      if (document.fullscreenElement || !root.requestFullscreen) return;
      try {
        await root.requestFullscreen();
      } catch {
        // TVs / browsers often block this without policy support.
      }
    }

    function onFirstInteract() {
      void keepAwake();
      void enterFullscreen();
      void videoRef.current?.play().catch(() => {});
    }

    void keepAwake();

    const softReload = setInterval(softReloadIfOnline, SOFT_RELOAD_MS);
    const hardReload = setInterval(() => {
      window.location.reload();
    }, HARD_RELOAD_MS);
    const pollAwake = setInterval(() => {
      void keepAwake();
    }, KEEP_AWAKE_POLL_MS);

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        void keepAwake();
        softReloadIfOnline();
      }
    }

    function onPageShow() {
      void keepAwake();
    }

    function onOnline() {
      softReloadIfOnline();
      void keepAwake();
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("online", onOnline);
    // Fire Stick remote often surfaces as keydown; some sticks use click/pointer.
    window.addEventListener("keydown", onFirstInteract, { once: true });
    window.addEventListener("pointerdown", onFirstInteract, { once: true });
    window.addEventListener("click", onFirstInteract, { once: true });

    return () => {
      cancelled = true;
      clearInterval(softReload);
      clearInterval(hardReload);
      clearInterval(pollAwake);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("keydown", onFirstInteract);
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("click", onFirstInteract);

      if (wakeLockRef.current) {
        void wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }

      const video = videoRef.current;
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
        video.remove();
        videoRef.current = null;
      }
    };
  }, [router]);

  return null;
}

"use client";

import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";
export const THEME_KEY = "theme";
const META_COLOR: Record<Theme, string> = { dark: "#0b0d13", light: "#f4f5fb" };

const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

/** Current theme, kept in sync with <html data-theme>. Server render and hydration use "dark". */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => "dark");
}

/** Resolved value of a CSS custom property, e.g. cssVar("--accent") -> "#00f2fe". For JS that can't take var(). */
export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** "#rrggbb" -> "r,g,b" for canvas rgba() strings. */
export function rgbTriplet(hex: string): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

/** Browser UI colour (mobile address bar). Touches only the meta tag, never the theme itself. */
export function syncMeta(t: Theme) {
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    m.removeAttribute("media");
    m.setAttribute("content", META_COLOR[t]);
  });
}

export function applyTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  syncMeta(t);
}

/** Switch theme with a circular reveal from the toggle button where the browser supports View Transitions. */
export function setTheme(next: Theme, origin?: { x: number; y: number }) {
  try { localStorage.setItem(THEME_KEY, next); } catch {}
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
  if (!doc.startViewTransition || reduced) return applyTheme(next);

  const x = origin?.x ?? innerWidth / 2, y = origin?.y ?? 0;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const vt = doc.startViewTransition(() => applyTheme(next));
  vt.ready
    .then(() =>
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(.65,0,.25,1)", pseudoElement: "::view-transition-new(root)" },
      ),
    )
    .catch(() => {});
}

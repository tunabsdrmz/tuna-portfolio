"use client";

import { useSyncExternalStore } from "react";

export const THEME_COLOR = { dark: "#0a0a0a", light: "#f3f3f1" } as const;
type Theme = keyof typeof THEME_COLOR;

const listeners = new Set<() => void>();
let userChose = false;
let watching = false;

function watchSystem() {
  if (watching) return;
  watching = true;
  userChose ||= new URLSearchParams(location.search).has("theme");
  const mq = window.matchMedia("(prefers-color-scheme: light)");
  mq.addEventListener("change", () => {
    if (!userChose) apply(mq.matches ? "light" : "dark");
  });
}

const subscribe = (cb: () => void) => {
  watchSystem();
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

const getTheme = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "light") root.dataset.theme = "light";
  else delete root.dataset.theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  listeners.forEach((l) => l());
}

let busy = false;

// Floods the screen with the next theme's background from the toggle,
// swaps the theme underneath, then fades the flood away.
export function toggleTheme(origin: { x: number; y: number }) {
  const next: Theme = getTheme() === "light" ? "dark" : "light";
  userChose = true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return apply(next);
  if (busy) return;
  busy = true;
  const { x, y } = origin;
  const r = Math.ceil(
    Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)),
  );
  const flood = document.createElement("div");
  flood.setAttribute("aria-hidden", "true");
  Object.assign(flood.style, {
    position: "fixed",
    left: `${x - r}px`,
    top: `${y - r}px`,
    width: `${2 * r}px`,
    height: `${2 * r}px`,
    borderRadius: "50%",
    background: THEME_COLOR[next],
    zIndex: "9990",
    pointerEvents: "none",
    transform: "scale(0)",
    willChange: "transform, opacity",
  });
  document.body.appendChild(flood);
  flood
    .animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], {
      duration: 560,
      easing: "cubic-bezier(0.65, 0, 0.35, 1)",
      fill: "forwards",
    })
    .finished.then(() => {
      apply(next);
      return new Promise<void>((res) => requestAnimationFrame(() => requestAnimationFrame(() => res())));
    })
    .then(
      () =>
        flood.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 340,
          easing: "ease-out",
          fill: "forwards",
        }).finished,
    )
    .catch(() => apply(next))
    .finally(() => {
      flood.remove();
      busy = false;
    });
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme, () => "dark");
}

"use client";

import type { MouseEvent } from "react";
import { useDict } from "@/lib/i18n";
import { TABS, type TabId } from "@/lib/layouts";
import { toggleTheme, useTheme } from "@/lib/theme";
import { Magnetic } from "./ui";

function onTheme(e: MouseEvent<HTMLButtonElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
}

export default function Dock({
  tab,
  onSelect,
  detailOpen,
  onReset,
  onToggleLang,
}: {
  tab: TabId;
  onSelect: (id: TabId) => void;
  detailOpen: boolean;
  onReset?: () => void;
  onToggleLang: () => void;
}) {
  const { UI } = useDict();
  const theme = useTheme();

  const reset = (cls: string) =>
    onReset && (
      <button
        onClick={onReset}
        aria-label={UI.dock.resetAria}
        className={`p-2 md:p-2.5 items-center gap-2 group ${cls}`}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden className="text-fg">
          <path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v2.8h2.8" stroke="currentColor" />
        </svg>
        <span className="hidden md:inline font-mono text-[9px] uppercase tracking-[0.22em] text-mid group-hover:text-fg transition-colors">
          {UI.dock.reset}
        </span>
      </button>
    );

  const themeBtn = (cls: string) => (
    <button
      onClick={onTheme}
      aria-label={theme === "light" ? UI.dock.toDark : UI.dock.toLight}
      aria-pressed={theme === "light"}
      className={`p-2 md:p-2.5 text-mid hover:text-fg transition-colors ${cls}`}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" />
        <path d="M8 1.5a6.5 6.5 0 0 1 0 13z" fill="currentColor" />
      </svg>
    </button>
  );

  return (
    <nav
      aria-label="Sections"
      className="fixed bottom-0 left-0 right-0 z-50 h-14 md:h-16 flex items-center justify-center gap-1 md:gap-2 px-4 bg-bg/85 backdrop-blur-sm border-t border-hairline"
    >
      {TABS.map((t) => {
        const active = t.id === tab && !detailOpen;
        return (
          <Magnetic key={t.id} strength={0.2}>
            <button
              onClick={() => onSelect(t.id)}
              aria-current={active ? "page" : undefined}
              data-tab={t.id}
              className="relative px-2.5 md:px-5 py-2 group focus-visible:outline-none"
            >
              <span
                className={`font-mono text-[10px] md:text-[11px] uppercase tracking-[0.24em] transition-colors duration-300 ${
                  active ? "text-fg" : "text-dim group-hover:text-mid group-focus-visible:text-mid"
                }`}
              >
                {UI.tabs[t.id]}
              </span>
              <span
                className="absolute left-1/2 -translate-x-1/2 bottom-0 block h-px bg-fg transition-all duration-400 ease-out"
                style={{
                  width: active ? "100%" : 0,
                  opacity: active ? 1 : 0,
                  boxShadow: active
                    ? "0 0 12px 2px rgb(var(--glow) / calc(0.65 * var(--glow-k)))"
                    : "none",
                }}
              />
              <span className="sr-only"> (press {t.key})</span>
            </button>
          </Magnetic>
        );
      })}
      <div className="absolute start-1 md:start-6 flex items-center">
        <button
          onClick={onToggleLang}
          aria-label={UI.dock.langAria}
          lang={UI.dock.lang === "EN" ? "en" : "tr"}
          className="px-1 md:px-2 py-2 font-mono text-[10px] md:text-[12px] text-mid hover:text-fg border border-transparent hover:border-hairline transition-colors"
        >
          {UI.dock.lang}
        </button>
        {themeBtn("hidden md:block")}
        {reset("hidden md:flex")}
      </div>
      <span className="hidden lg:block absolute end-6 font-mono text-[9px] uppercase tracking-[0.22em] text-dim">
        {UI.dock.hints}
      </span>
      <div className="absolute end-1 md:hidden flex items-center">
        {reset("flex")}
        {themeBtn("block")}
      </div>
    </nav>
  );
}

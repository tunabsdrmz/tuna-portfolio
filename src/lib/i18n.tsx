"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DICTS, type Dict, type Lang } from "./content";

export const LANG_KEY = "tb:lang";

const listeners = new Set<() => void>();

export function subscribeLang(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export const getLang = (): Lang => (document.documentElement.lang === "tr" ? "tr" : "en");
export const getServerLang = (): Lang => "en";

export function setLang(lang: Lang) {
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {}
  listeners.forEach((l) => l());
}

const DictContext = createContext<Dict>(DICTS.en);

export function DictProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <DictContext.Provider value={DICTS[lang]}>{children}</DictContext.Provider>;
}

export const useDict = () => useContext(DictContext);

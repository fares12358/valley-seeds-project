"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  getTranslations,
  getTranslationsSync,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  RTL_LOCALES,
  LOCALE_META,
} from "@/i18n/index";
import ContentLoader from "@/components/ContentLoader";
import ServerOfflineCard from "@/components/ServerOfflineCard";

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const pathname = usePathname();
  // Dashboard editors use useSection() for content and never call GET /api/content —
  // they should never sit behind the public site's loading/offline gate.
  const isDashboard = pathname?.startsWith("/dashboard") ?? false;

  const [lang,      setLangState] = useState(DEFAULT_LOCALE);
  // Only ever set from a successful public-site content fetch — the dashboard
  // path doesn't need state for this, it's a pure sync function of `lang` (below).
  const [fetchedT,  setFetchedT]  = useState(null);
  // 'loading' | 'ready' | 'error' — gates the public site until content actually resolves,
  // instead of flashing local fallback text before the API responds.
  const [status,    setStatus]    = useState(isDashboard ? "ready" : "loading");
  const [retryTick, setRetryTick] = useState(0);

  const t = isDashboard ? getTranslationsSync(lang) : (fetchedT ?? getTranslationsSync(lang));

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vs_lang");
      if (stored && SUPPORTED_LOCALES.includes(stored)) setLangState(stored);
    } catch { /* localStorage blocked */ }
  }, []);

  useEffect(() => {
    const dir = RTL_LOCALES.includes(lang) ? "rtl" : "ltr";
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir",  dir);
  }, [lang]);

  useEffect(() => {
    // Dashboard is admin-only, uses local locale files only, and is never gated —
    // `t` above already covers it synchronously, nothing to fetch or set here.
    if (isDashboard) return;

    let cancelled = false;
    setStatus("loading");

    getTranslations(lang)
      .then((result) => {
        if (cancelled) return;
        setFetchedT(result);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn(`[i18n] Content fetch failed: ${err.message}`);
        setStatus("error");
      });

    return () => { cancelled = true; };
  }, [lang, isDashboard, retryTick]);

  const setLang = useCallback((newLang) => {
    if (!SUPPORTED_LOCALES.includes(newLang)) return;
    try { localStorage.setItem("vs_lang", newLang); } catch { /* ignore */ }
    setLangState(newLang);
  }, []);

  const retry = useCallback(() => setRetryTick((n) => n + 1), []);

  const isRTL = RTL_LOCALES.includes(lang);
  const dir   = isRTL ? "rtl" : "ltr";

  return (
    <LangContext.Provider value={{ lang, dir, isRTL, t, setLang, LOCALE_META }}>
      {isDashboard || status === "ready" ? (
        children
      ) : status === "loading" ? (
        <ContentLoader />
      ) : (
        <ServerOfflineCard onRetry={retry} />
      )}
    </LangContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useTranslation must be inside <LangProvider>");
  return ctx;
}

export default LangContext;

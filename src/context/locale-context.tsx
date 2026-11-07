"use client";

import type { AppLocale } from "@/i18n/config";
import type { Messages } from "@/i18n/dictionary";
import { createContext, useContext, useEffect, type ReactNode } from "react";

import { getDictionary } from "@/i18n/dictionary";

type LocaleContextValue = { locale: AppLocale; messages: Messages };

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: AppLocale;
  messages: Messages;
  children: ReactNode;
}) {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    }
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, messages }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useI18n(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return { locale: "en", messages: getDictionary("en") };
  }
  return ctx;
}

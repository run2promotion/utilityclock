import type { AppLocale } from "./config";
import ar from "@/locales/ar/common.json";
import de from "@/locales/de/common.json";
import en from "@/locales/en/common.json";
import es from "@/locales/es/common.json";
import fr from "@/locales/fr/common.json";
import hi from "@/locales/hi/common.json";
import ja from "@/locales/ja/common.json";
import pt from "@/locales/pt/common.json";

export type Messages = typeof en;

const messages: Record<AppLocale, Messages> = {
  en,
  de,
  fr,
  ja,
  es,
  pt,
  ar,
  hi,
};

export function getDictionary(locale: AppLocale): Messages {
  return messages[locale] ?? messages.en;
}

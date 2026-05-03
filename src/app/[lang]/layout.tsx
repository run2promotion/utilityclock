import { AppShell } from "@/components/layout/AppShell";
import { LocaleProvider } from "@/context/locale-context";
import { getDictionary } from "@/i18n/dictionary";
import { isAppLocale, type AppLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;
  const messages = getDictionary(locale);

  return (
    <LocaleProvider locale={locale} messages={messages}>
      <AppShell>{children}</AppShell>
    </LocaleProvider>
  );
}

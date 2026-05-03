import type { ReactNode } from "react";

const section =
  "mt-8 space-y-4 first:mt-0 [&_h2]:scroll-mt-20 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-zinc-900 [&_h2]:dark:text-zinc-100 [&_li]:mt-1 [&_ul]:list-disc [&_ul]:pl-5";

export function LegalShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl pb-16">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h1>
      <div
        className={`${section} mt-8 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300`}
      >
        {children}
      </div>
    </div>
  );
}

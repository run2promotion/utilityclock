import Link from "next/link";

export type BreadcrumbItem = {
  name: string;
  /** Relative path for in-app navigation */
  href?: string;
  /** Absolute URL for JSON-LD `item` */
  item: string;
};

function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  const elements = items.map((crumb, i) => {
    const position = i + 1;
    const el: Record<string, unknown> = {
      "@type": "ListItem",
      position,
      name: crumb.name,
      item: crumb.item,
    };
    return el;
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: elements,
  };
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;

  const json = breadcrumbJsonLd(items);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-zinc-500 dark:text-zinc-400">
        <ol className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0">
          {items.map((crumb, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={`${crumb.item}-${i}`} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span className="text-zinc-400 dark:text-zinc-600" aria-hidden>
                    /
                  </span>
                )}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="text-zinc-700 underline-offset-2 hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-100"
                  >
                    {crumb.name}
                  </Link>
                ) : (
                  <span
                    className={
                      isLast
                        ? "font-medium text-zinc-800 dark:text-zinc-200"
                        : "text-zinc-600 dark:text-zinc-400"
                    }
                    aria-current={isLast ? "page" : undefined}
                  >
                    {crumb.name}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

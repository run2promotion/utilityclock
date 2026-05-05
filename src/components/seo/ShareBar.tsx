"use client";

import { Check, Code2, Copy } from "lucide-react";
import { useMemo, useState } from "react";

type ShareBarProps = {
  url: string;
  title: string;
};

type ShareItem = {
  id: string;
  label: string;
  href: string;
  className: string;
};

export function ShareBar({ url, title }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  const embedUrl = useMemo(() => {
    try {
      const u = new URL(url);
      u.searchParams.set("embed", "1");
      return u.toString();
    } catch {
      const joiner = url.includes("?") ? "&" : "?";
      return `${url}${joiner}embed=1`;
    }
  }, [url]);

  const iframeCode = `<iframe src="${embedUrl}" width="420" height="480" style="border:0;border-radius:12px;overflow:hidden;" title="${title}"></iframe>`;

  const items = useMemo<ShareItem[]>(() => {
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(title);
    return [
      {
        id: "facebook",
        label: "f",
        href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
        className: "bg-[#1877f2] text-white",
      },
      {
        id: "x",
        label: "X",
        href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
        className: "bg-black text-white",
      },
      {
        id: "whatsapp",
        label: "WA",
        href: `https://api.whatsapp.com/send?text=${t}%20${u}`,
        className: "bg-[#25D366] text-white",
      },
      {
        id: "blogger",
        label: "B",
        href: `https://www.blogger.com/blog-this.g?u=${u}&n=${t}`,
        className: "bg-[#f57d00] text-white",
      },
      {
        id: "reddit",
        label: "R",
        href: `https://www.reddit.com/submit?url=${u}&title=${t}`,
        className: "bg-[#ff4500] text-white",
      },
      {
        id: "tumblr",
        label: "T",
        href: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${u}&title=${t}`,
        className: "bg-[#35465c] text-white",
      },
      {
        id: "pinterest",
        label: "P",
        href: `https://pinterest.com/pin/create/button/?url=${u}&description=${t}`,
        className: "bg-[#e60023] text-white",
      },
      {
        id: "linkedin",
        label: "in",
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
        className: "bg-[#0a66c2] text-white",
      },
    ];
  }, [title, url]);

  return (
    <section className="rounded-xl border border-zinc-200/80 bg-white/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Share this tool</h2>
      <div className="flex flex-wrap items-center gap-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${item.id}`}
            className={`inline-flex h-10 min-w-10 items-center justify-center rounded-sm px-3 text-sm font-semibold ${item.className}`}
          >
            {item.label}
          </a>
        ))}
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url);
              setCopied(true);
              setTimeout(() => setCopied(false), 1300);
            } catch {
              setCopied(false);
            }
          }}
          className="inline-flex h-10 items-center gap-1.5 rounded-sm bg-zinc-800 px-3 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(iframeCode);
              setEmbedCopied(true);
              setTimeout(() => setEmbedCopied(false), 1300);
            } catch {
              setEmbedCopied(false);
            }
          }}
          className="inline-flex h-10 items-center gap-1.5 rounded-sm bg-sky-600 px-3 text-sm font-semibold text-white hover:bg-sky-500"
        >
          <Code2 className="h-4 w-4" aria-hidden />
          {embedCopied ? "Embed copied" : "Embed"}
        </button>
      </div>
    </section>
  );
}

const SITE_SUFFIX = " | Utility Clock";

function collapseSpaces(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function trimToWordBoundary(input: string, max: number): string {
  if (input.length <= max) return input;
  const cut = input.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > 30) return cut.slice(0, lastSpace).trim();
  return cut.trim();
}

function padDescription(base: string): string {
  const addon =
    " Free, browser-based and no-install, with precision timing, fullscreen mode, and quick controls for reliable daily use.";
  const joined = collapseSpaces(`${base} ${addon}`);
  return trimToWordBoundary(joined, 160);
}

function normalizeTitle(raw: string): string {
  const title = collapseSpaces(raw).replace(/\s*\|\s*Utility Clock$/i, "");
  let out = title;
  if (!out.includes(" - ")) {
    out = `${out} - Fast Precision Tool`;
  }
  if (!out.endsWith(SITE_SUFFIX)) {
    out = `${out}${SITE_SUFFIX}`;
  }
  if (out.length > 60) {
    const withoutSuffix = out.replace(SITE_SUFFIX, "");
    out = `${trimToWordBoundary(withoutSuffix, 60 - SITE_SUFFIX.length)}${SITE_SUFFIX}`;
  }
  if (out.length < 50) {
    const withoutSuffix = out.replace(SITE_SUFFIX, "");
    const padded = collapseSpaces(`${withoutSuffix} - Browser-based no-install free`);
    out = `${trimToWordBoundary(padded, 60 - SITE_SUFFIX.length)}${SITE_SUFFIX}`;
  }
  return out;
}

function normalizeDescription(raw: string): string {
  const base = collapseSpaces(raw);
  const withKeywords = collapseSpaces(
    `${base} Free, browser-based, no-install utility with precision controls.`,
  );
  if (withKeywords.length >= 140 && withKeywords.length <= 160) {
    return withKeywords;
  }
  if (withKeywords.length < 140) {
    return padDescription(withKeywords);
  }
  return trimToWordBoundary(withKeywords, 160);
}

export function buildSeoMeta(input: {
  title: string;
  description: string;
}): { title: string; description: string } {
  return {
    title: normalizeTitle(input.title),
    description: normalizeDescription(input.description),
  };
}

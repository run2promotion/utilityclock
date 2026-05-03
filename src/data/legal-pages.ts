export const LEGAL_PAGE_IDS = ["about", "privacy", "terms"] as const;
export type LegalPageId = (typeof LEGAL_PAGE_IDS)[number];

export function isLegalPageId(s: string): s is LegalPageId {
  return (LEGAL_PAGE_IDS as readonly string[]).includes(s);
}

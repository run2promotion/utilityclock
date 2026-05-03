export type SavedCity = {
  timeZone: string;
  label: string;
};

const STORAGE_KEY = "world-clock-cities";

export function loadSavedCities(): SavedCity[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is SavedCity =>
        x != null &&
        typeof x === "object" &&
        "timeZone" in x &&
        "label" in x &&
        typeof (x as SavedCity).timeZone === "string" &&
        typeof (x as SavedCity).label === "string",
    );
  } catch {
    return [];
  }
}

export function saveCities(cities: SavedCity[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  } catch {
    /* quota / private mode */
  }
}

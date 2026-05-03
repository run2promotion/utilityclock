export const STORAGE_KEY = "utility-clock-settings-v1";

export const CLOCK_THEME_PRESETS = {
  orange: "#fb923c",
  red: "#f87171",
  green: "#34d399",
  blue: "#60a5fa",
  white: "#fafafa",
} as const;

export type ThemePresetKey = keyof typeof CLOCK_THEME_PRESETS;

export type AlarmSoundId = "beep" | "bell" | "digital";

export type AppSettings = {
  isDigitalFont: boolean;
  is12Hour: boolean;
  showDate: boolean;
  isNightMode: boolean;
  themeColor: ThemePresetKey;
  clockScale: number;
  alarmSound: AlarmSoundId;
};

export const DEFAULT_SETTINGS: AppSettings = {
  isDigitalFont: true,
  is12Hour: true,
  showDate: true,
  isNightMode: true,
  themeColor: "green",
  clockScale: 1,
  alarmSound: "beep",
};

export function parseStoredSettings(raw: string | null): AppSettings {
  if (!raw) return { ...DEFAULT_SETTINGS };
  try {
    const v = JSON.parse(raw) as Partial<AppSettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...v,
      themeColor:
        v.themeColor && v.themeColor in CLOCK_THEME_PRESETS
          ? v.themeColor
          : DEFAULT_SETTINGS.themeColor,
      alarmSound:
        v.alarmSound === "beep" ||
        v.alarmSound === "bell" ||
        v.alarmSound === "digital"
          ? v.alarmSound
          : DEFAULT_SETTINGS.alarmSound,
      clockScale:
        typeof v.clockScale === "number" &&
        v.clockScale >= 0.75 &&
        v.clockScale <= 1.75
          ? v.clockScale
          : DEFAULT_SETTINGS.clockScale,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

"use client";

import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import {
  CLOCK_THEME_PRESETS,
  DEFAULT_SETTINGS,
  parseStoredSettings,
  STORAGE_KEY,
  type AppSettings,
} from "@/lib/settings-schema";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SettingsContextValue = {
  settings: AppSettings;
  setSettings: (u: Partial<AppSettings> | ((prev: AppSettings) => AppSettings)) => void;
  openSettings: () => void;
  closeSettings: () => void;
  settingsOpen: boolean;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function readStored(): AppSettings {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return parseStoredSettings(raw);
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<AppSettings>(() => ({
    ...DEFAULT_SETTINGS,
  }));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettingsState(readStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore quota */
    }
  }, [settings, hydrated]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--primary-clock-color",
      CLOCK_THEME_PRESETS[settings.themeColor],
    );
    root.style.setProperty("--clock-scale", String(settings.clockScale));
    root.classList.toggle("dark", settings.isNightMode);
  }, [settings.themeColor, settings.clockScale, settings.isNightMode]);

  const setSettings = useCallback(
    (u: Partial<AppSettings> | ((prev: AppSettings) => AppSettings)) => {
      setSettingsState((prev) =>
        typeof u === "function" ? u(prev) : { ...prev, ...u },
      );
    },
    [],
  );

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const value = useMemo(
    () => ({
      settings,
      setSettings,
      openSettings,
      closeSettings,
      settingsOpen,
    }),
    [settings, setSettings, openSettings, closeSettings, settingsOpen],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
      {hydrated ? (
        <SettingsSidebar open={settingsOpen} onOpenChange={setSettingsOpen} />
      ) : null}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
}

"use client";

import { useSettings } from "@/context/settings-context";
import {
  CLOCK_THEME_PRESETS,
  type AlarmSoundId,
  type ThemePresetKey,
} from "@/lib/settings-schema";
import { previewAlarmSound } from "@/lib/alarmSounds";
import * as Dialog from "@radix-ui/react-dialog";
import * as Label from "@radix-ui/react-label";
import * as Slider from "@radix-ui/react-slider";
import * as Switch from "@radix-ui/react-switch";
import { Minus, Plus, Volume2, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

const THEME_LABELS: Record<ThemePresetKey, string> = {
  orange: "Orange",
  red: "Red",
  green: "Green",
  blue: "Blue",
  white: "White",
};

const SOUND_OPTIONS: { id: AlarmSoundId; label: string }[] = [
  { id: "beep", label: "Beep" },
  { id: "bell", label: "Bell" },
  { id: "digital", label: "Digital" },
];

type SettingsSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SettingsSidebar({ open, onOpenChange }: SettingsSidebarProps) {
  const { settings, setSettings } = useSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[2px]" />
        <Dialog.Content
          className="fixed right-0 top-0 z-[101] flex h-full w-full max-w-sm flex-col border-l border-zinc-200 bg-white shadow-2xl outline-none transition-transform duration-300 ease-out data-[state=closed]:translate-x-full data-[state=open]:translate-x-0 dark:border-zinc-800 dark:bg-zinc-950"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
            <Dialog.Title className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Settings
            </Dialog.Title>
            <Dialog.Close
              type="button"
              className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              aria-label="Close settings"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6">
            <section className="space-y-3">
              <Label.Root className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Display
              </Label.Root>
              <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <Row
                  id="font-digital"
                  label="LCD / digital font"
                  hint="Segment-style digits vs clean sans"
                >
                  <Switch.Root
                    id="font-digital"
                    checked={settings.isDigitalFont}
                    onCheckedChange={(v) => setSettings({ isDigitalFont: v })}
                    className="relative h-6 w-11 shrink-0 rounded-full bg-zinc-300 outline-none transition data-[state=checked]:bg-emerald-600 dark:bg-zinc-700 dark:data-[state=checked]:bg-emerald-600"
                  >
                    <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition will-change-transform data-[state=checked]:translate-x-[22px]" />
                  </Switch.Root>
                </Row>
                <Row
                  id="hour12"
                  label="12-hour time"
                  hint="AM/PM instead of 24-hour"
                >
                  <Switch.Root
                    id="hour12"
                    checked={settings.is12Hour}
                    onCheckedChange={(v) => setSettings({ is12Hour: v })}
                    className="relative h-6 w-11 shrink-0 rounded-full bg-zinc-300 outline-none transition data-[state=checked]:bg-emerald-600 dark:bg-zinc-700 dark:data-[state=checked]:bg-emerald-600"
                  >
                    <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition will-change-transform data-[state=checked]:translate-x-[22px]" />
                  </Switch.Root>
                </Row>
                <Row id="show-date" label="Show date" hint="Under the main clock">
                  <Switch.Root
                    id="show-date"
                    checked={settings.showDate}
                    onCheckedChange={(v) => setSettings({ showDate: v })}
                    className="relative h-6 w-11 shrink-0 rounded-full bg-zinc-300 outline-none transition data-[state=checked]:bg-emerald-600 dark:bg-zinc-700 dark:data-[state=checked]:bg-emerald-600"
                  >
                    <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition will-change-transform data-[state=checked]:translate-x-[22px]" />
                  </Switch.Root>
                </Row>
                <Row id="night" label="Night mode" hint="Dark theme for the whole site">
                  <Switch.Root
                    id="night"
                    checked={settings.isNightMode}
                    onCheckedChange={(v) => setSettings({ isNightMode: v })}
                    className="relative h-6 w-11 shrink-0 rounded-full bg-zinc-300 outline-none transition data-[state=checked]:bg-emerald-600 dark:bg-zinc-700 dark:data-[state=checked]:bg-emerald-600"
                  >
                    <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition will-change-transform data-[state=checked]:translate-x-[22px]" />
                  </Switch.Root>
                </Row>
              </div>
            </section>

            <section className="space-y-3">
              <Label.Root className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Clock color
              </Label.Root>
              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(CLOCK_THEME_PRESETS) as ThemePresetKey[]).map(
                  (key) => {
                    const active = settings.themeColor === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        title={THEME_LABELS[key]}
                        onClick={() => setSettings({ themeColor: key })}
                        className={`flex aspect-square items-center justify-center rounded-xl border-2 transition ${
                          active
                            ? "border-zinc-900 ring-2 ring-emerald-500/50 dark:border-white"
                            : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700"
                        }`}
                      >
                        <span
                          className="h-8 w-8 rounded-lg shadow-inner"
                          style={{
                            backgroundColor: CLOCK_THEME_PRESETS[key],
                            boxShadow: `inset 0 0 0 1px rgba(0,0,0,0.08)`,
                          }}
                        />
                        <span className="sr-only">{THEME_LABELS[key]}</span>
                      </button>
                    );
                  },
                )}
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Label.Root
                  htmlFor="clock-scale"
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
                >
                  Scale
                </Label.Root>
                <span className="font-mono text-sm tabular-nums text-zinc-600 dark:text-zinc-400">
                  {Math.round(settings.clockScale * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                <button
                  type="button"
                  className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  aria-label="Decrease scale"
                  onClick={() =>
                    setSettings({
                      clockScale: Math.max(
                        0.75,
                        Math.round((settings.clockScale - 0.05) * 100) / 100,
                      ),
                    })
                  }
                >
                  <Minus className="h-5 w-5" />
                </button>
                <Slider.Root
                  id="clock-scale"
                  className="relative flex h-6 flex-1 touch-none select-none items-center"
                  min={0.75}
                  max={1.75}
                  step={0.05}
                  value={[settings.clockScale]}
                  onValueChange={([v]) =>
                    setSettings({ clockScale: v ?? settings.clockScale })
                  }
                >
                  <Slider.Track className="relative h-2 grow rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <Slider.Range className="absolute h-full rounded-full bg-emerald-600" />
                  </Slider.Track>
                  <Slider.Thumb
                    className="block h-5 w-5 rounded-full border-2 border-white bg-white shadow-md ring-2 ring-emerald-600/30 focus:outline-none"
                    aria-label="Clock size"
                  />
                </Slider.Root>
                <button
                  type="button"
                  className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  aria-label="Increase scale"
                  onClick={() =>
                    setSettings({
                      clockScale: Math.min(
                        1.75,
                        Math.round((settings.clockScale + 0.05) * 100) / 100,
                      ),
                    })
                  }
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </section>

            <section className="space-y-3">
              <Label.Root className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Alarm sound
              </Label.Root>
              <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                {SOUND_OPTIONS.map(({ id, label }) => {
                  const sel = settings.alarmSound === id;
                  return (
                    <div key={id} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSettings({ alarmSound: id })}
                        className={`min-w-0 flex-1 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                          sel
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-zinc-800 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800"
                        }`}
                      >
                        {label}
                      </button>
                      <button
                        type="button"
                        className="inline-flex shrink-0 items-center justify-center rounded-lg border border-zinc-300 p-2.5 text-zinc-600 hover:bg-zinc-200 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
                        aria-label={`Test ${label}`}
                        onClick={() => previewAlarmSound(id)}
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Row({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <Label.Root
          htmlFor={id}
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          {label}
        </Label.Root>
        <p className="mt-0.5 text-xs text-zinc-500">{hint}</p>
      </div>
      {children}
    </div>
  );
}

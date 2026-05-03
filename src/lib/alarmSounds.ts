import type { AlarmSoundId } from "@/lib/settings-schema";

const SOUND_SRC = "/sounds/alarm.wav";

/** Tune the bundled WAV for three distinct “personalities”. */
export function configureAlarmAudio(
  audio: HTMLAudioElement,
  kind: AlarmSoundId,
): void {
  switch (kind) {
    case "beep":
      audio.playbackRate = 1;
      break;
    case "bell":
      audio.playbackRate = 0.72;
      break;
    case "digital":
      audio.playbackRate = 1.42;
      break;
    default:
      audio.playbackRate = 1;
  }
}

export function createAlarmAudio(kind: AlarmSoundId): HTMLAudioElement {
  const a = new Audio(SOUND_SRC);
  a.loop = true;
  configureAlarmAudio(a, kind);
  return a;
}

/** Short preview for settings panel (non-looping). */
export function previewAlarmSound(kind: AlarmSoundId): void {
  const a = new Audio(SOUND_SRC);
  configureAlarmAudio(a, kind);
  a.loop = false;
  a.play().catch(() => {});
  const stop = () => {
    a.pause();
    a.removeEventListener("ended", stop);
  };
  a.addEventListener("ended", stop);
  window.setTimeout(stop, 1200);
}

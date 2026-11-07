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

/**
 * Robust alarm and timer sound player with automatic Web Audio API fallback.
 * Prevents silent alerts when browser autoplay restrictions or network issues
 * block HTMLAudioElement playback.
 */
export class AlarmSoundPlayer {
  private audioElement: HTMLAudioElement | null = null;
  private fallbackCtx: AudioContext | null = null;
  private fallbackGain: GainNode | null = null;
  private fallbackInterval: number | null = null;
  private soundKind: AlarmSoundId = "beep";
  private isRinging = false;

  constructor(kind: AlarmSoundId = "beep") {
    this.soundKind = kind;
    if (typeof window !== "undefined") {
      try {
        this.audioElement = createAlarmAudio(kind);
      } catch {
        this.audioElement = null;
      }
    }
  }

  setKind(kind: AlarmSoundId): void {
    this.soundKind = kind;
    if (this.audioElement) {
      configureAlarmAudio(this.audioElement, kind);
    }
  }

  /**
   * Pre-primes audio on user gesture (e.g. clicking Start/Arm) so browsers
   * allow unmuted playback later when timers complete in the background.
   */
  prime(): void {
    if (!this.audioElement) return;
    const a = this.audioElement;
    const prevMuted = a.muted;
    a.muted = true;
    a.currentTime = 0;
    a.play()
      .then(() => {
        a.pause();
        a.currentTime = 0;
        a.muted = prevMuted;
      })
      .catch(() => {
        a.muted = prevMuted;
      });

    // Also prime Web Audio context if available
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const dummyCtx = new AudioCtx();
        if (dummyCtx.state === "suspended") {
          dummyCtx.resume().catch(() => {});
        }
        dummyCtx.close().catch(() => {});
      }
    } catch {
      /* ignore */
    }
  }

  play(): void {
    if (this.isRinging) return;
    this.isRinging = true;

    if (this.audioElement) {
      this.audioElement.currentTime = 0;
      this.audioElement
        .play()
        .then(() => {
          // If HTMLAudio successfully started, ensure fallback is idle
          this.stopFallbackTone();
        })
        .catch(() => {
          this.startFallbackTone();
        });
    } else {
      this.startFallbackTone();
    }
  }

  private startFallbackTone(): void {
    if (typeof window === "undefined" || this.fallbackInterval !== null) return;
    const AudioCtx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    try {
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      const gain = ctx.createGain();
      gain.gain.value = 0.09;
      gain.connect(ctx.destination);
      this.fallbackCtx = ctx;
      this.fallbackGain = gain;

      const pulse = () => {
        if (!this.fallbackCtx || !this.fallbackGain || this.fallbackCtx.state === "closed") return;
        try {
          const osc = this.fallbackCtx.createOscillator();
          const freq =
            this.soundKind === "bell"
              ? 587.33
              : this.soundKind === "digital"
                ? 1046.5
                : 880;
          osc.type = this.soundKind === "digital" ? "square" : "sine";
          osc.frequency.setValueAtTime(freq, this.fallbackCtx.currentTime);
          osc.connect(this.fallbackGain);
          osc.start();
          osc.stop(this.fallbackCtx.currentTime + 0.24);
          osc.onended = () => {
            try {
              osc.disconnect();
            } catch {}
          };
        } catch {
          // Ignore transient oscillator errors
        }
      };

      pulse();
      this.fallbackInterval = window.setInterval(pulse, 500);
    } catch {
      // AudioContext could not be created
    }
  }

  private stopFallbackTone(): void {
    if (this.fallbackInterval !== null) {
      window.clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }
    if (this.fallbackGain) {
      try {
        this.fallbackGain.disconnect();
      } catch {}
      this.fallbackGain = null;
    }
    if (this.fallbackCtx) {
      try {
        this.fallbackCtx.close().catch(() => {});
      } catch {}
      this.fallbackCtx = null;
    }
  }

  stop(): void {
    this.isRinging = false;
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.stopFallbackTone();
  }

  destroy(): void {
    this.stop();
    this.audioElement = null;
  }
}

/** Plays a single short synthesized tone (useful for interval beeps, hourly chimes, and previews). */
export function playTone(
  frequency = 880,
  duration = 0.18,
  type: OscillatorType = "sine",
  volume = 0.08,
): void {
  if (typeof window === "undefined") return;
  const AudioCtx =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  try {
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    const gain = ctx.createGain();
    gain.gain.value = volume;
    gain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.connect(gain);
    osc.start();
    osc.stop(ctx.currentTime + duration);
    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
        ctx.close().catch(() => {});
      } catch {}
    };
  } catch {
    /* ignore */
  }
}

/** Short preview for settings panel (non-looping). Falls back to tone if file playback fails. */
export function previewAlarmSound(kind: AlarmSoundId): void {
  const a = new Audio(SOUND_SRC);
  configureAlarmAudio(a, kind);
  a.loop = false;
  a.play()
    .then(() => {
      const stop = () => {
        a.pause();
        a.removeEventListener("ended", stop);
      };
      a.addEventListener("ended", stop);
      window.setTimeout(stop, 1200);
    })
    .catch(() => {
      const freq = kind === "bell" ? 587.33 : kind === "digital" ? 1046.5 : 880;
      const type: OscillatorType = kind === "digital" ? "square" : "sine";
      playTone(freq, 0.25, type);
    });
}

"use client";

import { useEffect, useRef } from "react";

type WorkerTickMessage = {
  type: "tick";
  now: number;
  due: boolean;
};

/**
 * Runs a 1s tick in a Web Worker so scheduling is less affected by main-thread
 * throttling when the tab is backgrounded. Falls back to main-thread interval if the worker fails.
 */
export function useAlarmWorker(
  alarmAtMs: number | null,
  onDue: () => void,
  enabled: boolean,
) {
  const onDueRef = useRef(onDue);
  onDueRef.current = onDue;
  const firedRef = useRef(false);

  useEffect(() => {
    firedRef.current = false;
  }, [alarmAtMs]);

  useEffect(() => {
    if (!enabled || alarmAtMs === null) return;

    let worker: Worker | undefined;
    let fallbackId: ReturnType<typeof setInterval> | undefined;

    const handleDue = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      onDueRef.current();
    };

    try {
      worker = new Worker(
        new URL("../workers/alarm-tick.worker.ts", import.meta.url),
      );
      worker.postMessage({ type: "start", alarmAt: alarmAtMs });
      worker.onmessage = (e: MessageEvent<WorkerTickMessage>) => {
        if (e.data?.type === "tick" && e.data.due) {
          handleDue();
        }
      };
    } catch {
      worker = undefined;
    }

    if (!worker) {
      fallbackId = setInterval(() => {
        if (Date.now() >= alarmAtMs) {
          clearInterval(fallbackId);
          handleDue();
        }
      }, 1000);
    }

    return () => {
      if (worker) {
        worker.postMessage({ type: "stop" });
        worker.terminate();
      }
      if (fallbackId !== undefined) clearInterval(fallbackId);
    };
  }, [alarmAtMs, enabled]);
}

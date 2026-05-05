"use client";

import { useEffect } from "react";

export function PwaBoot() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch {
        /* ignore registration failure */
      }
    };
    void register();
  }, []);

  return null;
}

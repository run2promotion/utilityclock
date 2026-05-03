"use client";

import { useEffect, useState } from "react";

/**
 * Updates at `intervalMs` (default 1000). Use for digital clocks and alarm comparisons.
 */
export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}

"use client";

import { useEffect } from "react";

export function EmbedBodyClass({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) return;
    document.body.classList.add("embed-mode");
    return () => {
      document.body.classList.remove("embed-mode");
    };
  }, [active]);

  return null;
}

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function EmbedModeFromQuery() {
  const searchParams = useSearchParams();
  const isEmbedMode = searchParams.get("embed") === "1";

  useEffect(() => {
    if (!isEmbedMode) {
      document.body.classList.remove("embed-mode");
      return;
    }
    document.body.classList.add("embed-mode");
    return () => {
      document.body.classList.remove("embed-mode");
    };
  }, [isEmbedMode]);

  return null;
}

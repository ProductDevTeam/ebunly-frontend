"use client";

import { useEffect } from "react";

/**
 * Freezes background scrolling while an overlay (drawer / bottom sheet) is open.
 * Restores whatever `overflow` the document already had so nested overlays and
 * fast open/close cycles can't leave the page stuck.
 */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}

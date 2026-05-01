"use client";

import { useCallback } from "react";

export function useRipple() {
  const onClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    if (!el.classList.contains("btn-ripple")) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--ripple-x", `${x}%`);
    el.style.setProperty("--ripple-y", `${y}%`);
  }, []);
  return { onClick };
}

"use client";

import { useEffect } from "react";

/**
 * Registers a service worker from /sw.js for offline capability.
 * Add your own sw.js to public/ (e.g. via workbox-build or next-pwa).
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            if (reg.installing) reg.installing.addEventListener("statechange", () => {});
          })
          .catch(() => {});
      });
    }
  }, []);
  return null;
}

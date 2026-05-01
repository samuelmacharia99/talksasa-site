/**
 * Placeholder service worker for offline capability.
 * Replace with a full implementation (e.g. Workbox) or use next-pwa.
 */
const CACHE_NAME = "talksasa-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(names.map((name) => caches.delete(name))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Optional: cache-first for static assets, network-first for API
  event.respondWith(fetch(event.request));
});

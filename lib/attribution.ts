"use client";

const STORAGE_KEY = "talksasa_attribution";

export type Attribution = {
  gclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  page_url?: string;
  captured_at?: number;
};

const PARAMS = [
  "gclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

type AttributionParam = (typeof PARAMS)[number];

export function captureAttributionFromUrl() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const incoming: Attribution = { page_url: window.location.href };

  for (const key of PARAMS) {
    const value = params.get(key);
    if (value) incoming[key] = value.slice(0, 120);
  }

  const hasCampaignData = PARAMS.some((key) => incoming[key]);
  if (!hasCampaignData) return;

  incoming.captured_at = Date.now();

  try {
    const existing = getAttribution();
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...incoming }));
  } catch {
    // ignore storage errors
  }
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

export function appendAttributionToUrl(url: string): string {
  const attribution = getAttribution();
  try {
    const parsed = new URL(url);
    for (const key of PARAMS) {
      const value = attribution[key as AttributionParam];
      if (value && !parsed.searchParams.has(key)) {
        parsed.searchParams.set(key, value);
      }
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

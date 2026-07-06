import type { Attribution, LeadPayload } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s\-()]{7,20}$/;

const LIMITS = {
  name: 120,
  email: 254,
  phone: 30,
  service: 80,
  message: 4000,
  gclid: 120,
  utm: 120,
  pageUrl: 500,
  metadataKey: 40,
  metadataValue: 500,
} as const;

function trim(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const cleaned = value.trim().replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  if (!cleaned) return undefined;
  return cleaned.slice(0, max);
}

function sanitizeAttribution(input: unknown): Attribution | undefined {
  if (!input || typeof input !== "object") return undefined;
  const raw = input as Record<string, unknown>;
  const attribution: Attribution = {
    gclid: trim(raw.gclid, LIMITS.gclid),
    utm_source: trim(raw.utm_source, LIMITS.utm),
    utm_medium: trim(raw.utm_medium, LIMITS.utm),
    utm_campaign: trim(raw.utm_campaign, LIMITS.utm),
    utm_term: trim(raw.utm_term, LIMITS.utm),
    utm_content: trim(raw.utm_content, LIMITS.utm),
    page_url: trim(raw.page_url, LIMITS.pageUrl),
  };
  const hasValue = Object.values(attribution).some(Boolean);
  return hasValue ? attribution : undefined;
}

function sanitizeMetadata(input: unknown): Record<string, string> | undefined {
  if (!input || typeof input !== "object") return undefined;
  const raw = input as Record<string, unknown>;
  const metadata: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    const safeKey = trim(key, LIMITS.metadataKey);
    const safeValue = trim(value, LIMITS.metadataValue);
    if (safeKey && safeValue) metadata[safeKey] = safeValue;
    if (Object.keys(metadata).length >= 12) break;
  }
  return Object.keys(metadata).length > 0 ? metadata : undefined;
}

export type ValidationResult =
  | { ok: true; data: LeadPayload }
  | { ok: false; error: string };

export function validateLeadPayload(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request" };
  }

  const raw = body as Record<string, unknown>;

  if (typeof raw.website === "string" && raw.website.trim().length > 0) {
    return { ok: false, error: "Invalid request" };
  }

  const type = raw.type;
  if (type !== "contact" && type !== "demo" && type !== "exit_intent") {
    return { ok: false, error: "Invalid lead type" };
  }

  const email = trim(raw.email, LIMITS.email)?.toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Valid email is required" };
  }

  const name = trim(raw.name, LIMITS.name);
  const phone = trim(raw.phone, LIMITS.phone);
  const service = trim(raw.service, LIMITS.service);
  const message = trim(raw.message, LIMITS.message);

  if (type === "contact" || type === "demo") {
    if (!name || name.length < 2) {
      return { ok: false, error: "Name is required" };
    }
    if (!phone || !PHONE_RE.test(phone)) {
      return { ok: false, error: "Valid phone is required" };
    }
  }

  if (type === "contact" && !service) {
    return { ok: false, error: "Service selection is required" };
  }

  if (type === "demo" && !service) {
    return { ok: false, error: "Product selection is required" };
  }

  if (type === "exit_intent") {
    if (!phone || !PHONE_RE.test(phone)) {
      return { ok: false, error: "Valid phone is required" };
    }
  }

  return {
    ok: true,
    data: {
      type,
      name,
      email,
      phone,
      service,
      message,
      metadata: sanitizeMetadata(raw.metadata),
      attribution: sanitizeAttribution(raw.attribution),
    },
  };
}

export function appendAttributionParams(url: string, attribution?: Attribution | null): string {
  if (!attribution) return url;
  try {
    const parsed = new URL(url);
    const pairs: [keyof Attribution, string][] = [
      ["gclid", "gclid"],
      ["utm_source", "utm_source"],
      ["utm_medium", "utm_medium"],
      ["utm_campaign", "utm_campaign"],
      ["utm_term", "utm_term"],
      ["utm_content", "utm_content"],
    ];
    for (const [field, param] of pairs) {
      const value = attribution[field];
      if (value) parsed.searchParams.set(param, value);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

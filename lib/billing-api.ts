import { HOSTING_URL } from "@/lib/urls";
import type {
  CartRequest,
  DomainExtensionsResponse,
  DomainSearchResponse,
  ServicesResponse,
} from "@/lib/billing-types";

const DEFAULT_BASE = `${HOSTING_URL}/api/v1/public`;

function getBaseUrl() {
  return process.env.BILLING_API_BASE_URL || DEFAULT_BASE;
}

function getToken() {
  const token = process.env.BILLING_API_TOKEN;
  if (!token) {
    throw new Error("BILLING_API_TOKEN is not configured");
  }
  return token;
}

function normalizeCheckoutUrl(url: string | undefined): string {
  if (!url) return `${HOSTING_URL}/domain-checkout`;
  if (url.includes("talksasa.com/domain-checkout") && !url.includes("servers.")) {
    return `${HOSTING_URL}/domain-checkout`;
  }
  return url;
}

function isRetryableFetchError(error: unknown): boolean {
  const parts: string[] = [];
  if (error instanceof Error) {
    parts.push(error.message);
    if (error.cause instanceof Error) parts.push(error.cause.message);
    if (error.cause && typeof error.cause === "object" && "code" in error.cause) {
      parts.push(String((error.cause as { code?: string }).code));
    }
  }
  const text = parts.join(" ");
  return /fetch failed|ETIMEDOUT|ECONNRESET|ENOTFOUND|timeout|network|aborted/i.test(text);
}

type FetchRetryOptions = {
  attempts?: number;
  timeoutMs?: number;
};

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  { attempts = 3, timeoutMs = 12_000 }: FetchRetryOptions = {}
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } catch (error) {
      lastError = error;
      if (!isRetryableFetchError(error) || attempt === attempts - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError;
}

type BillingFetchInit = RequestInit & FetchRetryOptions;

async function billingFetch<T>(path: string, init?: BillingFetchInit): Promise<T> {
  const url = `${getBaseUrl().replace(/\/$/, "")}${path}`;
  const { headers: initHeaders, attempts, timeoutMs, ...restInit } = init ?? {};

  const fetchOptions: RequestInit = {
    cache: "no-store",
    ...restInit,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(initHeaders as Record<string, string> | undefined),
    },
  };

  let res: Response;
  try {
    res = await fetchWithRetry(url, fetchOptions, { attempts, timeoutMs });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Network error";
    throw new Error(`Could not reach billing API: ${detail}`);
  }

  if (!res.ok) {
    const text = await res.text();
    let message = `Billing API error (${res.status})`;
    try {
      const json = JSON.parse(text) as { message?: string };
      if (json.message) message = json.message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export async function fetchServices(): Promise<ServicesResponse> {
  return billingFetch<ServicesResponse>("/services");
}

export async function fetchDomainExtensions(period = 1): Promise<DomainExtensionsResponse> {
  const data = await billingFetch<DomainExtensionsResponse>(
    `/domains/extensions?period=${period}`
  );
  return {
    ...data,
    checkout_url: normalizeCheckoutUrl(data.checkout_url),
  };
}

export async function searchDomains(query: string, period = 1): Promise<DomainSearchResponse> {
  const params = new URLSearchParams({ q: query.trim(), period: String(period) });
  const data = await billingFetch<DomainSearchResponse>(`/domains/search?${params}`, {
    cache: "no-store",
    timeoutMs: 60_000,
    attempts: 2,
  });
  const results = data.results ?? [];
  return {
    ...data,
    checkout_url: normalizeCheckoutUrl(data.checkout_url),
    results: results.map((r) => ({
      ...r,
      checkout_url: normalizeCheckoutUrl(r.checkout_url),
    })),
  };
}

export async function createCart(payload: CartRequest): Promise<{ checkoutUrl: string }> {
  const res = await fetch(`${getBaseUrl().replace(/\/$/, "")}/cart`, {
    method: "POST",
    redirect: "manual",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });

  const location = res.headers.get("location");
  if (res.status >= 300 && res.status < 400 && location) {
    return { checkoutUrl: normalizeCheckoutUrl(location) };
  }

  const text = await res.text();
  let body: { checkout_url?: string; redirect_url?: string; url?: string; message?: string } = {};
  try {
    body = JSON.parse(text);
  } catch {
    // not JSON
  }

  if (res.ok) {
    const checkoutUrl = body.checkout_url || body.redirect_url || body.url || location;
    if (checkoutUrl) return { checkoutUrl: normalizeCheckoutUrl(checkoutUrl) };
  }

  if (res.status === 419 || res.status === 403) {
    throw new Error(
      "Checkout session could not be started from the marketing site. Open the hosting portal to complete your order."
    );
  }

  throw new Error(body.message || `Checkout failed (${res.status})`);
}

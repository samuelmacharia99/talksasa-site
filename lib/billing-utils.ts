export function parseServiceFeatures(description: string | null | undefined): string[] {
  if (!description) return [];
  return description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function formatBillingPrice(amount: number, currency: string): string {
  if (currency === "KES") {
    return `KES ${amount.toLocaleString("en-KE")}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
}

export type ParsedDomainQuery = {
  /** Second-level label sent to the search API */
  label: string;
  /** Normalized full domain when the user typed one, e.g. mashariaaa.com */
  exactFullDomain: string | null;
};

/** Parse user input into an SLD for search and an optional exact full domain. */
export function parseDomainQuery(raw: string): ParsedDomainQuery {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/^www\./i, "")
    .replace(/\.+$/, "");

  if (!cleaned) return { label: "", exactFullDomain: null };

  const parts = cleaned.split(".").filter(Boolean);
  if (parts.length === 1) {
    return { label: parts[0], exactFullDomain: null };
  }

  if (parts.length >= 3 && parts[parts.length - 2] === "co" && parts[parts.length - 1] === "ke") {
    const label = parts.slice(0, -2).join(".");
    return { label, exactFullDomain: `${label}.co.ke` };
  }

  const label = parts[0];
  const extension = parts.slice(1).join(".");
  return { label, exactFullDomain: `${label}.${extension}` };
}

const TLD_PRIORITY = [".com", ".co.ke", ".org", ".net", ".ke"];

function tldPriority(fullDomain: string): number {
  const lower = fullDomain.toLowerCase();
  const idx = TLD_PRIORITY.findIndex((tld) => lower.endsWith(tld));
  return idx === -1 ? TLD_PRIORITY.length : idx;
}

export function sortDomainResults<T extends { full_domain: string; available: boolean; price: number }>(
  results: T[],
  exactFullDomain: string | null
): T[] {
  const exact = exactFullDomain?.toLowerCase() ?? null;

  return [...results].sort((a, b) => {
    const aExact = exact !== null && a.full_domain.toLowerCase() === exact;
    const bExact = exact !== null && b.full_domain.toLowerCase() === exact;
    if (aExact !== bExact) return aExact ? -1 : 1;

    if (a.available !== b.available) return a.available ? -1 : 1;

    const priorityDiff = tldPriority(a.full_domain) - tldPriority(b.full_domain);
    if (priorityDiff !== 0) return priorityDiff;

    return a.price - b.price;
  });
}

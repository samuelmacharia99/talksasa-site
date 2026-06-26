import type { BillingCycle, PlatformService, ServerIpOption, ServerLocation } from "@/lib/billing-types";

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

export function getLocationCycleAmount(location: ServerLocation, cycle: BillingCycle): number {
  switch (cycle) {
    case "annual":
      return location.prices.annual;
    case "quarterly":
      return location.prices.quarterly;
    case "semi-annual":
      return location.prices["semi-annual"];
    default:
      return location.prices.monthly;
  }
}

export function getDefaultLocationKey(plan: PlatformService): string {
  const locations = plan.configuration?.locations ?? [];
  const kenya = locations.find((l) => l.key === "kenya");
  if (kenya) return kenya.key;
  return locations[0]?.key ?? "default";
}

export function getDefaultOperatingSystem(plan: PlatformService): string {
  const systems = plan.configuration?.operating_systems ?? [];
  const ubuntu = systems.find((s) => s.key.startsWith("ubuntu-24"));
  return ubuntu?.key ?? systems[0]?.key ?? "ubuntu-24.04";
}

export function getIpOption(plan: PlatformService, ipCount: number): ServerIpOption | undefined {
  return plan.configuration?.ip_options.find((o) => o.ip_count === ipCount);
}

/** Quote recurring + setup for display before checkout. */
export function quoteConfiguredServer(
  plan: PlatformService,
  options: { locationKey: string; ipCount: number; billingCycle: BillingCycle }
): { recurring: number; setupFee: number; currency: string } {
  const config = plan.configuration;
  if (!config) {
    const recurring =
      options.billingCycle === "annual" && plan.yearly_price != null
        ? plan.yearly_price
        : plan.monthly_price;
    return { recurring, setupFee: plan.setup_fee, currency: plan.currency };
  }

  const location =
    config.locations.find((l) => l.key === options.locationKey) ?? config.locations[0];
  const ipOption = getIpOption(plan, options.ipCount) ?? config.ip_options[0];

  let recurring = getLocationCycleAmount(location, options.billingCycle);
  let setupFee = location.prices.setup_fee;

  if (plan.type === "dedicated_server") {
    const months =
      options.billingCycle === "annual"
        ? 12
        : options.billingCycle === "semi-annual"
          ? 6
          : options.billingCycle === "quarterly"
            ? 3
            : 1;
    recurring += ipOption.monthly_addon * months;
  } else if (plan.type === "vps") {
    setupFee += ipOption.setup_addon;
  }

  return { recurring, setupFee, currency: location.prices.currency };
}

export function getPlanSortPrice(plan: PlatformService, billingCycle: BillingCycle): number {
  if (plan.configuration?.locations.length) {
    const amounts = plan.configuration.locations.map((l) =>
      getLocationCycleAmount(l, billingCycle)
    );
    return Math.min(...amounts);
  }
  if (billingCycle === "annual" && plan.yearly_price != null) return plan.yearly_price;
  return plan.monthly_price;
}

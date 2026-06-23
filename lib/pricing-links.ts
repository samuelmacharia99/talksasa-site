import type { CloudProductTab } from "@/lib/billing-types";

export type PricingProduct = "bulk-sms" | "cloud";

const CLOUD_TABS: CloudProductTab[] = ["hosting", "vps", "dedicated", "cloud"];

export function isPricingProduct(value: string | null | undefined): value is PricingProduct {
  return value === "bulk-sms" || value === "cloud";
}

export function isCloudProductTab(value: string | null | undefined): value is CloudProductTab {
  return !!value && CLOUD_TABS.includes(value as CloudProductTab);
}

export function pricingUrl(options?: { product?: PricingProduct; tab?: CloudProductTab }): string {
  const params = new URLSearchParams();
  if (options?.product) params.set("product", options.product);
  if (options?.tab) params.set("tab", options.tab);
  const qs = params.toString();
  return qs ? `/pricing?${qs}` : "/pricing";
}

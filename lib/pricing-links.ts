import type { CloudProductTab } from "@/lib/billing-types";
import type { AppTechStack } from "@/lib/container-stacks";

export type PricingProduct = "bulk-sms" | "cloud" | "reseller-hosting";

const CLOUD_TABS: CloudProductTab[] = ["hosting", "vps", "dedicated", "cloud", "email"];

export function isPricingProduct(value: string | null | undefined): value is PricingProduct {
  return value === "bulk-sms" || value === "cloud" || value === "reseller-hosting";
}

export function isCloudProductTab(value: string | null | undefined): value is CloudProductTab {
  return !!value && CLOUD_TABS.includes(value as CloudProductTab);
}

export function pricingUrl(options?: {
  product?: PricingProduct;
  tab?: CloudProductTab;
  stack?: AppTechStack;
}): string {
  const params = new URLSearchParams();
  if (options?.product) params.set("product", options.product);
  if (options?.tab) params.set("tab", options.tab);
  if (options?.stack) params.set("stack", options.stack);
  const qs = params.toString();
  return qs ? `/pricing?${qs}` : "/pricing";
}

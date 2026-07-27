import type { CloudProductTab } from "@/lib/billing-types";
import type { AppTechStack } from "@/lib/container-stacks";

/** URL `product` values (kept for deep-link compatibility). */
export type PricingProduct = "bulk-sms" | "cloud" | "email-hosting" | "reseller-hosting";

/** Top-level pricing brands shown in the UI. */
export type PricingBrand = "sms" | "cloud" | "mail";

const CLOUD_TABS: CloudProductTab[] = ["cloud", "vps", "dedicated", "reseller"];

export function isPricingProduct(value: string | null | undefined): value is PricingProduct {
  return (
    value === "bulk-sms" ||
    value === "cloud" ||
    value === "email-hosting" ||
    value === "reseller-hosting"
  );
}

export function isCloudProductTab(value: string | null | undefined): value is CloudProductTab {
  return !!value && CLOUD_TABS.includes(value as CloudProductTab);
}

export function isPricingBrand(value: string | null | undefined): value is PricingBrand {
  return value === "sms" || value === "cloud" || value === "mail";
}

/** Map legacy/deep-link `product` (+ optional `tab`) to a pricing brand. */
export function pricingBrandFromParams(
  product: string | null | undefined,
  tab?: string | null
): PricingBrand {
  if (product === "bulk-sms") return "sms";
  if (product === "email-hosting" || tab === "email") return "mail";
  return "cloud";
}

/** Map deep-link params to a Talksasa Cloud sub-tab. */
export function cloudTabFromParams(
  product: string | null | undefined,
  tab?: string | null
): CloudProductTab {
  if (product === "reseller-hosting" || tab === "reseller") return "reseller";
  if (isCloudProductTab(tab)) return tab;
  return "cloud";
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

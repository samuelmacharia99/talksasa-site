"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/currency-provider";
import { CheckoutButton } from "@/components/checkout-button";
import { parseServiceFeatures } from "@/lib/billing-utils";
import type {
  BillingCycle,
  CloudProductTab,
  PlatformService,
} from "@/lib/billing-types";
import { CLOUD_PRODUCT_LABELS, SERVICE_TYPES_BY_TAB as TAB_TYPES } from "@/lib/billing-types";

type Billing = "monthly" | "annual";

function mapBillingCycle(billing: Billing): BillingCycle {
  return billing === "annual" ? "annual" : "monthly";
}

function getSortPrice(plan: PlatformService, billing: Billing): number {
  if (billing === "annual" && plan.yearly_price != null) {
    return plan.yearly_price;
  }
  return plan.monthly_price;
}

function sortPlansByPrice(plans: PlatformService[], billing: Billing): PlatformService[] {
  return [...plans].sort((a, b) => {
    const diff = getSortPrice(a, billing) - getSortPrice(b, billing);
    if (diff !== 0) return diff;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}

function pickFeatured(services: PlatformService[]): number {
  if (services.length <= 1) return 0;
  const silverIdx = services.findIndex((s) => s.name.toLowerCase().includes("silver"));
  if (silverIdx >= 0) return silverIdx;
  return Math.min(1, services.length - 1);
}

export function CloudPricing({
  className,
  defaultTab = "hosting",
}: {
  className?: string;
  defaultTab?: CloudProductTab;
}) {
  const { formatPrice } = useCurrency();
  const [product, setProduct] = useState<CloudProductTab>(defaultTab);
  const [billing, setBilling] = useState<Billing>("monthly");
  const [services, setServices] = useState<PlatformService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/billing/services")
      .then((r) => r.json())
      .then((data) => {
        if (!data.services) throw new Error(data.error || "Failed to load pricing");
        setServices(data.services);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load pricing"))
      .finally(() => setLoading(false));
  }, []);

  const plans = useMemo(() => {
    const types = TAB_TYPES[product];
    const filtered = services.filter((s) => types.includes(s.type));
    return sortPlansByPrice(filtered, billing);
  }, [services, product, billing]);

  const featuredIndex = useMemo(() => pickFeatured(plans), [plans]);

  if (loading) {
    return (
      <div className={cn("flex justify-center py-16", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <p className={cn("text-center text-sm text-red-400 py-8", className)} role="alert">
        {error}
      </p>
    );
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Cloud product pricing"
        className="flex flex-wrap justify-center gap-2 mb-8"
      >
        {(Object.keys(CLOUD_PRODUCT_LABELS) as CloudProductTab[]).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={product === key}
            onClick={() => setProduct(key)}
            className={cn(
              "relative rounded-full px-4 sm:px-5 py-2.5 min-h-[44px] text-sm font-medium transition-all",
              product === key
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            {product === key && (
              <motion.span
                layoutId="cloud-product-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{CLOUD_PRODUCT_LABELS[key]}</span>
          </button>
        ))}
      </div>

      {product !== "dedicated" && (
        <div className="flex justify-center items-center gap-3 mb-10">
          <span className={cn("text-sm", billing === "monthly" ? "text-foreground font-medium" : "text-muted-foreground")}>
            Monthly
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={billing === "annual"}
            aria-label="Toggle annual billing"
            onClick={() => setBilling((b) => (b === "monthly" ? "annual" : "monthly"))}
            className={cn(
              "relative w-12 h-7 rounded-full transition-colors",
              billing === "annual" ? "bg-primary" : "bg-muted"
            )}
          >
            <motion.span
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
              animate={{ left: billing === "annual" ? "22px" : "4px" }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
              style={{ top: "4px" }}
            />
          </button>
          <span className={cn("text-sm", billing === "annual" ? "text-foreground font-medium" : "text-muted-foreground")}>
            Annual
          </span>
        </div>
      )}

      {plans.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No plans available for this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto items-stretch">
          <AnimatePresence initial={false}>
            {plans.map((plan, i) => {
              const featured = i === featuredIndex;
              const features =
                plan.features && plan.features.length > 0
                  ? plan.features
                  : parseServiceFeatures(plan.description);
              const price =
                billing === "annual" && plan.yearly_price != null
                  ? plan.yearly_price
                  : plan.monthly_price;
              const cycle = mapBillingCycle(billing);

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                  className={cn(
                    "relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 flex flex-col",
                    featured
                      ? "glass gradient-border shadow-glow-sm 2xl:scale-105 z-10"
                      : "glass border-border hover:border-primary/20"
                  )}
                >
                  {featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1 text-xs font-medium text-white">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-foreground capitalize">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{plan.category}</p>
                  <div className="mt-6 flex items-baseline gap-1 flex-wrap">
                    {plan.type === "dedicated_server" && (
                      <span className="text-sm text-muted-foreground">From</span>
                    )}
                    <span className="text-2xl sm:text-3xl font-bold text-foreground">
                      {formatPrice(price, 0)}
                    </span>
                    <span className="text-muted-foreground">
                      /{billing === "annual" && plan.yearly_price != null ? "yr" : "mo"}
                    </span>
                  </div>
                  {plan.setup_fee > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      + {formatPrice(plan.setup_fee, 0)} setup fee
                    </p>
                  )}
                  <ul className="mt-6 space-y-2 flex-1 max-h-64 overflow-y-auto pr-1">
                    {features.slice(0, 12).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <CheckoutButton
                    items={[
                      {
                        type: "service",
                        product_id: plan.id,
                        billing_cycle: cycle,
                      },
                    ]}
                    label="Order now"
                    className={cn(
                      "mt-8",
                      featured && "bg-gradient-to-r from-indigo-500 to-purple-600 border-0 hover:opacity-90"
                    )}
                    trackId={`cloud_pricing_${plan.type}`}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Live retail prices from Talksasa Cloud billing. Bulk SMS pricing is listed separately.
      </p>
    </div>
  );
}

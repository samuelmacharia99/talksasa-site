"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/currency-provider";
import { CheckoutButton } from "@/components/checkout-button";
import { ServerPlanCard } from "@/components/server-plan-card";
import { parseServiceFeatures, getPlanSortPrice } from "@/lib/billing-utils";
import {
  APP_TECH_STACK_LABELS,
  getServiceTechStack,
  isAppTechStack,
  listAvailableTechStacks,
  type AppTechStack,
} from "@/lib/container-stacks";
import type {
  BillingCycle,
  CloudProductTab,
  PlatformService,
} from "@/lib/billing-types";
import { CLOUD_PRODUCT_LABELS, isConfigurableServer, SERVICE_TYPES_BY_TAB as TAB_TYPES } from "@/lib/billing-types";
import { EmailHostingPlans } from "@/components/email-hosting/email-hosting-plans";
import Link from "next/link";

type Billing = "monthly" | "annual";

function mapBillingCycle(billing: Billing): BillingCycle {
  return billing === "annual" ? "annual" : "monthly";
}

function sortPlansByPrice(plans: PlatformService[], billing: Billing): PlatformService[] {
  const cycle = mapBillingCycle(billing);
  return [...plans].sort((a, b) => {
    const diff = getPlanSortPrice(a, cycle) - getPlanSortPrice(b, cycle);
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

function StandardPlanCard({
  plan,
  billing,
  featured,
  subtitle,
}: {
  plan: PlatformService;
  billing: Billing;
  featured: boolean;
  subtitle?: string;
}) {
  const { formatPrice } = useCurrency();
  const cycle = mapBillingCycle(billing);
  const features =
    plan.features && plan.features.length > 0
      ? plan.features
      : parseServiceFeatures(plan.description);
  const price =
    billing === "annual" && plan.yearly_price != null ? plan.yearly_price : plan.monthly_price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
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
      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
        {subtitle ?? plan.category}
      </p>
      <div className="mt-6 flex items-baseline gap-1 flex-wrap">
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
        items={[{ type: "service", product_id: plan.id, billing_cycle: cycle }]}
        label="Order now"
        className={cn(
          "mt-8",
          featured && "bg-gradient-to-r from-indigo-500 to-purple-600 border-0 hover:opacity-90"
        )}
        trackId={`cloud_pricing_${plan.type}`}
      />
    </motion.div>
  );
}

export function CloudPricing({
  className,
  defaultTab = "hosting",
}: {
  className?: string;
  defaultTab?: CloudProductTab;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<CloudProductTab>(defaultTab);
  const [billing, setBilling] = useState<Billing>("monthly");
  const [services, setServices] = useState<PlatformService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [techStack, setTechStack] = useState<AppTechStack | null>(() => {
    const value = searchParams.get("stack");
    return isAppTechStack(value) ? value : null;
  });

  useEffect(() => {
    setProduct(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    const value = searchParams.get("stack");
    setTechStack(isAppTechStack(value) ? value : null);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadServices(): Promise<PlatformService[]> {
      const res = await fetch("/api/billing/services", { signal: controller.signal });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.services) {
        throw new Error(data.error || "Failed to load pricing");
      }
      return data.services as PlatformService[];
    }

    async function run() {
      setLoading(true);
      setError("");
      const retryDelays = [0, 800, 1600];

      for (let attempt = 0; attempt < retryDelays.length; attempt++) {
        if (cancelled) return;
        if (retryDelays[attempt]) {
          await new Promise((resolve) => setTimeout(resolve, retryDelays[attempt]));
        }
        try {
          const nextServices = await loadServices();
          if (!cancelled) {
            setServices(nextServices);
            setLoading(false);
          }
          return;
        } catch (err) {
          if (attempt === retryDelays.length - 1 && !cancelled) {
            setError(err instanceof Error ? err.message : "Failed to load pricing");
            setLoading(false);
          }
        }
      }
    }

    run();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const availableStacks = useMemo(
    () => listAvailableTechStacks(services),
    [services]
  );

  const activeStack = useMemo(() => {
    if (product !== "cloud") return null;
    if (techStack && availableStacks.includes(techStack)) return techStack;
    return availableStacks[0] ?? null;
  }, [product, techStack, availableStacks]);

  const plans = useMemo(() => {
    const types = TAB_TYPES[product];
    let filtered = services.filter((s) =>
      types.includes(s.type as (typeof types)[number])
    );
    if (product === "cloud" && activeStack) {
      filtered = filtered.filter((plan) => getServiceTechStack(plan) === activeStack);
    }
    return sortPlansByPrice(filtered, billing);
  }, [services, product, billing, activeStack]);

  const featuredIndex = useMemo(() => pickFeatured(plans), [plans]);
  const billingCycle = mapBillingCycle(billing);
  const isServerTab = product === "vps" || product === "dedicated";

  function selectTechStack(stack: AppTechStack) {
    setTechStack(stack);
    const params = new URLSearchParams(searchParams.toString());
    params.set("stack", stack);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

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

      {product === "email" ? (
        <div className="space-y-6">
          <p className="text-center text-sm text-muted-foreground">
            Business email needs a domain at checkout.{" "}
            <Link href="/email-hosting" className="text-primary hover:underline">
              Full email hosting page
            </Link>
          </p>
          <EmailHostingPlans />
        </div>
      ) : (
        <>
      {product === "cloud" && availableStacks.length > 0 && (
        <div className="mb-8">
          <p className="text-center text-sm text-muted-foreground mb-3">Choose your stack</p>
          <div
            role="tablist"
            aria-label="Application hosting tech stack"
            className="flex flex-wrap justify-center gap-2"
          >
            {availableStacks.map((stack) => (
              <button
                key={stack}
                type="button"
                role="tab"
                aria-selected={activeStack === stack}
                onClick={() => selectTechStack(stack)}
                className={cn(
                  "relative rounded-full px-4 py-2 min-h-[40px] text-sm font-medium transition-all",
                  activeStack === stack
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-border"
                )}
              >
                {activeStack === stack && (
                  <motion.span
                    layoutId="cloud-stack-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{APP_TECH_STACK_LABELS[stack]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

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

      {plans.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          {product === "cloud" && activeStack
            ? `No ${APP_TECH_STACK_LABELS[activeStack]} plans are available right now.`
            : "No plans available for this category."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto items-stretch">
          <AnimatePresence initial={false}>
            {plans.map((plan, i) => {
              const featured = i === featuredIndex;
              if (isServerTab && isConfigurableServer(plan)) {
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                  >
                    <ServerPlanCard
                      plan={plan}
                      billingCycle={billingCycle}
                      featured={featured}
                    />
                  </motion.div>
                );
              }
              return (
                <StandardPlanCard
                  key={plan.id}
                  plan={plan}
                  billing={billing}
                  featured={featured}
                  subtitle={
                    product === "cloud" && activeStack
                      ? APP_TECH_STACK_LABELS[activeStack]
                      : undefined
                  }
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {isServerTab && (
        <p className="mt-6 text-center text-xs text-muted-foreground">
          VPS and dedicated prices vary by datacenter, IP count, and operating system. Selections are sent to checkout.
        </p>
      )}

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Live retail prices from Talksasa Cloud billing. Bulk SMS pricing is listed separately.
      </p>
        </>
      )}
    </div>
  );
}

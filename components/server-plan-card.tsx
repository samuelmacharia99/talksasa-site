"use client";

import { useMemo, useState } from "react";
import { Check, MapPin, Monitor, Network } from "lucide-react";
import { CheckoutButton } from "@/components/checkout-button";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/currency-provider";
import type { BillingCycle, CartServiceItem, PlatformService } from "@/lib/billing-types";
import { asServerConfiguration, isConfigurableServer } from "@/lib/billing-types";
import {
  getDefaultLocationKey,
  getDefaultOperatingSystem,
  parseServiceFeatures,
  quoteConfiguredServer,
} from "@/lib/billing-utils";

type ServerPlanCardProps = {
  plan: PlatformService;
  billingCycle: BillingCycle;
  featured?: boolean;
  className?: string;
};

const selectClass =
  "mt-1.5 w-full rounded-lg border border-border bg-background/80 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

export function ServerPlanCard({ plan, billingCycle, featured, className }: ServerPlanCardProps) {
  const { formatPrice } = useCurrency();
  const config = asServerConfiguration(plan);

  const [locationKey, setLocationKey] = useState(() => getDefaultLocationKey(plan));
  const [ipCount, setIpCount] = useState(() => config?.ip_options[0]?.ip_count ?? 1);
  const [operatingSystem, setOperatingSystem] = useState(() => getDefaultOperatingSystem(plan));

  const features = useMemo(() => {
    if (config?.spec_lines?.length) return config.spec_lines;
    if (plan.features?.length) return plan.features;
    return parseServiceFeatures(plan.description);
  }, [config, plan]);

  const quote = useMemo(
    () => quoteConfiguredServer(plan, { locationKey, ipCount, billingCycle }),
    [plan, locationKey, ipCount, billingCycle]
  );

  const cartItem: CartServiceItem = useMemo(
    () => ({
      type: "service",
      product_id: plan.id,
      billing_cycle: billingCycle,
      location_key: locationKey,
      ip_count: ipCount,
      operating_system: operatingSystem,
    }),
    [plan.id, billingCycle, locationKey, ipCount, operatingSystem]
  );

  const periodLabel =
    billingCycle === "annual" ? "yr" : billingCycle === "quarterly" ? "qtr" : "mo";

  if (!isConfigurableServer(plan) || !config) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 flex flex-col h-full",
        featured
          ? "glass gradient-border shadow-glow-sm border-primary/30"
          : "glass border-border hover:border-primary/25 hover:-translate-y-0.5",
        className
      )}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1 text-xs font-medium text-white whitespace-nowrap">
          Most Popular
        </div>
      )}

      <h3 className="text-lg font-semibold text-foreground capitalize">{plan.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{plan.category}</p>

      <div className="mt-5 flex items-baseline gap-1 flex-wrap">
        <span className="text-2xl sm:text-3xl font-bold text-foreground">
          {formatPrice(quote.recurring, 0)}
        </span>
        <span className="text-muted-foreground text-sm">/{periodLabel}</span>
      </div>
      {quote.setupFee > 0 && (
        <p className="mt-1 text-xs text-muted-foreground">
          + {formatPrice(quote.setupFee, 0)} one-time setup
        </p>
      )}

      <div className="mt-5 rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Configure before checkout
        </p>

        <label className="block">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Datacenter
          </span>
          <select
            className={selectClass}
            value={locationKey}
            onChange={(e) => setLocationKey(e.target.value)}
            aria-label="Server location"
          >
            {config.locations.map((loc) => (
              <option key={loc.key} value={loc.key}>
                {loc.name}
                {loc.city ? ` (${loc.city})` : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Network className="h-3.5 w-3.5 text-primary" />
            IP addresses
          </span>
          <select
            className={selectClass}
            value={ipCount}
            onChange={(e) => setIpCount(Number(e.target.value))}
            aria-label="IP address count"
          >
            {config.ip_options.map((opt) => (
              <option key={opt.ip_count} value={opt.ip_count}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Monitor className="h-3.5 w-3.5 text-primary" />
            Operating system
          </span>
          <select
            className={selectClass}
            value={operatingSystem}
            onChange={(e) => setOperatingSystem(e.target.value)}
            aria-label="Operating system"
          >
            {config.operating_systems.map((os) => (
              <option key={os.key} value={os.key}>
                {os.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ul className="mt-5 space-y-2 flex-1 max-h-48 overflow-y-auto pr-1">
        {features.slice(0, 10).map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span className="leading-snug">{f}</span>
          </li>
        ))}
      </ul>

      <CheckoutButton
        items={[cartItem]}
        label="Order now"
        className={cn(
          "mt-6",
          featured && "bg-gradient-to-r from-indigo-500 to-purple-600 border-0 hover:opacity-90"
        )}
        trackId={`cloud_pricing_${plan.type}`}
      />
    </div>
  );
}

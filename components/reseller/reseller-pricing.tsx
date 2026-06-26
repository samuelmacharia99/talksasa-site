"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  HardDrive,
  Layers,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/currency-provider";
import { CheckoutButton } from "@/components/checkout-button";
import { Button } from "@/components/ui/button";
import { parseServiceFeatures } from "@/lib/billing-utils";
import type { ResellerBillingCycle, ResellerPackage } from "@/lib/billing-types";

function pickFeaturedIndex(packages: ResellerPackage[]): number {
  if (packages.length <= 1) return 0;
  const kickstart = packages.findIndex((p) => p.name.toLowerCase().includes("kickstart"));
  if (kickstart >= 0) return kickstart;
  return Math.min(1, packages.length - 1);
}

function packageHighlights(pkg: ResellerPackage): string[] {
  const fromDesc = parseServiceFeatures(pkg.description).slice(0, 4);
  const combined = [...pkg.features, ...fromDesc.filter((f) => !pkg.features.includes(f))];
  return combined.slice(0, 8);
}

function ResellerPlanSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-muted/20 p-6 sm:p-8 animate-pulse">
      <div className="h-6 w-32 bg-muted rounded" />
      <div className="mt-6 h-10 w-40 bg-muted rounded" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 bg-muted rounded w-full" />
        ))}
      </div>
      <div className="mt-8 h-11 bg-muted rounded-xl" />
    </div>
  );
}

export function ResellerPricing({
  id = "reseller-pricing",
  className,
  compactHeader = false,
  embedded = false,
}: {
  id?: string;
  className?: string;
  compactHeader?: boolean;
  /** When true, skip inner container (parent already provides layout). */
  embedded?: boolean;
}) {
  const { formatPrice } = useCurrency();
  const [cycle, setCycle] = useState<ResellerBillingCycle>("monthly");
  const [packages, setPackages] = useState<ResellerPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadPackages(): Promise<ResellerPackage[]> {
      const res = await fetch(`/api/billing/reseller-packages?cycle=${cycle}`, {
        signal: controller.signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !Array.isArray(data.packages)) {
        throw new Error(data.error || "Failed to load reseller plans");
      }
      return data.packages as ResellerPackage[];
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
          const list = await loadPackages();
          if (!cancelled) {
            setPackages([...list].sort((a, b) => a.total - b.total));
            setLoading(false);
          }
          return;
        } catch (err) {
          if (attempt === retryDelays.length - 1 && !cancelled) {
            setError(err instanceof Error ? err.message : "Failed to load reseller plans");
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
  }, [cycle, reloadKey]);

  const featuredIndex = useMemo(() => pickFeaturedIndex(packages), [packages]);

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28",
        compactHeader ? "py-0" : "section-py border-y border-border bg-muted/10",
        className
      )}
    >
      <div className={cn(!embedded && "container mx-auto px-4 sm:px-6 lg:px-8")}>
        {!compactHeader && (
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-sm font-medium uppercase tracking-wider text-primary mb-2">
              Live from Talksasa Cloud
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Reseller platform <span className="gradient-text">plans</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Tax-inclusive retail pricing, customer limits, and disk pool — checkout online and launch your hosting brand.
            </p>
          </div>
        )}

        {compactHeader && (
          <p className="text-center text-sm text-muted-foreground mb-8 max-w-xl mx-auto">
            White-label platform plans with live retail rates and tax-inclusive totals.
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "text-sm",
                cycle === "monthly" ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              Monthly
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={cycle === "annual"}
              aria-label="Toggle annual reseller billing"
              onClick={() => setCycle((c) => (c === "monthly" ? "annual" : "monthly"))}
              className={cn(
                "relative w-12 h-7 rounded-full transition-colors",
                cycle === "annual" ? "bg-primary" : "bg-muted"
              )}
            >
              <motion.span
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                animate={{ left: cycle === "annual" ? "22px" : "4px" }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                style={{ top: "4px" }}
              />
            </button>
            <span
              className={cn(
                "text-sm",
                cycle === "annual" ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              Annual
            </span>
          </div>
          {!loading && packages.length > 0 && (
            <span className="text-xs text-muted-foreground rounded-full border border-border px-3 py-1">
              {packages.length} plan{packages.length !== 1 ? "s" : ""} · prices incl. VAT
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <ResellerPlanSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center rounded-2xl border border-red-500/30 bg-red-500/5 p-8">
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setReloadKey((k) => k + 1)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
          </div>
        ) : packages.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No reseller plans available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto items-stretch">
            {packages.map((pkg, i) => {
              const featured = i === featuredIndex;
              const highlights = packageHighlights(pkg);

              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "relative rounded-2xl p-6 sm:p-8 border flex flex-col transition-all duration-300",
                    featured
                      ? "glass gradient-border shadow-glow-sm border-primary/30 xl:scale-[1.02] z-10"
                      : "glass border-border hover:border-primary/25 hover:-translate-y-0.5"
                  )}
                >
                  {featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1 text-xs font-semibold text-white whitespace-nowrap">
                      <Sparkles className="h-3 w-3" />
                      Best for agencies
                    </span>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-bold text-foreground">{pkg.name}</h3>
                    <span className="shrink-0 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5">
                      VAT incl.
                    </span>
                  </div>

                  <div className="mt-5 flex items-baseline gap-1 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                      {formatPrice(pkg.total, 0)}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      /{cycle === "annual" ? "year" : "month"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Subtotal {formatPrice(pkg.subtotal, 0)} · Tax {formatPrice(pkg.tax, 0)}
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {[
                      { icon: Users, label: "Customers", value: pkg.max_users.toLocaleString() },
                      { icon: Layers, label: "Services", value: pkg.max_services.toLocaleString() },
                      { icon: HardDrive, label: "Disk pool", value: `${pkg.disk_pool_gb} GB` },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-border/80 bg-background/40 px-2 py-2.5 text-center"
                      >
                        <stat.icon className="h-3.5 w-3.5 text-primary mx-auto mb-1" />
                        <p className="text-xs font-semibold text-foreground leading-tight">{stat.value}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <ul className="mt-6 space-y-2.5 flex-1 max-h-52 overflow-y-auto pr-1">
                    {highlights.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <CheckoutButton
                    items={[{ type: "reseller_package", reseller_package_id: pkg.id }]}
                    label={featured ? "Start with this plan" : "Get started"}
                    className={cn(
                      "mt-8",
                      featured && "bg-gradient-to-r from-indigo-500 to-purple-600 border-0 hover:opacity-90"
                    )}
                    trackId={`reseller_package_${pkg.id}`}
                  />
                </motion.div>
              );
            })}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-muted-foreground max-w-lg mx-auto">
          Reseller plans checkout separately from hosting and domain orders. One platform plan per order.
        </p>
      </div>
    </section>
  );
}

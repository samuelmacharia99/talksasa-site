"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Mail } from "lucide-react";
import { CheckoutButton } from "@/components/checkout-button";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/lib/currency-provider";
import { cn } from "@/lib/utils";
import type { BillingCycle, CartItem, PlatformService } from "@/lib/billing-types";
import { getEmailHostingConfig, isEmailHostingPlan } from "@/lib/billing-types";

type Billing = "monthly" | "annual";
type DomainMode = "existing" | "register";

function mapBillingCycle(billing: Billing): BillingCycle {
  return billing === "annual" ? "annual" : "monthly";
}

function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .replace(/\.$/, "");
}

function isLikelyDomain(value: string): boolean {
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i.test(value);
}

function formatQuota(mb?: number): string | null {
  if (mb == null || mb <= 0) return null;
  if (mb >= 1024) return `${Math.round((mb / 1024) * 10) / 10} GB`;
  return `${mb} MB`;
}

function planLimitLines(plan: PlatformService): string[] {
  const config = getEmailHostingConfig(plan);
  const lines: string[] = [];
  if (config?.mailboxes != null) lines.push(`${config.mailboxes} mailboxes`);
  if (config?.aliases != null) lines.push(`${config.aliases} aliases`);
  const total = formatQuota(config?.quota_mb);
  if (total) lines.push(`${total} total storage`);
  const perBox = formatQuota(config?.mailbox_quota_mb);
  if (perBox) lines.push(`${perBox} per mailbox`);
  if (config?.msgs_per_day != null) lines.push(`${config.msgs_per_day} messages/day`);
  if (config?.webmail) lines.push("SOGo / webmail included");
  if (config?.driver === "mailcow") lines.push("Mailcow business email stack");
  return lines;
}

export function EmailHostingPlans({ className }: { className?: string }) {
  const { formatPrice } = useCurrency();
  const [billing, setBilling] = useState<Billing>("monthly");
  const [plans, setPlans] = useState<PlatformService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [domainMode, setDomainMode] = useState<DomainMode>("existing");
  const [domainInput, setDomainInput] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");
      try {
        let res = await fetch("/api/billing/services?type=email_hosting", {
          signal: controller.signal,
        });
        let data = await res.json().catch(() => ({}));
        let services = (data.services as PlatformService[] | undefined) ?? [];

        if (!res.ok) {
          throw new Error(data.error || "Failed to load email plans");
        }

        if (services.length === 0) {
          res = await fetch("/api/billing/services", { signal: controller.signal });
          data = await res.json().catch(() => ({}));
          if (!res.ok || !data.services) {
            throw new Error(data.error || "Failed to load email plans");
          }
          services = (data.services as PlatformService[]).filter(isEmailHostingPlan);
        } else {
          services = services.filter(isEmailHostingPlan);
        }

        if (cancelled) return;
        setPlans(services);
        setSelectedId(services[0]?.id ?? null);
      } catch (e) {
        if (cancelled || (e instanceof DOMException && e.name === "AbortError")) return;
        setError(e instanceof Error ? e.message : "Failed to load email plans");
        setPlans([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const domain = useMemo(() => normalizeDomain(domainInput), [domainInput]);
  const domainValid = isLikelyDomain(domain);
  const selected = plans.find((p) => p.id === selectedId) ?? plans[0] ?? null;
  const cycle = mapBillingCycle(billing);

  const cartItems: CartItem[] | null = useMemo(() => {
    if (!selected || !domainValid) return null;
    if (domainMode === "register") {
      return [
        { type: "domain", full_domain: domain, years: 1 },
        { type: "service", product_id: selected.id, billing_cycle: cycle },
      ];
    }
    return [
      {
        type: "service",
        product_id: selected.id,
        billing_cycle: cycle,
        domain,
      },
    ];
  }, [selected, domainValid, domainMode, domain, cycle]);

  return (
    <section id="plans" className={cn("scroll-mt-28", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <Mail className="h-3.5 w-3.5" />
            Mailcow business email
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Professional email on <span className="gradient-text">your domain</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Live retail plans from Talksasa Cloud. Pair with a new domain registration or attach
            email to a domain you already own — MX, SPF, DKIM and DMARC helpers after payment.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {(["monthly", "annual"] as Billing[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setBilling(option)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium border transition-colors",
                billing === option
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {option === "monthly" ? "Monthly" : "Annual"}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-16 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400 text-center max-w-xl mx-auto">
            {error}
          </div>
        )}

        {!loading && !error && plans.length === 0 && (
          <div className="rounded-xl border border-border bg-muted/10 px-4 py-8 text-center text-muted-foreground max-w-xl mx-auto">
            Email plans are being configured.{" "}
            <a href="/contact" className="text-primary hover:underline">
              Contact sales
            </a>{" "}
            for business email setup.
          </div>
        )}

        {!loading && plans.length > 0 && (
          <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
            <div className="grid sm:grid-cols-2 gap-4">
              {plans.map((plan, index) => {
                const price =
                  billing === "annual" && plan.yearly_price != null
                    ? plan.yearly_price
                    : plan.monthly_price;
                const features =
                  plan.features && plan.features.length > 0
                    ? plan.features
                    : planLimitLines(plan);
                const limits = planLimitLines(plan);
                const active = selected?.id === plan.id;

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedId(plan.id)}
                    className={cn(
                      "text-left rounded-2xl border p-6 transition-all",
                      active
                        ? "border-primary/50 bg-primary/5 shadow-glow-sm"
                        : "border-border bg-muted/10 hover:border-primary/30",
                      index === 0 && plans.length === 1 && "sm:col-span-2"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                      {active && (
                        <span className="text-[10px] uppercase tracking-wide text-primary font-medium">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-foreground">
                        {formatPrice(price, 0)}
                      </span>
                      <span className="text-muted-foreground">
                        /{billing === "annual" && plan.yearly_price != null ? "yr" : "mo"}
                      </span>
                    </div>
                    {plan.setup_fee > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        + {formatPrice(plan.setup_fee, 0)} setup
                      </p>
                    )}
                    <ul className="mt-5 space-y-2">
                      {[...limits, ...features]
                        .filter((v, i, arr) => arr.indexOf(v) === i)
                        .slice(0, 8)
                        .map((line) => (
                          <li
                            key={line}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            {line}
                          </li>
                        ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-border bg-muted/10 p-6 sticky top-28 space-y-4">
              <h3 className="font-semibold text-foreground">Attach a domain</h3>
              <p className="text-sm text-muted-foreground">
                Business email needs a domain. Register one now or use a domain you already own.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={domainMode === "existing" ? "default" : "outline"}
                  onClick={() => setDomainMode("existing")}
                >
                  I have a domain
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={domainMode === "register" ? "default" : "outline"}
                  onClick={() => setDomainMode("register")}
                >
                  Register new
                </Button>
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  {domainMode === "register" ? "Domain to register" : "Existing domain"}
                </span>
                <input
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="acme.co.ke"
                  className="w-full rounded-lg bg-background border border-border px-3 py-2.5 text-sm"
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>

              {domainInput && !domainValid && (
                <p className="text-xs text-amber-400">Enter a valid domain like acme.co.ke</p>
              )}

              {domainMode === "register" && (
                <p className="text-xs text-muted-foreground">
                  Domain registration (1 year) is added to the same cart so DNS records can be
                  applied automatically after payment.
                </p>
              )}

              {cartItems ? (
                <CheckoutButton
                  items={cartItems}
                  label={
                    domainMode === "register"
                      ? "Register domain + order email"
                      : "Order email hosting"
                  }
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 border-0"
                  trackId="email_hosting_checkout"
                />
              ) : (
                <Button type="button" className="w-full" disabled>
                  Enter a domain to continue
                </Button>
              )}

              <p className="text-[11px] text-muted-foreground text-center">
                Checkout continues on Talksasa Cloud with M-Pesa and other payment methods.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

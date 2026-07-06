"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/currency-provider";
import { BULK_SMS_URL } from "@/lib/urls";
import { TrackedExternalLink } from "@/components/tracked-link";
import {
  SMS_RESELLER_TIERS,
  calculateResellerSms,
  type SmsResellerTier,
} from "@/lib/sms-reseller-tiers";

type SmsResellerWholesaleProps = {
  id?: string;
  className?: string;
  compact?: boolean;
};

export function SmsResellerWholesale({
  id = "wholesale-tiers",
  className,
  compact = false,
}: SmsResellerWholesaleProps) {
  const { formatPrice } = useCurrency();
  const [amount, setAmount] = useState(500);
  const [selectedTierId, setSelectedTierId] = useState<string>("starter");

  const result = calculateResellerSms(amount);

  function selectTier(tier: SmsResellerTier) {
    setSelectedTierId(tier.id);
    setAmount(tier.minAmount);
  }

  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <div className={cn(compact ? "" : "container mx-auto px-4 sm:px-6 lg:px-8 py-16")}>
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className={cn("font-bold tracking-tight", compact ? "text-xl" : "text-2xl sm:text-3xl")}>
            Wholesale tiers
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Click on any tier row to auto-fill the minimum amount
          </p>
        </div>

        <div className="max-w-3xl mx-auto rounded-2xl border border-border glass overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_1.2fr_0.8fr] gap-4 px-5 py-3 bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b border-border">
            <span>Tier</span>
            <span>Top-up range</span>
            <span className="text-right">Rate</span>
          </div>

          <div className="divide-y divide-border">
            {SMS_RESELLER_TIERS.map((tier) => {
              const active = selectedTierId === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => selectTier(tier)}
                  className={cn(
                    "w-full text-left px-5 py-4 transition-colors grid grid-cols-1 sm:grid-cols-[1fr_1.2fr_0.8fr] gap-2 sm:gap-4 items-center",
                    active ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-muted/20"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      )}
                    >
                      {tier.name}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground sm:text-foreground">{tier.rangeLabel}</span>
                  <span className="text-sm font-semibold text-foreground sm:text-right">
                    {tier.rate.toFixed(4)}
                    <span className="text-muted-foreground font-normal"> / SMS</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto mt-6 rounded-2xl border border-border glass p-6"
        >
          <label htmlFor="reseller-topup-amount" className="block text-sm font-medium mb-2">
            Top-up amount (KES)
          </label>
          <input
            id="reseller-topup-amount"
            type="number"
            min={500}
            max={100000}
            step={1}
            value={amount}
            onChange={(e) => {
              const val = Number(e.target.value);
              setAmount(Number.isFinite(val) ? val : 0);
              const tier = calculateResellerSms(val).tier;
              if (tier) setSelectedTierId(tier.id);
            }}
            className="w-full rounded-lg bg-background/50 border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <div className="mt-5 rounded-xl bg-primary/10 border border-primary/20 p-4 text-center">
            {result.tier ? (
              <>
                <div className="text-sm text-muted-foreground mb-1">
                  {result.tier.name} tier · {formatPrice(result.rate, 4)} per SMS
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {result.smsCount.toLocaleString()} SMS
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatPrice(result.rate * 1000, 2)} per 1,000 SMS at wholesale
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Minimum wholesale top-up is KES 500 (Starter tier)
              </p>
            )}
          </div>

          <Button asChild className="w-full mt-5 bg-gradient-to-r from-indigo-500 to-purple-600 border-0">
            <TrackedExternalLink href={BULK_SMS_URL} trackId="sms_reseller_wholesale_cta">
              <span className="inline-flex items-center justify-center gap-2 w-full">
                <MessageSquare className="h-4 w-4" />
                Open reseller portal
                <ArrowRight className="h-4 w-4" />
              </span>
            </TrackedExternalLink>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

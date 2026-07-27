"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/currency-provider";
import { CurrencySelector } from "@/components/currency-selector";
import { CloudPricing } from "@/components/cloud-pricing";
import { EmailHostingPlans } from "@/components/email-hosting/email-hosting-plans";
import { ResellerPricing } from "@/components/reseller/reseller-pricing";
import { BULK_SMS_URL } from "@/lib/urls";
import { BulkSmsPlanButton } from "@/components/tracked-link";
import { SMSCalculator } from "@/components/sms-calculator";
import { isCloudProductTab, isPricingProduct, type PricingProduct } from "@/lib/pricing-links";
import type { CloudProductTab } from "@/lib/billing-types";

type Product = PricingProduct;

type Plan = {
  name: string;
  priceMonthly: number;
  unit?: string;
  subtitle?: string;
  description?: string;
  features: string[];
  cta: string;
  href: string;
  featured: boolean;
};

const bulkSmsPlans: Plan[] = [
  {
    name: "TIER 1",
    priceMonthly: 0.35,
    unit: "Top up KES 1 - 10,000",
    subtitle: "Small Businesses",
    description: "Perfect for local shops, restaurants, and service providers",
    features: [
      "Basic delivery reports",
      "Unlimited contacts management",
      "Free generic sender ID on signup",
      "Email support",
      "Standard delivery speed",
      "Kenya coverage",
      "SMS credits never expire",
      "Free API access",
    ],
    cta: "Get Started",
    href: BULK_SMS_URL,
    featured: true,
  },
  {
    name: "TIER 2",
    priceMonthly: 0.3,
    unit: "Top up KES 10,001 - 30,000",
    subtitle: "Medium Businesses",
    description: "Ideal for growing companies and e-commerce businesses",
    features: [
      "Advanced analytics dashboard",
      "Unlimited contacts management",
      "Free generic sender ID on signup",
      "Priority phone support",
      "Scheduled messaging",
      "API integration",
      "WhatsApp Business integration",
      "SMS credits never expire",
    ],
    cta: "Get Started",
    href: BULK_SMS_URL,
    featured: false,
  },
  {
    name: "TIER 3",
    priceMonthly: 0.25,
    unit: "Top up KES 30,001+",
    subtitle: "Large Organizations",
    description: "For corporations, banks, and high-volume senders",
    features: [
      "Real-time delivery tracking",
      "Unlimited contacts management",
      "Free generic sender ID on signup",
      "Dedicated account manager",
      "Premium delivery routes",
      "Advanced API & webhooks",
      "Multi-user accounts",
      "Custom integrations",
      "SLA guarantee (99.9% uptime)",
    ],
    cta: "Get Started",
    href: BULK_SMS_URL,
    featured: false,
  },
];

const productLabels: Record<Product, string> = {
  "bulk-sms": "Bulk SMS",
  cloud: "Talksasa Cloud",
  "email-hosting": "Email Hosting",
  "reseller-hosting": "Reseller Hosting",
};

function parseProductFromParams(params: URLSearchParams): Product {
  const value = params.get("product");
  return isPricingProduct(value) ? value : "cloud";
}

function parseCloudTabFromParams(params: URLSearchParams): CloudProductTab {
  const value = params.get("tab");
  return isCloudProductTab(value) ? value : "hosting";
}

function PricingFallback() {
  return (
    <section id="pricing" className="section-py relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Loading pricing" />
      </div>
    </section>
  );
}

export function Pricing() {
  return (
    <Suspense fallback={<PricingFallback />}>
      <PricingContent />
    </Suspense>
  );
}

function PricingContent() {
  const searchParams = useSearchParams();
  const { formatPrice } = useCurrency();
  const [product, setProduct] = useState<Product>(() => parseProductFromParams(searchParams));
  const cloudTab = parseCloudTabFromParams(searchParams);

  useEffect(() => {
    setProduct(parseProductFromParams(searchParams));
  }, [searchParams]);

  useEffect(() => {
    if (!searchParams.has("product") && !searchParams.has("tab")) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [searchParams]);

  const formatSenderIdPrice = (price: number) => formatPrice(price, 0);

  return (
    <section id="pricing" className="section-py relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-6"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Currency:</span>
            <CurrencySelector />
          </div>
        </motion.div>

        <motion.div
          role="tablist"
          aria-label="Pricing products"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {(Object.keys(productLabels) as Product[]).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={product === key}
              aria-label={`View ${productLabels[key]} pricing`}
              onClick={() => setProduct(key)}
              className={cn(
                "relative rounded-full px-4 sm:px-5 py-2.5 min-h-[44px] text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                product === key
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {product === key && (
                <motion.span
                  layoutId="product-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">{productLabels[key]}</span>
            </button>
          ))}
        </motion.div>

        {product === "cloud" ? (
          <CloudPricing key={cloudTab} defaultTab={cloudTab} />
        ) : product === "email-hosting" ? (
          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
              Professional Mailcow email on your domain. Register a new domain with your plan or
              attach email to a domain you already own.
            </p>
            <EmailHostingPlans />
          </div>
        ) : product === "reseller-hosting" ? (
          <ResellerPricing compactHeader embedded />
        ) : (
          <>
            <div className="mb-12">
              <SMSCalculator />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto items-stretch">
              <AnimatePresence initial={false}>
                {bulkSmsPlans.map((plan, i) => (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    className={cn(
                      "relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 flex flex-col",
                      plan.featured
                        ? "glass gradient-border shadow-glow-sm 2xl:scale-105 z-10"
                        : "glass border-border hover:border-primary/20"
                    )}
                  >
                    {plan.featured && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1 text-xs font-medium text-white">
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                    {plan.unit && <p className="mt-1 text-sm text-muted-foreground">{plan.unit}</p>}
                    <div className="mt-6 flex items-baseline gap-1 flex-wrap">
                      <span className="text-2xl sm:text-3xl font-bold text-foreground">
                        {formatPrice(plan.priceMonthly, 2)}
                      </span>
                      <span className="text-muted-foreground">/SMS</span>
                    </div>
                    <ul className="mt-6 space-y-3 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-primary shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <BulkSmsPlanButton
                      href={plan.href}
                      trackId={`bulk_sms_pricing_${plan.name.replace(/\s+/g, "_").toLowerCase()}`}
                      variant={plan.featured ? "default" : "outline"}
                      className={plan.featured ? "bg-gradient-to-r from-indigo-500 to-purple-600 border-0 hover:opacity-90" : undefined}
                    >
                      {plan.cta}
                    </BulkSmsPlanButton>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">Sender ID Registration</h3>
                <p className="text-sm text-muted-foreground">
                  One-time registration fee for custom sender ID on each network
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {[
                  { network: "Safaricom", price: 6950 },
                  { network: "Airtel", price: 7500 },
                  { network: "Telkom", price: 7300 },
                ].map((item) => (
                  <motion.div
                    key={item.network}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="rounded-xl glass border border-border p-5 text-center"
                  >
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Smartphone className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-foreground">{item.network}</h4>
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {formatSenderIdPrice(item.price)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      One-time registration fee for {item.network} network
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          Need custom solutions?{" "}
          <Link href="/contact" className="text-primary hover:underline font-medium">
            Contact our sales team
          </Link>
          {" · "}
          <Link href="/domains" className="text-primary hover:underline font-medium">
            Search domains
          </Link>
          {" · "}
          <Link href="/reseller-hosting" className="text-primary hover:underline font-medium">
            Reseller hosting
          </Link>
        </motion.p>
      </div>
    </section>
  );
}

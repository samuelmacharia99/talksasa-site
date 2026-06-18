"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/currency-provider";
import { CurrencySelector } from "@/components/currency-selector";

type Billing = "monthly" | "annual";
type Product = "bulk-sms" | "hosting" | "vps" | "dedicated";

type Plan = {
  name: string;
  priceMonthly: number | null; // null = custom
  priceAnnual: number | null;
  unit?: string; // e.g. "SMS/month"
  subtitle?: string;
  description?: string;
  features: string[];
  cta: string;
  href: string;
  featured: boolean;
};

const productPlans: Record<Product, Plan[]> = {
  "bulk-sms": [
    {
      name: "TIER 1",
      priceMonthly: 0.35,
      priceAnnual: 0.35,
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
      href: "https://bulksms.talksasa.com",
      featured: true,
    },
    {
      name: "TIER 2",
      priceMonthly: 0.30,
      priceAnnual: 0.30,
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
      href: "https://bulksms.talksasa.com",
      featured: false,
    },
    {
      name: "TIER 3",
      priceMonthly: 0.25,
      priceAnnual: 0.25,
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
      href: "https://bulksms.talksasa.com",
      featured: false,
    },
  ],
  hosting: [
    {
      name: "Bronze",
      priceMonthly: 430,
      priceAnnual: 430 * 11, // Pay for 11 months, get 1 free - total annual
      unit: "35GB NVMe SSD, 2GB RAM",
      subtitle: "Suitable for Starters",
      description: "Perfect for small websites and beginners",
      features: [
        "35GB NVMe SSD Disk Space",
        "2GB RAM",
        "Host 3 Websites",
        "FREE Site Building Tools",
        "SEO-Friendly Hosting",
        "Unlimited Email Accounts",
        "Unlimited Monthly Bandwidth",
        "FREE SSL Certificate",
        "FREE Site Transfer",
        "30 Mins DIY Website Builder",
        "1000+ Website Templates",
        "One-click Script Installer (Softaculous)",
        "WordPress, Joomla, etc Supported",
        "LiteSpeed Web Server",
        "FREE Premium SMTP Relay (MailChannels)",
        "FREE WordPress LiteSpeed Cache",
        "Direct admin panel",
        "Latest PHP Versions",
        "No Hidden Charges",
      ],
      cta: "Order Now",
      href: "https://servers.talksasa.com",
      featured: false,
    },
    {
      name: "Silver",
      priceMonthly: 999,
      priceAnnual: 999 * 11, // Pay for 11 months, get 1 free - total annual
      unit: "60GB NVMe SSD, 4GB RAM",
      subtitle: "Suitable for Ecommerce Sites",
      description: "Ideal for growing online stores",
      features: [
        "60GB NVMe SSD Disk Space",
        "4GB RAM",
        "Host Unlimited Websites",
        "FREE Site Building Tools",
        "SEO-Friendly Hosting",
        "Unlimited Email Accounts",
        "Unlimited Monthly Bandwidth",
        "FREE SSL Certificate",
        "FREE Site Transfer",
        "30 Mins DIY Website Builder",
        "1000+ Website Templates",
        "One-click Script Installer (Softaculous)",
        "WordPress, Joomla, etc Supported",
        "LiteSpeed Web Server",
        "FREE Premium SMTP Relay (MailChannels)",
        "FREE WordPress LiteSpeed Cache",
        "FREE cPanel",
        "PHP 7.4, 8.0, 8.1",
        "No Hidden Charges",
      ],
      cta: "Order Now",
      href: "https://servers.talksasa.com",
      featured: true,
    },
    {
      name: "Gold",
      priceMonthly: 1300,
      priceAnnual: 1300 * 11, // Pay for 11 months, get 1 free - total annual
      unit: "100GB NVMe SSD, 8GB RAM",
      subtitle: "Suitable for very Busy Websites",
      description: "For high-traffic websites and businesses",
      features: [
        "100GB NVMe SSD Disk Space",
        "8GB RAM",
        "Host 60 Websites",
        "FREE Lifetime Domain (.com, .co.ke, .org, .net, .africa)",
        "FREE Site Building Tools",
        "SEO-Friendly Hosting",
        "Unlimited Email Accounts",
        "Unlimited Monthly Bandwidth",
        "FREE SSL Certificate",
        "FREE Site Transfer",
        "30 Mins DIY Website Builder",
        "1000+ Website Templates",
        "One-click Script Installer (Softaculous)",
        "WordPress, Joomla, etc Supported",
        "LiteSpeed Web Server",
        "FREE Premium SMTP Relay (MailChannels)",
        "FREE WordPress LiteSpeed Cache",
        "FREE cPanel",
        "Latest PHP Versions",
        "No Hidden Charges",
      ],
      cta: "Order Now",
      href: "https://servers.talksasa.com",
      featured: false,
    },
    {
      name: "Platinum",
      priceMonthly: 1469,
      priceAnnual: 1469 * 11, // Pay for 11 months, get 1 free - total annual
      unit: "200GB NVMe SSD, 16GB RAM",
      subtitle: "Suitable for Ecommerce Sites",
      description: "Premium hosting for large online stores",
      features: [
        "200GB NVMe SSD Disk Space",
        "16GB RAM",
        "Host Unlimited Websites",
        "FREE Lifetime Domain (.com, .co.ke, .org, .net) on annual payment",
        "FREE Site Building Tools",
        "SEO-Friendly Hosting",
        "Unlimited Email Accounts",
        "Unlimited Monthly Bandwidth",
        "FREE SSL Certificate",
        "FREE Site Transfer",
        "30 Mins DIY Website Builder",
        "1000+ Website Templates",
        "One-click Script Installer (Softaculous)",
        "WordPress, Joomla, etc Supported",
        "LiteSpeed Web Server",
        "FREE Premium SMTP Relay (MailChannels)",
        "FREE WordPress LiteSpeed Cache",
        "FREE cPanel",
        "PHP 7.4, 8.0, 8.1",
      ],
      cta: "Order Now",
      href: "https://servers.talksasa.com",
      featured: false,
    },
    {
      name: "Alpha",
      priceMonthly: 1899,
      priceAnnual: 1899 * 11, // Pay for 11 months, get 1 free - total annual
      unit: "300GB NVMe SSD, 16GB RAM",
      subtitle: "Suitable for Ecommerce Sites",
      description: "Advanced hosting for demanding websites",
      features: [
        "300GB NVMe SSD Disk Space",
        "16GB RAM",
        "Host Unlimited Websites",
        "FREE Lifetime Domain (.com, .co.ke, .org, .net) on annual payment",
        "FREE Site Building Tools",
        "SEO-Friendly Hosting",
        "Unlimited Email Accounts",
        "Unlimited Monthly Bandwidth",
        "FREE SSL Certificate",
        "FREE Site Transfer",
        "30 Mins DIY Website Builder",
        "1000+ Website Templates",
        "One-click Script Installer (Softaculous)",
        "WordPress, Joomla, etc Supported",
        "LiteSpeed Web Server",
        "FREE Premium SMTP Relay (MailChannels)",
        "FREE WordPress LiteSpeed Cache",
        "FREE cPanel",
        "PHP 7.4, 8.0, 8.1",
        "No Hidden Charges",
      ],
      cta: "Order Now",
      href: "https://servers.talksasa.com",
      featured: false,
    },
    {
      name: "Enterprise",
      priceMonthly: null,
      priceAnnual: null,
      unit: "400GB NVMe SSD, 16GB RAM",
      subtitle: "Suitable for Ecommerce Sites",
      description: "Maximum performance for enterprise needs",
      features: [
        "400GB NVMe SSD Disk Space",
        "16GB RAM",
        "Host Unlimited Websites",
        "FREE Lifetime Domain (.com, .co.ke, .org, .net) on annual payment",
        "FREE Site Building Tools",
        "SEO-Friendly Hosting",
        "Unlimited Email Accounts",
        "Unlimited Monthly Bandwidth",
        "FREE SSL Certificate",
        "FREE Site Transfer",
        "30 Mins DIY Website Builder",
        "1000+ Website Templates",
        "One-click Script Installer (Softaculous)",
        "WordPress, Joomla, etc Supported",
        "LiteSpeed Web Server",
        "FREE Premium SMTP Relay (MailChannels)",
        "FREE WordPress LiteSpeed Cache",
        "FREE cPanel",
        "PHP 7.4, 8.0, 8.1",
        "No Hidden Charges",
      ],
      cta: "Contact Sales",
      href: "https://servers.talksasa.com",
      featured: false,
    },
  ],
  vps: [
    {
      name: "Starter Cloud VPS",
      priceMonthly: 3800,
      priceAnnual: 3800 * 11, // Pay for 11 months, get 1 free - total annual
      unit: "40GB NVMe Storage, 1GB RAM, 2 CPU Cores",
      subtitle: "Perfect for small websites and applications",
      description: "Ideal for getting started with cloud hosting",
      features: [
        "40GB NVMe Storage",
        "Cloud Linux OS",
        "Immunify 360",
        "1 GB Dedicated RAM",
        "2 CPU Cores",
        "1 TB Outgoing Bandwidth",
        "Dedicated IP",
        "Fully Managed Hosting",
        "30-Day Money-Back",
      ],
      cta: "Order Now",
      href: "https://servers.talksasa.com",
      featured: false,
    },
    {
      name: "Plus Cloud VPS",
      priceMonthly: 5800,
      priceAnnual: 5800 * 11, // Pay for 11 months, get 1 free - total annual
      unit: "80GB NVMe Storage, 4GB RAM, 4 CPU Cores",
      subtitle: "Great for growing businesses",
      description: "More power for your applications",
      features: [
        "80GB NVMe Storage",
        "Cloud Linux OS",
        "Immunify 360",
        "4 GB Dedicated RAM",
        "4 CPU Cores",
        "10 TB Outgoing Bandwidth",
        "Dedicated IP",
        "Fully Managed Hosting",
        "30-Day Money-Back",
      ],
      cta: "Order Now",
      href: "https://servers.talksasa.com",
      featured: true,
    },
    {
      name: "Turbo Cloud VPS",
      priceMonthly: 9800,
      priceAnnual: 9800 * 11, // Pay for 11 months, get 1 free - total annual
      unit: "160GB NVMe Storage, 6GB RAM, 6 CPU Cores",
      subtitle: "High-performance hosting",
      description: "For demanding applications and websites",
      features: [
        "160GB NVMe Storage",
        "Cloud Linux OS",
        "Immunify 360",
        "6 GB Dedicated RAM",
        "6 CPU Cores",
        "10 TB Outgoing Bandwidth",
        "Dedicated IP",
        "Fully Managed Hosting",
        "30-Day Money-Back",
      ],
      cta: "Order Now",
      href: "https://servers.talksasa.com",
      featured: false,
    },
    {
      name: "Business Cloud VPS",
      priceMonthly: 16800,
      priceAnnual: 16800 * 11, // Pay for 11 months, get 1 free - total annual
      unit: "320GB NVMe Storage, 8GB RAM, 8 CPU Cores",
      subtitle: "Enterprise-grade performance",
      description: "Maximum resources for large businesses",
      features: [
        "320GB NVMe Storage",
        "Cloud Linux OS",
        "Immunify 360",
        "8 GB Dedicated RAM",
        "8 CPU Cores",
        "10 TB Outgoing Bandwidth",
        "Dedicated IP",
        "Fully Managed Hosting",
        "30-Day Money-Back",
      ],
      cta: "Order Now",
      href: "https://servers.talksasa.com",
      featured: false,
    },
  ],
  dedicated: [
    {
      name: "Intel Core i7-6700",
      priceMonthly: 7500,
      priceAnnual: 7500,
      unit: "64 GB RAM, 2 x 250 GB SSD Storage",
      features: [
        "64 GB of RAM",
        "Unlimited bandwidth",
        "2 x 250 GB SSD Storage",
        "Free domain",
        "NIC 1 Gbit - Intel I219-LM",
        "Replacement of defective hardware",
        "Easy feedback sharing",
        "Free email support",
        "Free Phone Support",
      ],
      cta: "Order Now",
      href: "https://servers.talksasa.com",
      featured: false,
    },
    {
      name: "AMD Ryzen 5 3600",
      priceMonthly: 8600,
      priceAnnual: 8600,
      unit: "64 GB RAM, 2 x 512 GB SSD Storage",
      features: [
        "64 GB RAM",
        "Unlimited bandwidth",
        "Full backup systems",
        "Free domain",
        "2 x 512 GB SSD Storage",
        "Fast NVMe Storage",
        "NIC 1 Gbit - Intel I219-LM",
        "Replacement of defective hardware",
        "Easy feedback sharing",
        "Free email support",
        "Free Phone Support",
      ],
      cta: "Order Now",
      href: "https://servers.talksasa.com",
      featured: true,
    },
    {
      name: "Intel Xeon-E3-1275V6",
      priceMonthly: 8700,
      priceAnnual: 8700,
      unit: "64 GB RAM, 2 x 512 GB SSD Storage",
      features: [
        "64 GB RAM",
        "Unlimited bandwidth",
        "2 x 512 GB SSD Storage",
        "Free domain",
        "NIC 1 Gbit - Intel I219-LM",
        "Fast NVMe Storage",
        "Replacement of defective hardware",
        "Easy feedback sharing",
        "Free email support",
        "Free Phone Support",
      ],
      cta: "Order Now",
      href: "https://servers.talksasa.com",
      featured: false,
    },
  ],
};

const productLabels: Record<Product, string> = {
  "bulk-sms": "Bulk SMS",
  hosting: "Hosting",
  vps: "VPS",
  dedicated: "Dedicated Servers",
};

function PriceDisplay({
  plan,
  billing,
  product,
}: {
  plan: Plan;
  billing: Billing;
  product: Product;
}) {
  const { formatPrice } = useCurrency();
  const price = billing === "annual" ? plan.priceAnnual : plan.priceMonthly;
  
  if (price === null) {
    return (
      <div className="flex items-baseline gap-1">
        <span className="text-2xl sm:text-3xl font-bold text-foreground">Custom</span>
      </div>
    );
  }
  
  // For Bulk SMS, show per-SMS pricing (2 decimals)
  if (plan.name.startsWith("TIER")) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-1 flex-wrap">
          <span className="text-2xl sm:text-3xl font-bold text-foreground">{formatPrice(price, 2)}</span>
          <span className="text-muted-foreground">/SMS</span>
        </div>
      </div>
    );
  }
  
  // For Dedicated Servers, show pricing with "From"
  if (plan.name.includes("Intel") || plan.name.includes("AMD") || plan.name.includes("Xeon")) {
    return (
      <div className="flex items-baseline gap-1 flex-wrap">
        <span className="text-sm text-muted-foreground">From</span>
        <span className="text-2xl sm:text-3xl font-bold text-foreground">{formatPrice(price, 0)}</span>
        <span className="text-muted-foreground">/mo</span>
      </div>
    );
  }
  
  // All other products (Hosting, VPS) - show pricing
  // For annual billing on hosting and VPS, show total annual price with /yr
  if (billing === "annual" && (product === "hosting" || product === "vps") && plan.priceMonthly !== null) {
    return (
      <div className="flex items-baseline gap-1 flex-wrap">
        <span className="text-sm text-muted-foreground">From</span>
        <span className="text-2xl sm:text-3xl font-bold text-foreground">{formatPrice(price, 0)}</span>
        <span className="text-muted-foreground">/yr</span>
      </div>
    );
  }
  
  // For VPS monthly, show "From" prefix
  if (product === "vps" && plan.priceMonthly !== null) {
    return (
      <div className="flex items-baseline gap-1 flex-wrap">
        <span className="text-sm text-muted-foreground">From</span>
        <span className="text-2xl sm:text-3xl font-bold text-foreground">{formatPrice(price, 0)}</span>
        <span className="text-muted-foreground">/mo</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-baseline gap-1 flex-wrap">
      <span className="text-2xl sm:text-3xl font-bold text-foreground">{formatPrice(price, 0)}</span>
      <span className="text-muted-foreground">/mo</span>
      {billing === "annual" && plan.priceMonthly !== null && (
        <span className="ml-2 text-xs text-primary font-medium">Save 20%</span>
      )}
    </div>
  );
}

export function Pricing() {
  const { formatPrice } = useCurrency();
  const [product, setProduct] = useState<Product>("bulk-sms");
  const [billing, setBilling] = useState<Billing>("monthly");

  const plans = productPlans[product];

  // Helper function to format sender ID prices
  const formatSenderIdPrice = (price: number) => formatPrice(price, 0);

  return (
    <section id="pricing" className="section-py relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Currency selector - show at top of pricing section */}
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

        {/* Product toggle */}
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

        {/* Annual billing toggle - hide for Bulk SMS and Dedicated Servers, show for Hosting and VPS */}
        {product !== "bulk-sms" && product !== "dedicated" && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-3 mb-10"
          >
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
                "relative w-12 h-7 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
            <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded">
              Save 20%
            </span>
          </motion.div>
        )}

        {/* Pricing cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto items-stretch">
          <AnimatePresence initial={false}>
            {plans.map((plan, i) => (
              <motion.div
                key={`${product}-${plan.name}`}
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
                {plan.unit && (
                  <p className="mt-1 text-sm text-muted-foreground">{plan.unit}</p>
                )}
                <div className="mt-6">
                  <PriceDisplay plan={plan} billing={billing} product={product} />
                </div>
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  size="default"
                  variant={plan.featured ? "default" : "outline"}
                  className={cn(
                    "mt-8 w-full",
                    plan.featured && "bg-gradient-to-r from-indigo-500 to-purple-600 border-0 hover:opacity-90"
                  )}
                >
                  {plan.href.startsWith("http") ? (
                    <a href={plan.href} target="_blank" rel="noopener noreferrer">{plan.cta}</a>
                  ) : (
                    <Link href={plan.href}>{plan.cta}</Link>
                  )}
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Sender ID Pricing - Only show for Bulk SMS */}
        {product === "bulk-sms" && (
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
        )}

        {/* Bottom CTA */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          Need custom solutions?{" "}
          <Link href="#contact" className="text-primary hover:underline font-medium">
            Contact our sales team
          </Link>
        </motion.p>
      </div>
    </section>
  );
}

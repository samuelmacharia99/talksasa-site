"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Cloud, Mail, MessageSquare } from "lucide-react";
import { pricingUrl } from "@/lib/pricing-links";

const pillars = [
  {
    id: "sms",
    icon: MessageSquare,
    brand: "Talksasa SMS",
    pitch: "Reliable gateway for marketing campaigns, alerts, and OTP/API traffic across East Africa.",
    bullets: [
      "Portal and REST API",
      "Sender ID registration",
      "Delivery reports & M-Pesa top-up",
    ],
    href: "/bulk-sms",
    secondaryHref: pricingUrl({ product: "bulk-sms" }),
    secondaryLabel: "SMS pricing",
    cta: "Explore Bulk SMS",
  },
  {
    id: "mail",
    icon: Mail,
    brand: "Talksasa Mail",
    pitch: "Professional business email on your domain — webmail, mailboxes, and DNS helpers.",
    bullets: [
      "you@yourcompany branding",
      "Aliases and mailbox quotas",
      "DKIM / SPF helpers at checkout",
    ],
    href: "/email-hosting",
    secondaryHref: pricingUrl({ product: "email-hosting" }),
    secondaryLabel: "Mail pricing",
    cta: "Get business email",
  },
  {
    id: "cloud",
    icon: Cloud,
    brand: "Talksasa Cloud",
    pitch: "Application hosting, VPS, dedicated servers, and white-label reseller — with M-Pesa billing.",
    bullets: [
      "Laravel, Node.js & containers",
      "VPS and dedicated servers",
      "Reseller platform under your brand",
    ],
    href: "/cloud-hosting",
    secondaryHref: pricingUrl({ product: "cloud", tab: "cloud" }),
    secondaryLabel: "Cloud pricing",
    cta: "Explore Cloud",
  },
] as const;

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function BrandPillars() {
  return (
    <section id="brands" className="section-py relative scroll-mt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(99,102,241,0.08),transparent_60%)] pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            Three brands. <span className="gradient-text">One partner.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            Choose Talksasa SMS, Talksasa Mail, or Talksasa Cloud — or combine them under one local
            billing relationship.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.article
                key={pillar.id}
                variants={item}
                className="flex flex-col rounded-2xl glass border border-border p-6 sm:p-8 hover:border-primary/30 transition-colors"
              >
                <div className="rounded-xl bg-primary/10 w-fit p-3 text-primary">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-foreground">{pillar.brand}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                  {pillar.pitch}
                </p>
                <ul className="mt-5 space-y-2">
                  {pillar.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    href={pillar.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/90 transition-colors"
                  >
                    {pillar.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link
                    href={pillar.secondaryHref}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {pillar.secondaryLabel} →
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import Link from "next/link";
import Script from "next/script";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CreditCard,
  Globe,
  RefreshCw,
  Search,
  Server,
  Shield,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { DomainSearchPanel } from "@/components/domains/domain-search-panel";
import { DomainTldGrid } from "@/components/domains/domain-tld-grid";
import { PRODUCT_PAGES, faqJsonLd } from "@/lib/cloud-content";
import { SITE_URL } from "@/lib/urls";

const page = PRODUCT_PAGES.domains;

const TRUST_PILLS = [
  "11,000+ domains managed",
  "M-Pesa checkout",
  "Free DNS management",
  "Renewal reminders",
];

const WHY_ITEMS = [
  {
    icon: Globe,
    title: "Local & global TLDs",
    text: ".co.ke for Kenyan trust, plus .com, .org, .net, .shop, and more — all in one search.",
  },
  {
    icon: CreditCard,
    title: "Pay your way",
    text: "Checkout with M-Pesa STK push, card, or PayPal. Transparent yearly pricing, no hidden fees.",
  },
  {
    icon: Server,
    title: "Bundle with hosting",
    text: "Register a domain and add web hosting or application hosting in the same order.",
  },
  {
    icon: RefreshCw,
    title: "Transfers welcome",
    text: "Move domains in with your EPP/auth code. Keep DNS and billing under one Talksasa Cloud account.",
  },
];

const STEPS = [
  { step: "1", title: "Search", text: "Type your business name and check live availability across extensions." },
  { step: "2", title: "Register", text: "Add available domains to cart and pay with M-Pesa or card." },
  { step: "3", title: "Go live", text: "Point DNS to hosting, email, or your app — we help if you need it." },
];

const DOMAIN_FAQS = [
  {
    question: "How much does a .co.ke domain cost?",
    answer:
      "Retail .co.ke pricing is shown live on this page from our billing system. Search your name to see the exact price for 1–3 year registration.",
  },
  {
    question: "Can I transfer an existing domain to TalkSasa?",
    answer:
      "Yes. Use your EPP/auth code from your current registrar. Our team can guide you through nameserver updates after transfer.",
  },
  {
    question: "Do I get DNS management?",
    answer:
      "Yes. Manage A, CNAME, MX, and TXT records from your Talksasa Cloud portal after registration.",
  },
  {
    question: "Can I buy a domain without hosting?",
    answer:
      "Absolutely. Register the domain only, or bundle hosting at checkout for a faster launch.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Domains", item: `${SITE_URL}/domains` },
  ],
};

export function DomainsLanding() {
  const searchRef = useRef<HTMLDivElement>(null);

  function scrollToSearch() {
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Script
        id="breadcrumb-domains"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="faq-domains"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(DOMAIN_FAQS)) }}
      />
      <Navbar />

      <main id="main-content">
        {/* Hero — search first */}
        <section className="relative pt-24 pb-16 sm:pb-20 overflow-hidden border-b border-border">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_-10%,rgba(99,102,241,0.22),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_90%_60%,rgba(139,92,246,0.12),transparent_50%)]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium uppercase tracking-wider text-primary"
              >
                Domain registration · Kenya & beyond
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-[1.08]"
              >
                Find your <span className="gradient-text">.co.ke</span> or .com before someone else does
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
              >
                Search live availability, see real retail prices, and register in minutes. DNS, renewals, and M-Pesa billing included.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-8 flex flex-wrap justify-center gap-2"
              >
                {TRUST_PILLS.map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground"
                  >
                    <Check className="h-3.5 w-3.5 text-primary" />
                    {pill}
                  </span>
                ))}
              </motion.div>
            </div>

            <motion.div
              id="domain-search"
              ref={searchRef}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-10 sm:mt-12 max-w-3xl mx-auto scroll-mt-28"
            >
              <div className="rounded-2xl sm:rounded-3xl glass gradient-border border border-primary/20 p-5 sm:p-8 shadow-glow-sm">
                <div className="flex items-center gap-2 mb-5 text-primary">
                  <Search className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wide">Domain search</span>
                </div>
                <DomainSearchPanel prominent />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Live TLD pricing */}
        <section className="section-py border-b border-border bg-muted/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Transparent <span className="gradient-text">domain prices</span>
              </h2>
              <p className="mt-3 text-muted-foreground">
                Live retail rates from Talksasa Cloud — updated from our billing system. Tap an extension to jump to search.
              </p>
            </div>
            <DomainTldGrid onPickTld={() => scrollToSearch()} />
          </div>
        </section>

        {/* Why TalkSasa */}
        <section className="section-py">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Why register with <span className="gradient-text">TalkSasa</span>
              </h2>
              <p className="mt-3 text-muted-foreground">
                Built for Kenyan businesses — with the same portal you use for hosting, apps, and invoices.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {WHY_ITEMS.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl glass border border-border p-6"
                >
                  <div className="rounded-xl bg-primary/10 w-fit p-3 text-primary mb-4">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="section-py border-y border-border bg-muted/15">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              Register in <span className="gradient-text">three steps</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STEPS.map((s) => (
                <div key={s.step} className="text-center md:text-left">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                    {s.step}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features + bundle CTA */}
        <section className="section-py">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Everything included with your domain
                </h2>
                <ul className="mt-8 space-y-4">
                  {page.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm sm:text-base text-muted-foreground">
                      <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl glass gradient-border border border-primary/20 p-8 sm:p-10 text-center lg:text-left">
                <Zap className="h-8 w-8 text-primary mb-4 mx-auto lg:mx-0" />
                <h3 className="text-2xl font-bold">Launch faster with hosting</h3>
                <p className="mt-3 text-muted-foreground text-sm sm:text-base">
                  Pair your new domain with web hosting or application hosting. One checkout, one dashboard, M-Pesa-ready billing.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0"
                    onClick={scrollToSearch}
                  >
                    Search a domain
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/web-hosting">View hosting plans</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-py border-t border-border bg-muted/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-10">Domain FAQs</h2>
            <dl className="space-y-8">
              {DOMAIN_FAQS.map((item) => (
                <div key={item.question}>
                  <dt className="font-semibold text-foreground">{item.question}</dt>
                  <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section-py relative overflow-hidden">
          <div className="absolute inset-0 cta-mesh opacity-80" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl mx-auto">
              Your brand starts with the right domain
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Search now — .co.ke, .com, and more. Available domains can be registered in minutes.
            </p>
            <Button
              size="lg"
              className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 border-0 group"
              onClick={scrollToSearch}
            >
              <span className="flex items-center gap-2">
                Search domains
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

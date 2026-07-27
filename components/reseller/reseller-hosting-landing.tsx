"use client";

import { useRef } from "react";
import Link from "next/link";
import Script from "next/script";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  CreditCard,
  Globe,
  Palette,
  Server,
  Sparkles,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ResellerPricing } from "@/components/reseller/reseller-pricing";
import { PRODUCT_PAGES, faqJsonLd } from "@/lib/cloud-content";
import { SITE_URL } from "@/lib/urls";

const page = PRODUCT_PAGES["reseller-hosting"];

const TRUST_PILLS = [
  "100% white-label portal",
  "Your M-Pesa till",
  "Wholesale domains",
  "Email & app provisioning",
];

const WHY_ITEMS = [
  {
    icon: Palette,
    title: "Your brand, not ours",
    text: "Custom logo, colours, and optional domain with SSL — clients see your company, not Talksasa.",
  },
  {
    icon: CreditCard,
    title: "Your M-Pesa, your revenue",
    text: "Connect your till so customer payments settle to your business. Set retail prices you control.",
  },
  {
    icon: Globe,
    title: "Wholesale domain wallet",
    text: "Resell .co.ke, .com, and hundreds of TLDs with margins you define on every registration.",
  },
  {
    icon: Server,
    title: "Auto-provision cloud products",
    text: "Business email and application hosting provision after payment — no manual server work.",
  },
];

const STEPS = [
  {
    step: "1",
    title: "Pick a plan",
    text: "Choose a reseller platform tier that matches your customer and disk pool needs.",
  },
  {
    step: "2",
    title: "Brand your portal",
    text: "Apply your logo, colours, and domain. Connect M-Pesa and set retail catalog prices.",
  },
  {
    step: "3",
    title: "Onboard clients",
    text: "Create accounts, invoice, provision email and apps, and grow with reports on revenue and margins.",
  },
];

const RESELLER_FAQS = [
  {
    question: "What is included in a reseller hosting plan?",
    answer:
      "Each plan includes a white-label customer portal, limits on customers and active services, a disk pool for email and app accounts, wholesale domain wallet access, and automated provisioning on Talksasa Cloud infrastructure.",
  },
  {
    question: "Can I use my own M-Pesa till?",
    answer:
      "Yes. Resellers connect their own M-Pesa so client payments go directly to their business. Talksasa Cloud handles billing automation and provisioning.",
  },
  {
    question: "Do I need technical skills to run a reseller business?",
    answer:
      "Basic cloud product knowledge helps, but the platform handles provisioning, billing, and customer management. Our team can assist with onboarding.",
  },
  {
    question: "Can I upgrade my reseller plan later?",
    answer:
      "Yes. Start with a smaller tier and move up as your client base grows. Contact our team or upgrade through your reseller dashboard.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Reseller hosting", item: `${SITE_URL}/reseller-hosting` },
  ],
};

export function ResellerHostingLanding() {
  const pricingRef = useRef<HTMLDivElement>(null);

  function scrollToPricing() {
    pricingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Script
        id="breadcrumb-reseller-hosting"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="faq-reseller-hosting"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(RESELLER_FAQS)) }}
      />
      <Navbar />

      <main id="main-content">
        {/* Hero */}
        <section className="relative pt-24 pb-14 sm:pb-18 overflow-hidden border-b border-border">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_-10%,rgba(139,92,246,0.22),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_10%_70%,rgba(99,102,241,0.14),transparent_50%)]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium uppercase tracking-wider text-primary"
              >
                Talksasa Cloud · Reseller hosting
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-[1.08]"
              >
                Run a <span className="gradient-text">hosting company</span> under your brand
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
              >
                {page.subheadline} Live platform plans, tax-inclusive pricing, and online checkout.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3 justify-center"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0 group"
                  onClick={scrollToPricing}
                >
                  <span className="flex items-center gap-2">
                    View reseller plans
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/pricing?product=reseller-hosting">All plans on pricing</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="mt-10 flex flex-wrap justify-center gap-2"
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
          </div>
        </section>

        {/* Live pricing */}
        <div ref={pricingRef}>
          <ResellerPricing />
        </div>

        {/* Why reseller */}
        <section className="section-py">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Built for <span className="gradient-text">agencies & entrepreneurs</span>
              </h2>
              <p className="mt-3 text-muted-foreground">
                Everything you need to sell hosting, domains, and cloud apps — without building software or running data centres.
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
                  className="rounded-2xl glass border border-border p-6 hover:border-primary/25 transition-colors"
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

        {/* Steps */}
        <section className="section-py border-y border-border bg-muted/15">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              Launch in <span className="gradient-text">three steps</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STEPS.map((s) => (
                <div key={s.step} className="text-center md:text-left">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                    {s.step}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform includes */}
        <section className="section-py">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  What&apos;s included in the platform
                </h2>
                <p className="mt-4 text-muted-foreground">
                  {page.intro}
                </p>
                <ul className="mt-8 space-y-4">
                  {page.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm sm:text-base text-muted-foreground">
                      <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl glass gradient-border border border-primary/20 p-8 sm:p-10">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-2xl font-bold">Who is this for?</h3>
                <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    Web designers adding recurring hosting revenue
                  </li>
                  <li className="flex gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    Digital agencies reselling under their brand
                  </li>
                  <li className="flex gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    Entrepreneurs starting a hosting company in Kenya
                  </li>
                </ul>
                <Button
                  size="lg"
                  className="mt-8 w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 border-0"
                  onClick={scrollToPricing}
                >
                  Compare plans
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-py border-t border-border bg-muted/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-10">Reseller hosting FAQs</h2>
            <dl className="space-y-8">
              {RESELLER_FAQS.map((item) => (
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
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl mx-auto">
              Ready to sell hosting under your name?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Pick a plan, checkout online, and start onboarding clients on Talksasa Cloud.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0 group"
                onClick={scrollToPricing}
              >
                <span className="flex items-center gap-2">
                  View plans & checkout
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/book-demo">Book a demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import Script from "next/script";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Pricing } from "@/components/pricing";
import { CTA } from "@/components/cta";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Pricing",
      item: `${SITE_URL}/pricing`,
    },
  ],
};

export const metadata: Metadata = {
  title: "Pricing - Business Email, App Hosting & Bulk SMS in Kenya",
  description:
    "Transparent pricing for business email, application hosting, reseller hosting, domains, and bulk SMS in Kenya & East Africa. Pay with M-Pesa. No hidden fees.",
  keywords: [
    "email hosting prices Kenya",
    "application hosting pricing Kenya",
    "reseller hosting Kenya",
    "bulk SMS pricing Kenya",
    "domain prices Kenya",
    "VPS pricing Kenya",
    "Talksasa Cloud pricing",
    "M-Pesa payment hosting",
  ],
  openGraph: {
    title: "Pricing | Kenya & East Africa",
    description:
      "Transparent pricing for business email, application hosting, reseller hosting, domains, and bulk SMS in Kenya & East Africa.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com"}/pricing`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com"}/pricing`,
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Script
        id="breadcrumb-schema-pricing"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      <main id="main-content" className="pt-24 pb-20">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h1>
          <p className="mt-4 text-center text-muted-foreground max-w-xl mx-auto">
            Choose the product and plan that fits your business. No hidden fees.
          </p>
        </section>
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

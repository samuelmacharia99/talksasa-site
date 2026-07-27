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
  title: "Pricing — Talksasa SMS, Cloud & Mail in Kenya",
  description:
    "Transparent pricing for Talksasa SMS, Talksasa Cloud (apps, VPS, reseller), and Talksasa Mail business email in Kenya & East Africa. Pay with M-Pesa. No hidden fees.",
  keywords: [
    "Talksasa SMS pricing",
    "Talksasa Cloud pricing",
    "Talksasa Mail pricing",
    "bulk SMS pricing Kenya",
    "application hosting pricing Kenya",
    "business email prices Kenya",
    "reseller hosting Kenya",
    "M-Pesa payment hosting",
  ],
  openGraph: {
    title: "Pricing | Talksasa SMS, Cloud & Mail",
    description:
      "Compare Talksasa SMS, Talksasa Cloud, and Talksasa Mail pricing in Kenya & East Africa. Pay with M-Pesa.",
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
            Pricing for <span className="gradient-text">three brands</span>
          </h1>
          <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
            Talksasa SMS, Talksasa Cloud, and Talksasa Mail — pick a brand, then choose the plan that
            fits. No hidden fees.
          </p>
        </section>
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

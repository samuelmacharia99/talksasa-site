import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Target, Users, Zap, Heart } from "lucide-react";

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
      name: "About",
      item: `${SITE_URL}/about`,
    },
  ],
};

export const metadata: Metadata = {
  title: "About Us | Kenya's Leading Digital Infrastructure Provider",
  description:
    "Learn about TalkSasa — Kenya's premium Talksasa Cloud (business email, app hosting, reseller) and bulk SMS gateway. Serving Nairobi and East Africa. Trusted by 7,000+ businesses.",
  keywords: [
    "about TalkSasa",
    "TalkSasa Kenya",
    "Talksasa Cloud Nairobi",
    "SMS provider Kenya",
    "business email Kenya",
    "application hosting Kenya",
    "bulk SMS East Africa",
  ],
  openGraph: {
    title: "About Us | Kenya's Leading Digital Infrastructure Provider",
    description:
      "Learn about TalkSasa — Talksasa Cloud and Kenya's trusted bulk SMS gateway serving East Africa.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com"}/about`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com"}/about`,
  },
};

const values = [
  { icon: Target, title: "Mission", text: "To be the most trusted digital infrastructure partner for African businesses." },
  { icon: Users, title: "Community", text: "We grow with our customers. 7,000+ businesses rely on us every day." },
  { icon: Zap, title: "Innovation", text: "We invest in technology and support so you can focus on your business." },
  { icon: Heart, title: "Support", text: "24/7 human support. No bots, no runaround." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Script
        id="breadcrumb-schema-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      <main id="main-content" className="pt-24 pb-20">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Our <span className="gradient-text">story</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            TalkSasa was built to give Kenyan and African businesses one place for bulk SMS,
            business email, application hosting, reseller cloud, and domains — without the complexity or hidden costs.
            We combine enterprise-grade infrastructure with local support and payment options.
          </p>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-semibold text-foreground mb-8">What we believe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl glass border border-border p-6 hover:border-primary/20 transition-colors"
              >
                <v.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Ready to get started?</h2>
          <Button asChild size="lg">
            <Link href="/contact">Contact us</Link>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
}

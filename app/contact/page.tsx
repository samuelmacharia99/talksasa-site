import type { Metadata } from "next";
import Script from "next/script";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ContactForm } from "@/components/contact-form";
import { Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, INFO_EMAIL, SALES_EMAIL, PRIMARY_PHONE, SALES_PHONE } from "@/lib/contact";

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
      name: "Contact",
      item: `${SITE_URL}/contact`,
    },
  ],
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  mainEntity: {
    "@type": "Organization",
    name: "TalkSasa",
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.address.streetAddress,
      addressLocality: CONTACT.address.city,
      addressCountry: "KE",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: PRIMARY_PHONE.tel,
        contactType: "customer service",
        areaServed: "KE",
        availableLanguage: ["English", "Swahili"],
      },
      {
        "@type": "ContactPoint",
        telephone: SALES_PHONE.tel,
        contactType: "sales",
        areaServed: "KE",
        availableLanguage: ["English", "Swahili"],
      },
    ],
    email: INFO_EMAIL,
  },
};

export const metadata: Metadata = {
  title: "Contact Us - TalkSasa | Nairobi, Kenya",
  description:
    `Contact TalkSasa at ${CONTACT.address.display}. Phone: ${PRIMARY_PHONE.international}, ${SALES_PHONE.international}. Email: ${INFO_EMAIL}, ${SALES_EMAIL}. 24/7 support for bulk SMS, web hosting, VPS, and cloud solutions across Kenya & East Africa.`,
  keywords: [
    "contact TalkSasa",
    "TalkSasa Nairobi",
    "TalkSasa phone number",
    "TalkSasa email",
    "hosting support Kenya",
    "SMS support Kenya",
    "Nairobi hosting contact",
    "Viewpark Towers TalkSasa",
  ],
  openGraph: {
    title: "Contact TalkSasa - Nairobi, Kenya",
    description:
      `Visit us at ${CONTACT.address.building}, ${CONTACT.address.street}. Phone, email, and 24/7 support for bulk SMS and hosting.`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com"}/contact`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com"}/contact`,
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Script
        id="breadcrumb-schema-contact"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="contact-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <Navbar />
      <main id="main-content" className="pt-24 pb-20">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center">
            Get in <span className="gradient-text">touch</span>
          </h1>
          <p className="mt-4 text-center text-muted-foreground max-w-xl mx-auto">
            Fill out the form below or use our support channels. We respond within 24 hours.
          </p>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <aside className="lg:col-span-1 space-y-6 order-2 lg:order-1">
            <div className="rounded-2xl glass border border-border p-6">
              <Mail className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold text-foreground">Email</h3>
              <div className="space-y-1">
                <a href={`mailto:${INFO_EMAIL}`} className="block text-muted-foreground hover:text-primary">
                  {INFO_EMAIL}
                </a>
                <a href={`mailto:${SALES_EMAIL}`} className="block text-muted-foreground hover:text-primary">
                  {SALES_EMAIL}
                </a>
              </div>
            </div>
            <div className="rounded-2xl glass border border-border p-6">
              <Phone className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold text-foreground">Phone</h3>
              <div className="space-y-1">
                <a href={`tel:${PRIMARY_PHONE.tel}`} className="block text-muted-foreground hover:text-primary">
                  {PRIMARY_PHONE.display}
                </a>
                <a href={`tel:${SALES_PHONE.tel}`} className="block text-muted-foreground hover:text-primary">
                  {SALES_PHONE.display}
                </a>
              </div>
            </div>
            <div className="rounded-2xl glass border border-border p-6">
              <MapPin className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold text-foreground">Office</h3>
              <p className="text-muted-foreground leading-relaxed">
                {CONTACT.address.building}
                <br />
                {CONTACT.address.street}
                <br />
                {CONTACT.address.city}, {CONTACT.address.country}
              </p>
            </div>
          </aside>
          <div className="lg:col-span-2 order-1 lg:order-2">
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

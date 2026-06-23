"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, Facebook, Instagram, CreditCard, MapPin, Phone, Mail } from "lucide-react";
import { CONTACT, INFO_EMAIL, SALES_EMAIL, PRIMARY_PHONE, SALES_PHONE } from "@/lib/contact";

const services = [
  { label: "Web hosting", href: "/web-hosting" },
  { label: "Domains", href: "/domains" },
  { label: "Application hosting", href: "/cloud-hosting" },
  { label: "VPS", href: "/vps" },
  { label: "Dedicated servers", href: "/dedicated" },
  { label: "M-Pesa payments", href: "/payments/mpesa" },
  { label: "Bulk SMS", href: "/bulk-sms" },
];

const company = [
  { label: "Book a demo", href: "/book-demo" },
  { label: "Resellers", href: "/reseller" },
  { label: "Reseller hosting", href: "/reseller-hosting" },
  { label: "SMS reseller", href: "/sms-reseller" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

const support = [
  { label: "Customer portal", href: "https://servers.talksasa.com" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact support", href: "/contact" },
];

const social = [
  { label: "Twitter", href: "#", icon: Twitter },
  { label: "LinkedIn", href: "#", icon: Linkedin },
  { label: "Facebook", href: "#", icon: Facebook },
  { label: "Instagram", href: "#", icon: Instagram },
];

const paymentMethods = ["M-Pesa", "Visa", "Mastercard", "PayPal"];

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">{title}</h4>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  const isExternal = href.startsWith("http");
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors block py-1.5"
      >
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors block py-1.5">
      {label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity" aria-label="Talksasa Cloud Home">
              <Image src="/st.png" alt="Talksasa Cloud" width={160} height={48} className="h-10 w-auto object-contain" />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Hosting, domains, cloud apps, and reseller billing — built for Kenya.
            </p>
            <div className="mt-5 space-y-2.5 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden />
                <span>
                  {CONTACT.address.building}
                  <br />
                  {CONTACT.address.street}, {CONTACT.address.city}
                </span>
              </p>
              <p className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden />
                <span className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-0.5">
                  <a href={`tel:${PRIMARY_PHONE.tel}`} className="hover:text-foreground transition-colors">
                    {PRIMARY_PHONE.display}
                  </a>
                  <span className="hidden sm:inline" aria-hidden>
                    {" · "}
                  </span>
                  <a href={`tel:${SALES_PHONE.tel}`} className="hover:text-foreground transition-colors">
                    {SALES_PHONE.display}
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden />
                <span>
                  <a href={`mailto:${INFO_EMAIL}`} className="hover:text-foreground transition-colors block">
                    {INFO_EMAIL}
                  </a>
                  <a href={`mailto:${SALES_EMAIL}`} className="hover:text-foreground transition-colors block">
                    {SALES_EMAIL}
                  </a>
                </span>
              </p>
            </div>
          </div>

          <FooterColumn title="Talksasa Cloud">
            <ul className="space-y-0">
              {services.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Company">
            <ul className="space-y-0">
              {company.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Support">
            <ul className="space-y-0">
              {support.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Follow us">
            <div className="flex gap-4 mt-4">
              {social.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-muted-foreground hover:text-primary transition-colors p-3 rounded-lg hover:bg-white/5"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </FooterColumn>
        </div>

        <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">Copyright © 2026 Talksasa Limited. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider hidden sm:inline">We accept</span>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3">
              {paymentMethods.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground border border-border"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  CreditCard,
} from "lucide-react";

const services = [
  { label: "Bulk SMS", href: "#services" },
  { label: "Web Hosting", href: "#services" },
  { label: "Domains", href: "#services" },
  { label: "VPS", href: "#services" },
  { label: "Servers", href: "#services" },
];

const company = [
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "Blog", href: "#" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

const support = [
  { label: "Help Center", href: "#" },
  { label: "API Docs", href: "#" },
  { label: "System Status", href: "#" },
  { label: "Contact Support", href: "#contact" },
];

const social = [
  { label: "Twitter", href: "#", icon: Twitter },
  { label: "LinkedIn", href: "#", icon: Linkedin },
  { label: "Facebook", href: "#", icon: Facebook },
  { label: "Instagram", href: "#", icon: Instagram },
];

const paymentMethods = ["Visa", "Mastercard", "PayPal", "M-Pesa"];

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
        {title}
      </h4>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors block py-1.5"
    >
      {label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* 1. Logo + tagline */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-block hover:opacity-90 transition-opacity"
              aria-label="TalkSasa Home"
            >
              <Image
                src="/st.png"
                alt="TalkSasa"
                width={160}
                height={48}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Your Complete Digital Infrastructure Partner
            </p>
          </div>

          {/* 2. Services */}
          <FooterColumn title="Services">
            <ul className="space-y-0">
              {services.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* 3. Company */}
          <FooterColumn title="Company">
            <ul className="space-y-0">
              {company.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* 4. Support */}
          <FooterColumn title="Support">
            <ul className="space-y-0">
              {support.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* 5. Social */}
          <FooterColumn title="Follow us">
            <div className="flex gap-4 mt-4">
              {social.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-white/5"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </FooterColumn>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">
            Copyright © 2025 TalkSasa. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider hidden sm:inline">
              We accept
            </span>
            <div className="flex items-center gap-3">
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

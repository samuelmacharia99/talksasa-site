import type { Metadata } from "next";
import { BULK_SMS_URL, HOSTING_URL, SITE_URL } from "@/lib/urls";
import { pricingUrl } from "@/lib/pricing-links";

export const BRAND = "TalkSasa";
export const CLOUD_BRAND = "Talksasa Cloud";

export const DEFAULT_SEO = {
  title: "TalkSasa | Cloud Hosting, Domains & Bulk SMS in Kenya",
  description:
    "Talksasa Cloud: web hosting, domains, cloud apps, and M-Pesa billing. Plus Kenya's trusted bulk SMS gateway for marketing, alerts, and 2FA. Reseller platform for hosting and SMS.",
  keywords: [
    "web hosting Kenya",
    "domain registration Kenya",
    "bulk SMS Kenya",
    "SMS gateway Kenya",
    "M-Pesa hosting",
    "reseller hosting platform",
    "white label hosting",
    "cloud app hosting",
    "DirectAdmin hosting",
    ".co.ke domains",
    "Laravel hosting Kenya",
    "bulk SMS Nairobi",
    "SMS API Kenya",
    "TalkSasa",
    "Talksasa Cloud",
  ],
} as const;

export const HERO = {
  eyebrow: "Talksasa Cloud · Bulk SMS",
  headline: "Hosting, domains, cloud apps — and bulk SMS —",
  headlineAccent: "built for Kenya.",
  subheadline:
    "Run your website or hosting business on Talksasa Cloud with M-Pesa billing and auto-provisioning. Send millions of messages with our bulk SMS gateway and API — trusted by 7,000+ businesses across East Africa.",
  tagline: "Cloud platform + SMS gateway. One partner for your digital stack.",
  trust: [
    "M-Pesa STK push",
    "Bulk SMS & API",
    "Auto-provisioning",
    ".co.ke domains",
  ],
} as const;

export const CUSTOMER_JOURNEY = [
  "Browse products",
  "Add to cart",
  "Checkout",
  "Pay (M-Pesa / card)",
  "Auto-provisioned",
  "Manage in portal",
] as const;

export const CUSTOMER_TRUST = [
  "Automated provisioning — no waiting for manual setup on standard plans",
  "Transparent billing — line-item invoices and renewal reminders",
  "Local payments — M-Pesa built in, not an afterthought",
  "One login for hosting, domains, apps, invoices, and support",
] as const;

export const PRODUCT_CATEGORIES = [
  {
    id: "bulk-sms",
    emoji: "📱",
    title: "Bulk SMS",
    description: "Marketing, alerts, 2FA, and API access — Kenya's trusted SMS gateway.",
    href: "/bulk-sms",
  },
  {
    id: "domains",
    emoji: "🌐",
    title: "Domains",
    description: "Register, renew, transfer, and manage DNS for Kenyan and global TLDs.",
    href: "/domains",
  },
  {
    id: "email-hosting",
    emoji: "✉️",
    title: "Business email",
    description: "Mailcow email on your domain — webmail, mailboxes, aliases, DKIM/SPF helpers.",
    href: "/email-hosting",
  },
  {
    id: "shared-hosting",
    emoji: "🏠",
    title: "Shared hosting",
    description: "DirectAdmin hosting with email, databases, SSL, and backups.",
    href: "/web-hosting",
  },
  {
    id: "cloud-apps",
    emoji: "🚀",
    title: "Cloud apps",
    description: "Deploy Laravel, Node.js, and more in containers with a full management UI.",
    href: "/cloud-hosting",
  },
  {
    id: "servers",
    emoji: "🖥️",
    title: "Servers",
    description: "VPS and dedicated servers for advanced users and custom requirements.",
    href: "/vps",
  },
  {
    id: "billing",
    emoji: "💳",
    title: "Smart billing",
    description: "Invoices, M-Pesa, cards, wallets, renewals, and PDF downloads.",
    href: "/payments/mpesa",
  },
  {
    id: "support",
    emoji: "🎫",
    title: "Support",
    description: "Built-in ticketing so nothing falls through the cracks.",
    href: "/contact",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "What is Talksasa Cloud?",
    answer:
      "Talksasa Cloud is a hosting and billing platform that lets individuals and businesses order web hosting, domains, and cloud applications online — and lets hosting resellers run a branded business on the same infrastructure.",
  },
  {
    question: "Can I pay with M-Pesa?",
    answer:
      "Yes. Customers and resellers can pay invoices using M-Pesa STK push, alongside card (Stripe), PayPal, and bank transfer options.",
  },
  {
    question: "Do you offer .co.ke domains?",
    answer:
      "Yes. The platform supports Kenyan and international domain extensions with registration, renewal, and transfer workflows.",
  },
  {
    question: "What is white-label reseller hosting?",
    answer:
      "You sell hosting under your own company name and domain. Talksasa Cloud handles provisioning, billing automation, and infrastructure; you set prices and manage customers.",
  },
  {
    question: "How fast is provisioning?",
    answer:
      "Shared hosting and container services are provisioned automatically after successful payment. Domain registration depends on registry processing once the order is submitted.",
  },
  {
    question: "Can I host Laravel or Node.js applications?",
    answer:
      "Yes. Container hosting supports multiple languages and frameworks with deployment, logs, terminal access, Git integration, and custom domains.",
  },
  {
    question: "Is there a control panel for shared hosting?",
    answer:
      "Yes. Shared hosting uses DirectAdmin. Customers receive login details and can access the panel at their domain on port 2222, or use simplified tools inside the customer portal.",
  },
  {
    question: "Who is Talksasa Cloud for?",
    answer:
      "Customers who want hosting, domains, and apps with local payment options — and resellers who want to start or scale a hosting business without building custom software. TalkSasa Bulk SMS serves the same region for messaging and API needs.",
  },
  {
    question: "Do you still offer bulk SMS?",
    answer:
      "Yes. TalkSasa Bulk SMS is a core product alongside Talksasa Cloud. Send marketing campaigns, transactional alerts, and OTP/2FA messages via our web portal or REST API, with delivery reports and M-Pesa top-up.",
  },
  {
    question: "What is reseller hosting with Talksasa Cloud?",
    answer:
      "Reseller hosting lets you sell web hosting, domains, and cloud apps under your own brand. Talksasa Cloud provides the white-label portal, automated provisioning, wholesale domain wallet, M-Pesa billing, and customer management — you set retail prices and grow your client base.",
  },
  {
    question: "How do I become a hosting reseller in Kenya?",
    answer:
      "Sign up for the Talksasa Cloud reseller program, apply your branding (logo, colors, optional custom domain), connect your M-Pesa till, set retail prices on hosting and domains, and start onboarding customers through your branded portal. Our team can help you launch.",
  },
  {
    question: "What is an SMS reseller program?",
    answer:
      "An SMS reseller buys bulk SMS credits at wholesale rates and resells to clients under their own brand and pricing. TalkSasa offers a reseller portal, API access, delivery reports, sender ID support, and M-Pesa top-up so agencies and entrepreneurs can run a messaging business without building infrastructure.",
  },
  {
    question: "Can I white-label bulk SMS for my clients?",
    answer:
      "Yes. TalkSasa SMS resellers can offer bulk SMS, OTP/2FA, and API access to their clients with white-label options. You manage pricing and customer relationships while we handle delivery, routing, and platform uptime.",
  },
  {
    question: "What are TalkSasa SMS reseller wholesale tiers?",
    answer:
      "Wholesale top-ups are tiered: Starter (KES 500–20,000 at KES 0.30/SMS), Pro (KES 20,001–60,000 at KES 0.23/SMS), and Pro+ (KES 60,001–100,000 at KES 0.20/SMS). Buy at wholesale, set your own retail prices, and keep the margin.",
  },
] as const;

export type ProductPageSlug =
  | "web-hosting"
  | "domains"
  | "cloud-hosting"
  | "vps"
  | "dedicated"
  | "servers"
  | "reseller"
  | "reseller-hosting"
  | "sms-reseller"
  | "mpesa"
  | "bulk-sms"
  | "email-hosting";

export type ProductPageContent = {
  slug: string;
  path: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  headline: string;
  subheadline: string;
  intro: string;
  features: string[];
  seoNote?: string;
  ctaPrimary: { label: string; href: string; external?: boolean };
  ctaSecondary?: { label: string; href: string; external?: boolean };
};

export const PRODUCT_PAGES: Record<ProductPageSlug, ProductPageContent> = {
  "web-hosting": {
    slug: "web-hosting",
    path: "/web-hosting",
    title: "Web Hosting Kenya — DirectAdmin Shared Hosting",
    metaDescription:
      "DirectAdmin shared web hosting in Kenya with auto-provisioning, SSL, email, databases, and M-Pesa billing. Order online and manage everything in one portal.",
    keywords: [
      "shared web hosting Kenya",
      "DirectAdmin hosting",
      "cPanel alternative Kenya",
      "web hosting Nairobi",
      "M-Pesa web hosting",
    ],
    headline: "Shared web hosting that provisions itself",
    subheadline: "DirectAdmin-powered hosting tied to your domain — live minutes after payment.",
    intro:
      "Talksasa Cloud shared hosting is built for Kenyan businesses that want reliable websites without manual setup delays. Pay with M-Pesa, get credentials by email, and manage DNS, email, databases, SSL, and backups from DirectAdmin or your customer portal.",
    features: [
      "DirectAdmin control panel at your domain on port 2222",
      "Automatic provisioning after successful payment",
      "DNS, email accounts, databases, subdomains, and FTP",
      "Free Let's Encrypt SSL and scheduled backups",
      "Optional in-portal hosting dashboard for everyday tasks",
      "Clear invoices with renewal reminders",
    ],
    seoNote: "Shared web hosting Kenya · DirectAdmin hosting · cPanel alternative Kenya",
    ctaPrimary: { label: "Order hosting", href: pricingUrl({ product: "cloud", tab: "hosting" }) },
    ctaSecondary: { label: "View pricing", href: pricingUrl({ product: "cloud", tab: "hosting" }) },
  },
  domains: {
    slug: "domains",
    path: "/domains",
    title: "Domain Registration Kenya — .co.ke, .com & More",
    metaDescription:
      "Register and renew .co.ke, .com, .org and global domains. DNS management, transfers with EPP codes, and checkout with hosting in one order. Pay with M-Pesa.",
    keywords: [
      "buy domain Kenya",
      ".co.ke registration",
      "domain transfer Kenya",
      "domain registration Nairobi",
      "register .com Kenya",
    ],
    headline: "Register your .co.ke or .com domain today",
    subheadline: "Live search, transparent pricing, M-Pesa checkout — trusted by 11,000+ domains on Talksasa Cloud.",
    intro:
      "Secure your brand before someone else does. Search availability across .co.ke, .com, .org, and more, then register in minutes with DNS management and renewal reminders built in.",
    features: [
      "Register .co.ke, .com, .org, .net, .shop, .xyz and more",
      "Live availability search with instant retail pricing",
      "Full DNS management — A, CNAME, MX, TXT records",
      "Transfer domains in with EPP/auth codes",
      "Bundle domains with web, email, or application hosting at checkout",
      "M-Pesa STK push, card, and PayPal — automatic renewal reminders",
    ],
    seoNote: "Buy domain Kenya · .co.ke registration · domain transfer Kenya",
    ctaPrimary: { label: "Search domains", href: "#domain-search" },
    ctaSecondary: { label: "Add business email", href: "/email-hosting" },
  },
  "email-hosting": {
    slug: "email-hosting",
    path: "/email-hosting",
    title: "Business Email Hosting Kenya — Mailcow on Your Domain",
    metaDescription:
      "Professional business email hosting in Kenya on your .co.ke or .com domain. Mailcow webmail, mailboxes, aliases, DKIM/SPF helpers, and M-Pesa billing via Talksasa Cloud.",
    keywords: [
      "business email hosting Kenya",
      "email hosting Nairobi",
      "Mailcow email Kenya",
      "professional email .co.ke",
      "company email Kenya",
      "webmail hosting Kenya",
    ],
    headline: "Business email that matches your brand",
    subheadline:
      "you@yourcompany.co.ke — Mailcow webmail, mailboxes, aliases, and DNS helpers. Order with a new domain or attach to one you already own.",
    intro:
      "Stop using free Gmail for invoices and customer trust. Talksasa Cloud email hosting gives Kenyan businesses branded inboxes on their own domain, with SOGo webmail, mailbox quotas, alias support, and DKIM/SPF helpers after checkout. Pay with M-Pesa and manage renewals next to your domains and hosting.",
    features: [
      "Mailcow-powered business email with webmail access",
      "Multiple mailboxes and aliases per plan",
      "DKIM, SPF and DMARC helpers when you register the domain in the same cart",
      "Attach email to an existing domain or register .co.ke / .com together",
      "Clear retail pricing with monthly and annual billing cycles",
      "M-Pesa STK push, cards, and portal renewals on Talksasa Cloud",
    ],
    seoNote: "Business email hosting Kenya · professional email .co.ke · Mailcow Nairobi",
    ctaPrimary: { label: "View email plans", href: pricingUrl({ product: "email-hosting" }) },
    ctaSecondary: { label: "Register a domain first", href: "/domains" },
  },
  "cloud-hosting": {
    slug: "cloud-hosting",
    path: "/cloud-hosting",
    title: "Cloud App Hosting — Laravel, Node.js & Containers",
    metaDescription:
      "Deploy Laravel, Node.js, Python and more with automatic container provisioning. Git deploy, web terminal, logs, metrics, custom domains, and M-Pesa billing.",
    keywords: [
      "Laravel hosting Kenya",
      "deploy Node.js app Kenya",
      "managed cloud hosting",
      "container hosting Kenya",
      "cloud app hosting",
    ],
    headline: "Deploy modern apps without managing servers",
    subheadline: "Choose your stack, pay with M-Pesa, and go live with automatic container deployment.",
    intro:
      "Talksasa Cloud app hosting is for developers and agencies shipping Laravel, Node.js, Python, and other workloads. Select runtime versions and databases at checkout, then manage deploys, logs, terminals, and SSL from one portal.",
    features: [
      "Laravel, Node.js, Python, and more — pick stack and runtime at checkout",
      "Automatic container deployment after payment",
      "Start, stop, restart, redeploy from the portal",
      "Logs, metrics, health status, web terminal, and file manager",
      "Custom domains, SSL, Git repository deploy",
      "Database tools, scheduled backups, and Laravel project helpers",
    ],
    seoNote: "Laravel hosting Kenya · deploy Node.js app · managed cloud hosting",
    ctaPrimary: { label: "Deploy your app", href: pricingUrl({ product: "cloud", tab: "cloud" }) },
    ctaSecondary: { label: "View pricing", href: pricingUrl({ product: "cloud", tab: "cloud" }) },
  },
  vps: {
    slug: "vps",
    path: "/vps",
    title: "VPS Hosting Kenya — Cloud VPS with Root Access",
    metaDescription:
      "Order cloud VPS in Kenya with full root access, dedicated resources, and secure credential delivery. M-Pesa, card, and wallet billing through Talksasa Cloud.",
    keywords: [
      "VPS Kenya",
      "cloud VPS Nairobi",
      "VPS hosting Kenya",
      "root VPS Kenya",
      "managed VPS Kenya",
    ],
    headline: "Cloud VPS with full root access",
    subheadline: "Dedicated CPU, RAM, and storage — provisioned automatically after payment.",
    intro:
      "Talksasa Cloud VPS gives developers and businesses isolated server resources without sharing a hosting account. Pick a plan, pay with M-Pesa, and receive root credentials securely once provisioning completes.",
    features: [
      "Dedicated vCPU, RAM, and NVMe storage per plan",
      "Full root access for custom stacks and software",
      "Secure credential delivery after provisioning",
      "Ideal for high-traffic sites, APIs, and databases",
      "Same billing portal — M-Pesa, cards, wallet, and PDF invoices",
      "Support tickets and renewal reminders included",
    ],
    seoNote: "VPS Kenya · cloud VPS Nairobi · root server hosting",
    ctaPrimary: { label: "Order VPS", href: pricingUrl({ product: "cloud", tab: "vps" }) },
    ctaSecondary: { label: "View pricing", href: pricingUrl({ product: "cloud", tab: "vps" }) },
  },
  dedicated: {
    slug: "dedicated",
    path: "/dedicated",
    title: "Dedicated Servers Kenya — Bare Metal Hosting",
    metaDescription:
      "Order dedicated bare-metal servers in Kenya with maximum performance, full root access, and secure provisioning. M-Pesa and card billing on Talksasa Cloud.",
    keywords: [
      "dedicated server Kenya",
      "bare metal server Kenya",
      "dedicated hosting Nairobi",
      "enterprise server Kenya",
    ],
    headline: "Dedicated bare-metal for maximum performance",
    subheadline: "Enterprise-grade hardware with full control — built for serious workloads.",
    intro:
      "When VPS is not enough, order dedicated servers through Talksasa Cloud. Get bare-metal performance for databases, heavy applications, and compliance-sensitive workloads with the same M-Pesa-ready billing portal.",
    features: [
      "Bare-metal dedicated servers with predictable performance",
      "Full root access and custom OS configurations",
      "Secure credential delivery after provisioning",
      "Ideal for enterprise apps, large databases, and custom stacks",
      "M-Pesa STK push, cards, wallet, and transparent invoices",
      "Renewal automation and support tickets included",
    ],
    seoNote: "Dedicated server Kenya · bare metal hosting Nairobi",
    ctaPrimary: { label: "Order dedicated server", href: pricingUrl({ product: "cloud", tab: "dedicated" }) },
    ctaSecondary: { label: "View pricing", href: pricingUrl({ product: "cloud", tab: "dedicated" }) },
  },
  servers: {
    slug: "servers",
    path: "/servers",
    title: "VPS & Dedicated Servers Kenya",
    metaDescription:
      "Order VPS and dedicated servers with full root access. Secure credential delivery, ideal for high-traffic sites and custom stacks. M-Pesa and card payments.",
    keywords: [
      "VPS Kenya",
      "dedicated server Kenya",
      "cloud VPS Nairobi",
      "root server hosting Kenya",
    ],
    headline: "VPS and dedicated servers for full control",
    subheadline: "Root access, secure delivery, and infrastructure sized for serious workloads.",
    intro:
      "When shared hosting or containers are not enough, order VPS or bare-metal dedicated servers through Talksasa Cloud. Credentials are delivered securely after provisioning — ideal for custom stacks and enterprise traffic.",
    features: [
      "VPS plans with dedicated resources and root access",
      "Dedicated bare-metal for maximum performance",
      "Secure credential delivery after provisioning",
      "Ideal for custom stacks and high-traffic applications",
      "Same billing portal — M-Pesa, cards, wallet, and PDF invoices",
      "Support tickets and renewal automation included",
    ],
    ctaPrimary: { label: "Order VPS", href: pricingUrl({ product: "cloud", tab: "vps" }) },
    ctaSecondary: { label: "Dedicated server pricing", href: pricingUrl({ product: "cloud", tab: "dedicated" }) },
  },
  reseller: {
    slug: "reseller",
    path: "/reseller",
    title: "White-Label Hosting Reseller Platform Kenya",
    metaDescription:
      "Start a branded hosting business in Kenya. Custom domain, your M-Pesa, wholesale domains, automated billing, DirectAdmin provisioning, and customer management.",
    keywords: [
      "white label hosting reseller",
      "start hosting company Kenya",
      "reseller hosting platform",
      "hosting reseller Kenya",
      "domain reseller wholesale",
    ],
    headline: "Run a white-label hosting business — without building software",
    subheadline: "Your brand, your prices, your M-Pesa. We provision, bill, and operate the infrastructure.",
    intro:
      "Talksasa Cloud gives designers, agencies, and entrepreneurs a complete reseller platform: branded customer portal, retail catalog, wholesale domain wallet, custom invoices, and one-click provisioning on DirectAdmin and containers.",
    features: [
      "Custom branding — logo, colors, and optional custom domain with SSL",
      "Set your own retail prices on hosting, domains, and cloud apps",
      "Wholesale domain wallet with per-TLD retail margins",
      "Connect your own M-Pesa — payments go to your till",
      "Full customer lifecycle: create, invoice, suspend, impersonate",
      "Reports and exports for revenue, margins, and services",
    ],
    seoNote: "White label hosting reseller · start hosting company Kenya",
    ctaPrimary: { label: "Become a reseller", href: "/contact" },
    ctaSecondary: { label: "Open reseller portal", href: HOSTING_URL, external: true },
  },
  "reseller-hosting": {
    slug: "reseller-hosting",
    path: "/reseller-hosting",
    title: "Reseller Hosting Kenya — White-Label Hosting Business",
    metaDescription:
      "Start a reseller hosting business in Kenya with Talksasa Cloud. White-label portal, your M-Pesa, wholesale domains, DirectAdmin provisioning, automated billing, and customer management.",
    keywords: [
      "reseller hosting Kenya",
      "white label hosting reseller",
      "start hosting company Kenya",
      "hosting reseller program",
      "domain reseller wholesale",
      "web hosting reseller Nairobi",
    ],
    headline: "Run a hosting company under your brand",
    subheadline:
      "White-label portal, wholesale domains, your M-Pesa till, and automated provisioning — with live platform plans you can checkout today.",
    intro:
      "Talksasa Cloud reseller hosting is built for web designers, digital agencies, and entrepreneurs who want to run a hosting company without building software or managing data centres. You get a branded customer portal, retail catalog, wholesale domain wallet, one-click DirectAdmin provisioning, container app hosting, and full billing automation. Set your own prices, onboard clients, and scale with reports that show revenue, margins, and active services.",
    features: [
      "White-label customer portal — your logo, colors, and optional custom domain with SSL",
      "Retail catalog for shared hosting, domains, VPS, and cloud applications",
      "Wholesale domain wallet with per-TLD margins you control",
      "Connect your own M-Pesa — customer payments settle to your business",
      "Automated provisioning on DirectAdmin and container infrastructure",
      "Customer lifecycle tools: create accounts, invoice, suspend, impersonate, and export reports",
    ],
    seoNote: "Reseller hosting Kenya · white label hosting · start hosting company Nairobi",
    ctaPrimary: { label: "View reseller plans", href: pricingUrl({ product: "reseller-hosting" }) },
    ctaSecondary: { label: "Learn more", href: "/reseller-hosting" },
  },
  "sms-reseller": {
    slug: "sms-reseller",
    path: "/sms-reseller",
    title: "SMS Reseller Kenya — White-Label Bulk SMS Business",
    metaDescription:
      "Become a bulk SMS reseller in Kenya with TalkSasa. White-label portal, wholesale SMS rates, REST API, sender IDs, delivery reports, and M-Pesa top-up. Start from KES 5,000.",
    keywords: [
      "SMS reseller Kenya",
      "bulk SMS reseller",
      "white label SMS Kenya",
      "SMS reseller program Nairobi",
      "resell bulk SMS",
      "SMS API reseller",
    ],
    headline: "Build a bulk SMS business as a TalkSasa reseller",
    subheadline:
      "Wholesale SMS from KES 0.20/SMS — Starter, Pro, and Pro+ tiers with a reseller portal, API access, and white-label options.",
    intro:
      "TalkSasa SMS reseller program lets agencies, marketers, and entrepreneurs offer bulk SMS, OTP/2FA, and API messaging to their clients without owning telecom infrastructure. Buy credits at wholesale rates, set your own retail pricing, and manage customers from a dedicated portal. Supports marketing campaigns, transactional alerts, sender ID registration, delivery reports, and M-Pesa top-up — trusted across Kenya and East Africa.",
    features: [
      "Reseller portal to manage clients, credits, and pricing",
      "Wholesale bulk SMS rates with margins you set",
      "REST API for client integrations — OTP, alerts, and campaigns",
      "Sender ID registration and delivery reporting",
      "White-label options so clients see your brand",
      "M-Pesa and local payment top-up — credits never expire",
    ],
    seoNote: "SMS reseller Kenya · bulk SMS reseller · white label SMS Nairobi",
    ctaPrimary: { label: "View wholesale tiers", href: "/sms-reseller#wholesale-tiers" },
    ctaSecondary: { label: "Open SMS reseller portal", href: BULK_SMS_URL, external: true },
  },
  mpesa: {
    slug: "mpesa",
    path: "/payments/mpesa",
    title: "Pay for Hosting with M-Pesa — STK Push Billing",
    metaDescription:
      "Pay Talksasa Cloud invoices with M-Pesa STK push. Hosting, domains, and cloud apps with local payments plus cards, PayPal, and bank transfer.",
    keywords: [
      "pay hosting with M-Pesa",
      "M-Pesa hosting Kenya",
      "hosting invoice Kenya",
      "STK push hosting",
    ],
    headline: "Pay for hosting the Kenyan way",
    subheadline: "M-Pesa STK push on every invoice — alongside cards, PayPal, bank transfer, and wallet credits.",
    intro:
      "Talksasa Cloud was built for Kenya. Customers and resellers pay invoices with M-Pesa directly from the portal. Resellers connect their own till so customer payments settle to their business.",
    features: [
      "M-Pesa STK push — approve payment on your phone",
      "Stripe cards and PayPal for international customers",
      "Bank transfer with admin verification when needed",
      "Account wallet — top up credits and apply to invoices",
      "PDF invoices with line-item detail for your records",
      "Automatic renewal invoices before services expire",
    ],
    seoNote: "Pay hosting with M-Pesa · hosting invoice Kenya",
    ctaPrimary: { label: "Create free account", href: HOSTING_URL, external: true },
    ctaSecondary: { label: "Reseller M-Pesa setup", href: "/reseller" },
  },
  "bulk-sms": {
    slug: "bulk-sms",
    path: "/bulk-sms",
    title: "Bulk SMS Kenya — Gateway & API for Business",
    metaDescription:
      "Send bulk SMS in Kenya with TalkSasa. Marketing campaigns, alerts, OTP/2FA, delivery reports, and REST API. M-Pesa top-up. Trusted by 7,000+ businesses in East Africa.",
    keywords: [
      "bulk SMS Kenya",
      "SMS gateway Kenya",
      "bulk SMS Nairobi",
      "SMS API Kenya",
      "marketing SMS Kenya",
      "OTP SMS Kenya",
    ],
    headline: "Kenya's trusted bulk SMS gateway",
    subheadline: "Send millions of messages for marketing, alerts, and 2FA — with API access and M-Pesa billing.",
    intro:
      "TalkSasa Bulk SMS runs alongside Talksasa Cloud as a core product. Reach customers instantly with reliable delivery across Kenya and East Africa. Use our web portal for campaigns or integrate our REST API for OTP, notifications, and transactional messaging.",
    features: [
      "Bulk SMS portal for campaigns, groups, and scheduled sends",
      "REST API for 2FA, OTP, and transactional messages",
      "Delivery reports and sender ID customization",
      "M-Pesa and local payment top-up — credits never expire",
      "SMS reseller and white-label options for agencies",
      "24/7 support from our Nairobi team",
    ],
    seoNote: "Bulk SMS Kenya · SMS gateway Nairobi · SMS API East Africa",
    ctaPrimary: { label: "Start sending SMS", href: BULK_SMS_URL, external: true },
    ctaSecondary: { label: "View SMS pricing", href: "/pricing" },
  },
};

export function buildProductMetadata(page: ProductPageContent): Metadata {
  return {
    title: page.title,
    description: page.metaDescription,
    keywords: [...page.keywords, ...DEFAULT_SEO.keywords],
    openGraph: {
      title: `${page.title} | ${BRAND}`,
      description: page.metaDescription,
      url: `${SITE_URL}${page.path}`,
    },
    alternates: {
      canonical: `${SITE_URL}${page.path}`,
    },
  };
}

export function faqJsonLd(items: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

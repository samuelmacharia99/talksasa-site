import { randomUUID } from "crypto";
import mysql from "mysql2/promise";
import { loadEnv } from "./load-env.mjs";

loadEnv();

function mysqlConfig() {
  const url = process.env.DATABASE_URL;
  if (url) {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: Number(parsed.port || 3306),
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace(/^\//, ""),
    };
  }
  return {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "talksasa",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "talksasa",
  };
}

const now = new Date().toISOString();

/** @type {Array<{
 *  slug: string;
 *  title: string;
 *  excerpt: string;
 *  seoTitle: string;
 *  seoDescription: string;
 *  ctaLabel: string;
 *  ctaHref: string;
 *  body: string;
 * }>} */
const GUIDES = [
  {
    slug: "how-to-register-co-ke-domain-kenya",
    title: "How to Register a .co.ke Domain in Kenya (Step-by-Step)",
    excerpt:
      "Learn how to search, register, and manage a .co.ke domain in Kenya — including DNS, renewals, and why Kenyan businesses prefer .co.ke over .com.",
    seoTitle: "Register a .co.ke Domain in Kenya | TalkSasa Guide",
    seoDescription:
      "Step-by-step guide to registering a .co.ke domain in Kenya. Search availability, checkout with M-Pesa, set DNS, and renew on time with TalkSasa.",
    ctaLabel: "Search & register a domain",
    ctaHref: "/domains",
    body: `## Why .co.ke still wins for Kenyan businesses

A \`.co.ke\` domain tells customers you operate in Kenya. It builds trust for local search, invoices, M-Pesa receipts, and government or bank onboarding. A \`.com\` can work globally — but for Nairobi, Mombasa, Kisumu, and most East African SMEs, \`.co.ke\` is the clearer local signal.

TalkSasa lets you search live availability, register Kenyan and global TLDs, manage DNS, and pay with M-Pesa from one account.

## What you need before you register

1. **A business or brand name** you can spell consistently (avoid clever misspellings).
2. **Registrant contact details** — name, email, phone (use a mailbox you check daily).
3. **Payment ready** — M-Pesa STK push, card, or the methods shown at checkout.
4. **Optional hosting plan** if the domain should go live immediately (you can register DNS-only first).

## Step 1 — Search availability

1. Open [TalkSasa Domains](/domains).
2. Enter your label only (for example \`acme\` not \`www.acme.co.ke\`).
3. Check \`.co.ke\` first, then nearby options like \`.com\`, \`.org\`, or \`.ke\` variants if offered.
4. If the exact name is taken, try:
   - A short suffix (\`acmehq\`, \`acmeke\`)
   - Your town or sector (\`acmenairobi\`, \`acmelogistics\`)
   - A name customers already use when they call you

Tip: Prefer names that are easy to say on a phone call in English or Swahili.

## Step 2 — Register and pay

1. Add the domain to your cart for the registration period (usually 1 year).
2. Confirm registrant details carefully — errors here slow transfers later.
3. Complete checkout. On TalkSasa Cloud you can pay with **M-Pesa STK push** and other supported methods.
4. Save the confirmation email and invoice PDF.

Registration is complete when the domain shows as active in your [customer portal](https://servers.talksasa.com).

## Step 3 — Point DNS to your website or email

After registration, set DNS so traffic reaches the right place:

- **Website on TalkSasa hosting** — use the nameservers or A/CNAME records shown in your hosting panel.
- **External site** — create an A record to your server IP or a CNAME to your host.
- **Email** — add MX records from your email provider (and SPF/DKIM when they give them to you).

DNS changes can take minutes to a few hours to propagate. Keep the old site online until the new records resolve worldwide.

## Step 4 — Turn on renewals and reminders

Kenyan businesses lose domains every year to forgotten renewals. In TalkSasa Cloud:

- Enable **auto-renew** where available.
- Watch for renewal invoices and SMS/email reminders.
- Renew early if the domain is critical to billing or WhatsApp links.

## .co.ke vs .com — quick decision guide

| Goal | Prefer |
|------|--------|
| Local customers, Kenyan trust | \`.co.ke\` |
| Export brand / global SaaS | \`.com\` (often plus \`.co.ke\` defensively) |
| Non-profit or association | \`.or.ke\` / \`.org\` when eligible |
| Short campaign microsite | Match the campaign name; keep brand on \`.co.ke\` |

Many serious brands register **both** \`.co.ke\` and \`.com\` and redirect one to the other.

## Common mistakes to avoid

- Registering under a personal email you will leave behind when staff changes.
- Leaving default parking page live for months (hurts trust and SEO).
- Buying a lookalike spelling that customers never type correctly.
- Ignoring WHOIS/contact updates after you change phone numbers.

## FAQ

**How long does .co.ke registration take?**  
Usually minutes after successful payment, once the registry accepts the order.

**Can I transfer a .co.ke domain to TalkSasa later?**  
Yes — you will need an EPP/auth code from the current registrar and an unlocked domain. [Contact sales](/contact) if you need help planning a transfer.

**Do I need hosting on the same day?**  
No. You can register first and add [business email](/email-hosting) or [application hosting](/cloud-hosting) when you are ready.

## Next step

Search your name on TalkSasa Domains, register the \`.co.ke\` you want, then connect hosting or DNS. Need a walkthrough? [Book a demo](/book-demo) or [contact our Nairobi team](/contact).
`,
  },
  {
    slug: "bulk-sms-kenya-api-guide-businesses",
    title: "Bulk SMS in Kenya: How Businesses Send and Automate with an API",
    excerpt:
      "A practical guide to bulk SMS in Kenya — sender IDs, delivery, compliance, and how to connect your app or Laravel/PHP stack to a local SMS gateway.",
    seoTitle: "Bulk SMS Kenya API Guide for Businesses | TalkSasa",
    seoDescription:
      "How Kenyan businesses use bulk SMS for OTP, alerts, and marketing. Sender IDs, API basics, compliance tips, and getting started with TalkSasa.",
    ctaLabel: "Explore bulk SMS",
    ctaHref: "/bulk-sms",
    body: `## Why bulk SMS still converts in Kenya

Kenya has high mobile penetration and strong SMS open rates. Banks, schools, logistics firms, SACCOs, clinics, and e-commerce brands use SMS for:

- One-time passwords (OTP) and 2FA
- Order and delivery updates
- Fee reminders and M-Pesa payment nudges
- Promotions and flash sales
- Staff or parent alerts

A local gateway like [TalkSasa Bulk SMS](/bulk-sms) is built for Kenyan routes, sender IDs, and business volumes — not a generic international toy API.

## Bulk SMS vs WhatsApp — when to use which

| Use case | Prefer |
|----------|--------|
| OTP, transactional alerts | SMS (works without data or app) |
| Rich chat / catalogues | WhatsApp Business |
| Mass promo to opted-in lists | SMS (with clear opt-out) |
| Support conversations | WhatsApp or ticket portal |

Many TalkSasa customers use **both**: SMS for critical alerts, WhatsApp for sales follow-up.

## Step 1 — Choose the right product path

1. **Direct bulk SMS** — you send under your approved sender ID for your own customers.
2. **[SMS reseller](/sms-reseller)** — white-label credits if you sell SMS to your own clients.
3. Start with a small top-up, prove delivery on your routes, then scale.

## Step 2 — Plan sender ID and message content

- Apply for a **sender ID** that matches your brand (rules vary; keep it short and recognisable).
- Keep OTP messages under ~160 characters when possible (or plan for multi-part SMS cost).
- Always include who you are: \`TalkSasa: Your code is 482910. Do not share.\`
- For marketing SMS, only message people who opted in and honour STOP/opt-out.

## Step 3 — Connect via API (high-level flow)

Exact endpoints live in your portal docs after signup. The pattern is the same for PHP, Laravel, Node, or Python:

1. Create an API key / token in the SMS portal.
2. POST the destination MSISDN in international format (\`2547XXXXXXXX\`).
3. Pass message body + sender ID.
4. Store the message ID returned for delivery reports and support.
5. Retry safely on network failure (idempotent keys help).

Pseudo-example:

\`\`\`http
POST /api/sms/send
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "to": "254712345678",
  "message": "Your TalkSasa verification code is 482910",
  "sender_id": "TALKSASA"
}
\`\`\`

Use environment variables for tokens — never commit them to Git.

## Step 4 — Delivery, balance, and monitoring

- Watch **delivery receipts** for network or handset issues.
- Set a low-balance alert so OTPs do not fail at month-end.
- Separate **transactional** and **marketing** traffic when your account supports it.
- Log failures in your app so support can replay a single OTP without resending to the whole list.

## Compliance basics for Kenya

- Get consent for promotional SMS.
- Do not spoof banks, Safaricom, or government brands.
- Keep personal data (phone lists) secure under the Kenya Data Protection Act mindset — minimise access, encrypt backups, delete stale lists.
- Document your retention period for OTP logs.

## Cost control tips

- Prefer templates for OTPs so length stays predictable.
- Segment campaigns (active customers only).
- Test on 5–10 numbers before a 50,000 blast.
- Resellers: use wholesale tiers carefully — see [SMS reseller pricing](/sms-reseller).

## FAQ

**How fast are OTPs?**  
Typically seconds on healthy routes. Build a 30–60 second UX timeout and a “resend” button with rate limits.

**Can I send from a Laravel or PHP app?**  
Yes — any stack that can make HTTPS requests. [Book a demo](/book-demo) if you want help mapping your first integration.

**What if I need cloud products plus SMS?**  
TalkSasa also offers [business email](/email-hosting) and [application hosting](/cloud-hosting) so billing and support sit closer together.

## Next step

Open [Bulk SMS](/bulk-sms), create your account, request a sender ID, and send a test OTP to your own phone. For reseller margins, compare [SMS reseller](/sms-reseller) tiers. Questions? [Contact sales](/contact) on \`+254 781 000 403\`.
`,
  },
  {
    slug: "pay-cloud-services-mpesa-kenya",
    title: "How to Pay for Talksasa Cloud with M-Pesa in Kenya",
    excerpt:
      "Pay TalkSasa Cloud email, apps, domains, and renewals with M-Pesa STK push — how it works, what to expect on your phone, and how to avoid failed payments.",
    seoTitle: "Pay Talksasa Cloud with M-Pesa Kenya | TalkSasa",
    seoDescription:
      "Use M-Pesa STK push to pay for business email, application hosting, and domains in Kenya. Step-by-step TalkSasa checkout, renewal tips, and troubleshooting.",
    ctaLabel: "See M-Pesa cloud payments",
    ctaHref: "/payments/mpesa",
    body: `## Why M-Pesa matters for Kenyan cloud buyers

Most SMEs in Kenya do not want foreign cards stuck on international processors. **M-Pesa STK push** lets you approve payment on the phone you already use for suppliers and salaries.

TalkSasa Cloud supports M-Pesa for email, apps, domains, and renewals — see the product page: [Pay with M-Pesa](/payments/mpesa).

## What you can pay with M-Pesa

- [Business email](/email-hosting) plans
- [Application hosting](/cloud-hosting)
- [Reseller hosting](/reseller-hosting)
- [VPS](/vps) and [dedicated servers](/dedicated)
- [Domain registration and renewals](/domains)
- Reseller and add-on invoices shown in the portal

Exact options depend on the invoice in [servers.talksasa.com](https://servers.talksasa.com).

## Step-by-step: first cloud payment

1. Choose a plan on [Email hosting](/email-hosting), [Application hosting](/cloud-hosting), or [Pricing](/pricing).
2. Create or log into your TalkSasa Cloud account.
3. At checkout, select **M-Pesa** / STK push when offered.
4. Enter the **Safaricom number** that will pay (usually \`07XXXXXXXX\`).
5. Unlock your phone and enter your M-Pesa PIN when the STK prompt appears.
6. Wait for the success SMS from M-Pesa **and** the portal confirmation.
7. Download the PDF invoice for your accountant.

Provisioning starts after the payment is confirmed — do not close the browser mid-prompt if you can avoid it.

## Renewals without drama

1. Watch for renewal reminders by email/SMS before expiry.
2. Open the unpaid invoice in the customer portal.
3. Pay with M-Pesa the same way as checkout.
4. Keep auto-renew enabled on critical domains and production services.

If a service is revenue-critical, renew **7 days early**. Waiting until the last hour invites PIN fails and network congestion.

## Troubleshooting failed M-Pesa payments

| Symptom | What to try |
|---------|-------------|
| No STK prompt | Confirm the number is Safaricom, has signal, and is not in flight mode |
| Wrong PIN / cancelled | Retry once; check M-Pesa balance |
| Paid but portal still unpaid | Wait 2–5 minutes, refresh; keep the M-Pesa SMS as proof and [contact support](/contact) |
| Timeout | Start a new payment attempt from the same invoice — do not pay twice manually via Paybill unless support instructs you |

Never share your M-Pesa PIN with anyone claiming to be TalkSasa support.

## Cards and other methods

M-Pesa is the default for many local customers, but TalkSasa also supports other methods where enabled (cards, PayPal, wallet credits). Use whatever matches your finance policy — the invoice line items stay the same.

## Security tips

- Pay only from the official portal or website checkout.
- Bookmark \`https://servers.talksasa.com\` and \`https://talksasa.com\`.
- Treat invoice PDFs as financial records under your normal bookkeeping process.

## FAQ

**Does M-Pesa work for domain + email in one cart?**  
Yes when checkout supports combined orders — you will see a single STK amount for the cart total.

**Can my company pay from a till or Paybill?**  
Ask [sales](/contact) for the process that matches your invoice; STK to a personal or business line is the most common path.

**I need product advice before paying**  
[Book a demo](/book-demo) or call \`+254 781 000 403\`.

## Next step

Pick a plan on [Email hosting](/email-hosting) or [Application hosting](/cloud-hosting), check out with M-Pesa, and keep your renewal reminders on. More detail on the flow: [M-Pesa payments](/payments/mpesa).
`,
  },
  {
    slug: "email-apps-vs-vps-kenya-smes",
    title: "Business Email & App Hosting vs VPS in Kenya: Which Should You Choose?",
    excerpt:
      "Compare Talksasa Cloud email and application hosting with VPS for Kenyan SMEs — cost, control, and a simple decision checklist.",
    seoTitle: "Email & App Hosting vs VPS Kenya for SMEs | TalkSasa",
    seoDescription:
      "Business email, application hosting, or VPS for your Kenyan business? Compare price, performance, and when to upgrade — with TalkSasa options and M-Pesa billing.",
    ctaLabel: "Compare cloud plans",
    ctaHref: "/pricing",
    body: `## The short answer

- Choose **[business email](/email-hosting)** if you need branded inboxes on your domain with webmail and DKIM/SPF helpers.
- Choose **[application hosting](/cloud-hosting)** if you want container deploys for Laravel, Node.js, or Python without managing a full server.
- Choose a **[VPS](/vps)** if you need root access, custom stacks, higher traffic, or staging environments.
- Choose **[dedicated](/dedicated)** when compliance or raw performance demand a whole machine.
- Choose **[reseller hosting](/reseller-hosting)** when you want to sell email, apps, and domains under your own brand.

## Side-by-side comparison

| Factor | Email / app hosting | VPS |
|--------|---------------------|-----|
| Price | Predictable product plans | Higher, scales with CPU/RAM |
| Management | Managed product experience | You (or your developer) manage more |
| Isolation | Dedicated mailboxes / containers | Full VM isolation |
| Custom software | App stack helpers | Root / full stack freedom |
| Best for | SMEs, teams, modern apps | Agencies, SaaS MVPs, busy APIs |

## When email + app hosting is enough

Stay on product hosting if most of these are true:

- You need staff email on your domain
- You deploy one or a few modern apps with Git
- One developer or agency managing updates
- You want M-Pesa renewals and tickets without hiring a sysadmin

TalkSasa [business email](/email-hosting) and [application hosting](/cloud-hosting) are aimed at this segment.

## When you should move to VPS

Upgrade signals:

- You need Redis, queues, cron-heavy jobs, or multiple custom services
- PCI-ish or internal tools that need stricter isolation
- CI/CD deploys and SSH as a daily workflow
- You sell hosting to clients ([reseller hosting](/reseller-hosting) may fit better than one fat VPS)

A [TalkSasa VPS](/vps) gives dedicated resources with room to grow before bare metal.

## Cost thinking for Kenyan SMEs

Do not only compare the sticker price:

1. **Downtime cost** — if the service takes orders or fee payments, under-provisioning can cost more than a VPS.
2. **Developer hours** — unmanaged VPS without skills is expensive.
3. **Bundles** — domain + email + SMS often cheaper when billed together with [M-Pesa](/payments/mpesa).

Start with the product that matches the job, measure, then upgrade with a migration plan — TalkSasa support can help scope that via [contact](/contact).

## Recommended paths by business type

| Business | Starting point |
|----------|----------------|
| Law firm / clinic | Business email + \`.co.ke\` domain |
| School portal + parent SMS | App hosting + [bulk SMS](/bulk-sms) |
| Logistics tracking API | VPS or application hosting |
| Agency with many clients | [Reseller hosting](/reseller-hosting) |
| High-traffic national campaign | VPS / dedicated after load testing |

## FAQ

**Is VPS always faster?**  
Not automatically — a badly tuned VPS can lose to a well-tuned app plan. VPS wins when you need resources and control.

**Can I pay either option with M-Pesa?**  
Yes on TalkSasa Cloud when M-Pesa is enabled for the invoice. See [M-Pesa payments](/payments/mpesa).

**Where do I see prices?**  
[Pricing](/pricing) and the product pages for [email hosting](/email-hosting), [application hosting](/cloud-hosting), and [VPS](/vps).

## Next step

If you are unsure, [book a demo](/book-demo) and describe your traffic and stack — we will recommend email, apps, VPS, or reseller without overselling.
`,
  },
  {
    slug: "business-email-hosting-kenya-own-domain",
    title: "Business Email Hosting in Kenya: Get you@yourcompany.co.ke",
    excerpt:
      "Why Kenyan businesses need branded email, how TalkSasa Cloud webmail works, and how to order email with a new or existing domain.",
    seoTitle: "Business Email Hosting Kenya on Your Domain | TalkSasa",
    seoDescription:
      "Set up professional business email in Kenya on your .co.ke or .com domain. Webmail, mailboxes, DKIM/SPF helpers, and M-Pesa checkout.",
    ctaLabel: "Order business email",
    ctaHref: "/email-hosting",
    body: `## Why branded email beats free Gmail for Kenyan businesses

Customers trust \`accounts@yourcompany.co.ke\` more than \`yourcompany254@gmail.com\`. Branded email improves invoices, RFQs, bank onboarding, and Google deliverability when SPF/DKIM are set correctly.

TalkSasa Cloud [email hosting](/email-hosting) sells professional business email with live retail plans — pair it with a [domain](/domains) in one cart or attach it to a domain you already own.

## What you get

- Mailboxes and aliases based on the plan you pick
- Secure webmail in the browser
- Storage quotas shown on each plan card
- DKIM/SPF helpers when the domain is registered in the same checkout
- M-Pesa and portal renewals next to domains and apps

## Option A — Register domain + email together (recommended)

1. Open [Email hosting](/email-hosting#plans).
2. Select a plan and billing cycle.
3. Choose **Register new** and enter \`acme.co.ke\` (or \`.com\`).
4. Checkout — the cart includes domain registration (1 year) plus the email service.
5. Complete account and payment on Talksasa Cloud.

After payment, MX and related DNS helpers can be applied automatically because the domain and email were ordered together.

## Option B — Use a domain you already own

1. On [Email hosting](/email-hosting#plans), choose **I have a domain**.
2. Enter the FQDN (for example \`acme.co.ke\` or \`mail.acme.com\` if that is what your plan expects).
3. Order email only — the service line carries the \`domain\` field to checkout.
4. Point MX (and related records) as instructed in the portal if they are not auto-applied.

## Email + apps + SMS

Many TalkSasa customers combine:

- [Domains](/domains) for the brand
- [Email hosting](/email-hosting) for staff inboxes
- [Application hosting](/cloud-hosting) for their web apps
- [Bulk SMS](/bulk-sms) for OTP and customer alerts

One portal, local payments, one support team in Nairobi.

## FAQ

**Is this Google Workspace?**  
No — it is Talksasa Cloud business email, priced in KES with M-Pesa-friendly billing.

**Can resellers sell email?**  
Platform resellers should check their catalog in the hosting portal; marketing-site checkout uses retail \`email_hosting\` products from \`GET /services\`.

**How do I compare plans?**  
Live mailbox, alias, and quota limits are listed on each plan at [email hosting](/email-hosting#plans).

## Next step

Pick a plan on [Email hosting](/email-hosting), attach your domain, and checkout. Need help migrating mailboxes? [Contact sales](/contact) or [book a demo](/book-demo).
`,
  },
];

async function main() {
  const config = mysqlConfig();
  if (!config.password && !process.env.DATABASE_URL) {
    console.error("Missing MySQL credentials. Set MYSQL_* or DATABASE_URL in .env");
    process.exit(1);
  }

  const conn = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
  });

  let inserted = 0;
  let skipped = 0;

  for (const guide of GUIDES) {
    const [rows] = await conn.query("SELECT id FROM guides WHERE slug = ? LIMIT 1", [guide.slug]);
    if (Array.isArray(rows) && rows.length > 0) {
      console.log(`skip (exists): ${guide.slug}`);
      skipped += 1;
      continue;
    }

    const id = randomUUID();
    await conn.query(
      `INSERT INTO guides (
        id, slug, title, excerpt, body, status,
        seo_title, seo_description, cta_label, cta_href,
        published_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        guide.slug,
        guide.title,
        guide.excerpt,
        guide.body,
        guide.seoTitle,
        guide.seoDescription,
        guide.ctaLabel,
        guide.ctaHref,
        now,
        now,
        now,
      ]
    );
    console.log(`published: /guides/${guide.slug}`);
    inserted += 1;
  }

  await conn.end();
  console.log(`Done. inserted=${inserted} skipped=${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

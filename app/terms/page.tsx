import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Terms and Conditions", item: `${SITE_URL}/terms` },
  ],
};

export const metadata: Metadata = {
  title: "Terms and Conditions - TalkSasa | Service Agreement",
  description:
    "TalkSasa Terms and Conditions of Service. Read our terms for Bulk SMS, domain registration, web hosting, and email hosting services in Kenya. Effective 10th August 2024.",
  keywords: [
    "TalkSasa terms",
    "terms and conditions Kenya",
    "SMS service terms",
    "hosting terms Kenya",
    "domain registration terms",
  ],
  openGraph: {
    title: "Terms and Conditions - TalkSasa",
    description:
      "TalkSasa Terms and Conditions of Service for Bulk SMS, domains, and hosting. Read before using our services.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com"}/terms`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com"}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Script
        id="breadcrumb-schema-terms"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      <main id="main-content" className="pt-24 pb-20">
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <header className="mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Terms &amp; <span className="gradient-text">Conditions</span>
            </h1>
            <p className="mt-4 text-muted-foreground">
              <strong>Effective Date:</strong> 10th August 2024
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              www.talksasa.com |{" "}
              <a href="mailto:info@talksasa.com" className="hover:text-primary">
                info@talksasa.com
              </a>{" "}
              | +254 712 295 880 | +254 781 000 403
            </p>
            <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-foreground font-medium">
                <strong>Important Legal Notice:</strong> Please read these Terms and Conditions
                carefully before using any TalkSasa service. By accessing, registering, or using any
                TalkSasa service, you unconditionally agree to be legally bound by these Terms in
                their entirety. If you do not agree, you must immediately cease use of all TalkSasa
                services.
              </p>
            </div>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Definitions</h2>
              <p className="text-muted-foreground mb-2">
                In these Terms, the following definitions apply:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>
                  &quot;TalkSasa,&quot; &quot;Company,&quot; &quot;We,&quot; &quot;Us,&quot; or
                  &quot;Our&quot; refers to TalkSasa Ltd, a company duly registered under the laws
                  of Kenya, reachable at info@talksasa.com.
                </li>
                <li>
                  &quot;Client,&quot; &quot;You,&quot; or &quot;Your&quot; refers to any
                  individual, business, company, or entity that accesses, registers for, or uses any
                  TalkSasa service.
                </li>
                <li>
                  &quot;Services&quot; means all services offered by TalkSasa including but not
                  limited to Bulk SMS, Sender ID Registration, Domain Registration, Web Hosting, and
                  Email Hosting.
                </li>
                <li>
                  &quot;Sender ID&quot; means a customized alphanumeric or numeric identifier used
                  to brand SMS messages.
                </li>
                <li>
                  &quot;Domain&quot; means an internet domain name registered through or managed by
                  TalkSasa on behalf of the Client.
                </li>
                <li>
                  &quot;Renewal Confirmation&quot; means the official written or electronic notice
                  issued by TalkSasa confirming that a domain, hosting plan, or service subscription
                  has been successfully renewed.
                </li>
                <li>
                  &quot;Agreement&quot; refers to these Terms and Conditions, together with any
                  invoices, order forms, or supplementary agreements entered into between TalkSasa
                  and the Client.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-2">
                <strong>2.1</strong> By registering an account, placing an order, making a payment,
                or using any Service, you acknowledge that you have read, understood, and agree to
                be legally bound by these Terms without modification.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>2.2</strong> These Terms constitute a binding legal contract between you and
                TalkSasa. Use of our Services without acceptance of these Terms is strictly
                prohibited.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>2.3</strong> TalkSasa reserves the right to amend these Terms at any time by
                posting the revised version on our website. Your continued use of any Service after
                changes are posted constitutes your acceptance of the revised Terms. It is your sole
                responsibility to check for updates regularly.
              </p>
              <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-foreground font-medium">
                  Failure to read these Terms does not exempt you from their application.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Bulk SMS Services</h2>

              <h3 className="text-lg font-medium text-foreground mt-6 mb-2">3.1 Permitted Use</h3>
              <p className="text-muted-foreground mb-2">
                The Bulk SMS Service may only be used for lawful purposes. By using this Service,
                you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>All recipients have provided prior express consent to receive messages from you.</li>
                <li>
                  All messages comply with the Kenya Information and Communications Act, the Data
                  Protection Act 2019, and all applicable regulations of the Communications
                  Authority of Kenya (CA).
                </li>
                <li>
                  You will not use the Service to send spam, unsolicited marketing, fraudulent
                  communications, or content that promotes illegal activity.
                </li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mt-6 mb-2">
                3.2 Client Liability for Content
              </h3>
              <p className="text-muted-foreground mb-2">
                <strong>3.2.1</strong> You are SOLELY and EXCLUSIVELY responsible for all content
                transmitted through the Bulk SMS Service. TalkSasa acts solely as a technology
                conduit and bears no responsibility whatsoever for the content, accuracy, legality,
                or consequences of messages sent by Clients.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>3.2.2</strong> You shall fully indemnify, defend, and hold harmless TalkSasa
                from any claims, penalties, fines, damages, or legal costs arising from messages
                sent through your account, including third-party claims.
              </p>
              <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-foreground font-medium">
                  TalkSasa will cooperate fully with law enforcement and regulatory authorities in
                  investigations involving Client use of the SMS Service.
                </p>
              </div>

              <h3 className="text-lg font-medium text-foreground mt-6 mb-2">3.3 Sender ID Registration</h3>
              <p className="text-muted-foreground mb-2">
                <strong>3.3.1</strong> Sender ID registration is subject to approval by the
                Communications Authority of Kenya. TalkSasa does not guarantee approval and is not
                liable for rejection by the CA or mobile network operators.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>3.3.2</strong> Sender IDs are registered for specific, declared use cases.
                Use of a registered Sender ID for any purpose other than the declared use case is a
                material breach of these Terms and may result in immediate suspension.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>3.3.3</strong> Sender ID registration fees are non-refundable once submitted
                to the CA or network operators, regardless of the outcome.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>3.3.4</strong> The Client is responsible for ensuring the accuracy of all
                information submitted for Sender ID registration. TalkSasa is not liable for
                rejection, delays, or penalties arising from inaccurate client-submitted information.
              </p>

              <h3 className="text-lg font-medium text-foreground mt-6 mb-2">3.4 Prohibited Content</h3>
              <p className="text-muted-foreground mb-2">
                The following content is strictly prohibited and will result in immediate account
                suspension and potential legal referral:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>
                  Political or electoral campaigning not authorized by the Independent Electoral and
                  Boundaries Commission (IEBC).
                </li>
                <li>Content promoting terrorism, violence, or illegal activities.</li>
                <li>Financial fraud, phishing, or impersonation of any entity.</li>
                <li>Content targeting minors with inappropriate material.</li>
                <li>Defamatory, obscene, or harassing content.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. Domain Registration Services
              </h2>

              <h3 className="text-lg font-medium text-foreground mt-6 mb-2">4.1 Role of TalkSasa</h3>
              <p className="text-muted-foreground">
                TalkSasa acts as a domain registration facilitator. Domain registration is
                ultimately governed by ICANN, the Kenya Network Information Centre (KENIC), and
                other relevant registry authorities. TalkSasa does not guarantee domain availability
                and is not liable for refusal of registration by any registry.
              </p>

              <h3 className="text-lg font-medium text-foreground mt-6 mb-2">
                4.2 Domain Renewal — Client Obligations (Critical)
              </h3>
              <div className="mb-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-foreground font-medium">
                  This section is of the utmost importance. Read carefully.
                </p>
              </div>
              <p className="text-muted-foreground mb-2">
                <strong>4.2.1</strong> Domain registration is time-limited and requires periodic
                renewal. IT IS THE CLIENT&apos;S SOLE AND ABSOLUTE RESPONSIBILITY to monitor domain
                expiry dates and initiate renewal in a timely manner.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>4.2.2</strong> TalkSasa may, at its discretion and as a courtesy only, send
                renewal reminder communications via email or SMS to the Client&apos;s registered
                contact details. Such reminders are provided as a goodwill gesture ONLY and do not
                constitute a contractual obligation.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>4.2.3 Confirmation of Renewal:</strong> A domain is considered renewed ONLY
                upon receipt by the Client of an official written Renewal Confirmation from
                TalkSasa. This confirmation will be sent to the Client&apos;s registered email
                address upon successful completion of the renewal process and full receipt of
                payment.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>4.2.4</strong> If you have NOT received a Renewal Confirmation, your domain
                has NOT been successfully renewed. In that case, you MUST immediately contact
                TalkSasa at{" "}
                <a href="mailto:info@talksasa.com" className="text-primary hover:underline">
                  info@talksasa.com
                </a>{" "}
                or call +254 712 295 880 / +254 781 000 403 to verify and complete the renewal.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>4.2.5</strong> TalkSasa shall bear NO liability whatsoever for domain
                expiry, loss, deletion, or reacquisition by third parties arising from the
                Client&apos;s failure to: pay renewal fees before the expiry date; follow up to
                obtain a Renewal Confirmation; maintain up-to-date contact information with
                TalkSasa; respond to renewal reminder communications.
              </p>
              <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-foreground font-medium">
                  TalkSasa will not be held responsible for domain loss under any circumstances if
                  the Client cannot produce a written Renewal Confirmation issued by TalkSasa.
                </p>
              </div>
              <p className="text-muted-foreground mt-4 mb-2">
                <strong>4.2.6</strong> Domains that expire enter a Redemption Grace Period as
                determined by the registry. Recovery of expired domains during or after this period
                may incur significant additional fees, which shall be borne entirely by the Client.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>4.2.7</strong> TalkSasa reserves the right to release, delete, or allow a
                third party to register an expired domain after the applicable grace period without
                further notice to the Client.
              </p>

              <h3 className="text-lg font-medium text-foreground mt-6 mb-2">4.3 Domain Ownership and Transfer</h3>
              <p className="text-muted-foreground mb-2">
                <strong>4.3.1</strong> Domains are registered in the Client&apos;s name. TalkSasa
                does not claim ownership over Client domains.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>4.3.2</strong> Domain transfers to another registrar must be initiated by
                the Client following the applicable transfer policy. Transfer fees may apply.
                TalkSasa is not liable for delays caused by registry processing times.
              </p>
              <p className="text-muted-foreground">
                <strong>4.3.3</strong> The Client is responsible for maintaining accurate
                WHOIS/registrant information. Provision of false registration details is a breach
                of ICANN/KENIC policy and these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                5. Web &amp; Email Hosting Services
              </h2>

              <h3 className="text-lg font-medium text-foreground mt-6 mb-2">5.1 Service Provision</h3>
              <p className="text-muted-foreground">
                TalkSasa will use commercially reasonable efforts to provide hosting services with
                high availability. However, TalkSasa does not guarantee uninterrupted, error-free,
                or 100% uptime for hosting services. Scheduled and unscheduled maintenance may cause
                temporary service interruptions.
              </p>

              <h3 className="text-lg font-medium text-foreground mt-6 mb-2">5.2 Client Data Responsibilities</h3>
              <p className="text-muted-foreground mb-2">
                <strong>5.2.1</strong> You are solely responsible for all content, data, and files
                hosted on TalkSasa servers. TalkSasa does not review hosted content and is not
                liable for the accuracy, legality, or appropriateness of Client content.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>5.2.2</strong> You must maintain regular, independent backups of all hosted
                data. While TalkSasa may perform server-level backups, these are for disaster
                recovery purposes only and are not guaranteed. TalkSasa is not liable for any data
                loss.
              </p>

              <h3 className="text-lg font-medium text-foreground mt-6 mb-2">5.3 Hosting Renewal Obligations</h3>
              <p className="text-muted-foreground mb-2">
                <strong>5.3.1</strong> Hosting services are subscription-based and must be renewed
                before the expiry date. The same renewal confirmation requirement described in
                Section 4.2 applies to hosting renewals.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>5.3.2</strong> Hosting accounts that are not renewed will be suspended upon
                expiry. Data on suspended accounts will be held for a maximum of 7 days before
                permanent deletion. TalkSasa is not liable for data loss resulting from non-renewal.
              </p>
              <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-foreground font-medium">
                  If you have not received a Hosting Renewal Confirmation, your service has not been
                  renewed. Contact TalkSasa immediately.
                </p>
              </div>

              <h3 className="text-lg font-medium text-foreground mt-6 mb-2">5.4 Prohibited Use of Hosting</h3>
              <p className="text-muted-foreground mb-2">
                Hosting services may not be used to host:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Illegal, defamatory, or obscene content.</li>
                <li>Content that infringes third-party intellectual property rights.</li>
                <li>Malware, phishing pages, or hacking tools.</li>
                <li>Cryptocurrency mining scripts.</li>
                <li>Content that excessively consumes server resources to the detriment of other users.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Payment Terms</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>
                  <strong>6.1</strong> All payments for TalkSasa Services are due in advance unless
                  expressly agreed otherwise in writing.
                </li>
                <li>
                  <strong>6.2</strong> All fees are non-refundable once a Service has been
                  provisioned, activated, or submitted to a third-party provider (including
                  registries, networks, or operators), unless expressly stated otherwise.
                </li>
                <li>
                  <strong>6.3</strong> TalkSasa reserves the right to suspend or terminate Services
                  immediately upon non-payment without further notice.
                </li>
                <li>
                  <strong>6.4</strong> Prices are subject to change at TalkSasa&apos;s discretion.
                  Current pricing will be communicated to Clients before renewal.
                </li>
                <li>
                  <strong>6.5</strong> Any disputes regarding invoices must be raised in writing
                  within 7 days of invoice issuance. Disputes raised after this period will not be
                  entertained, and the invoice shall be deemed accepted.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Suspension and Termination</h2>
              <p className="text-muted-foreground mb-2">
                <strong>7.1</strong> TalkSasa reserves the right to immediately suspend or terminate
                your account and access to all Services, without notice or liability, in the event
                of:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Breach of any provision of these Terms.</li>
                <li>Non-payment of outstanding fees.</li>
                <li>Engagement in fraudulent, illegal, or abusive activities.</li>
                <li>Receipt of valid legal orders from courts or regulatory authorities.</li>
                <li>
                  Actions that jeopardize the security or reputation of TalkSasa&apos;s
                  infrastructure or other clients.
                </li>
              </ul>
              <p className="text-muted-foreground mt-4 mb-2">
                <strong>7.2</strong> Upon termination, all rights granted to you under these Terms
                immediately cease. TalkSasa is not obligated to provide data export or migration
                assistance after termination.
              </p>
              <p className="text-muted-foreground">
                <strong>7.3</strong> Fees paid prior to termination are non-refundable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-2">
                <strong>8.1</strong> To the maximum extent permitted by applicable law, TalkSasa,
                its directors, employees, agents, partners, and affiliates shall not be liable for
                any: indirect, incidental, special, consequential, or punitive damages; loss of
                profits, revenue, data, business, or goodwill; service interruptions, downtime, or
                data loss; unauthorized access to Client accounts or data; failure of domain
                renewal or hosting services due to Client non-compliance with Section 4 and Section
                5; actions or decisions of third-party registries, networks, operators, or
                regulatory bodies.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>8.2</strong> In all cases where TalkSasa is found liable, TalkSasa&apos;s
                total aggregate liability shall not exceed the total fees paid by the Client for the
                specific Service giving rise to the claim in the three (3) months immediately
                preceding the event giving rise to liability.
              </p>
              <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-foreground font-medium">
                  TalkSasa&apos;s liability is strictly capped. You waive all rights to seek damages
                  beyond this cap.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to indemnify, defend, and hold harmless TalkSasa and its officers,
                directors, employees, agents, and partners from and against any and all claims,
                damages, losses, liabilities, costs, and expenses (including reasonable legal fees)
                arising out of or related to: your use or misuse of any TalkSasa Service; content
                you send, host, or register through TalkSasa; your breach of these Terms; your
                violation of any applicable law or third-party right; any claim by a third party
                arising from your use of the SMS Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Force Majeure</h2>
              <p className="text-muted-foreground">
                TalkSasa shall not be liable for any failure or delay in performance due to
                circumstances beyond its reasonable control, including but not limited to: acts of
                God, government actions, network failures, power outages, cyber-attacks, strikes,
                pandemics, or decisions by third-party registries or mobile network operators.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Confidentiality</h2>
              <p className="text-muted-foreground mb-2">
                <strong>11.1</strong> Both parties agree to keep confidential any proprietary or
                sensitive information shared during the course of the business relationship.
              </p>
              <p className="text-muted-foreground">
                <strong>11.2</strong> TalkSasa will not disclose Client information to third
                parties except: (a) as required by law or court order; (b) to enforce these Terms;
                or (c) with the Client&apos;s explicit written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                12. Governing Law and Dispute Resolution
              </h2>
              <p className="text-muted-foreground mb-2">
                <strong>12.1</strong> These Terms shall be governed by and construed in accordance
                with the laws of the Republic of Kenya.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>12.2</strong> Any dispute arising from or related to these Terms or the
                Services shall first be subject to good-faith negotiations between the parties for
                a period of 30 days.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>12.3</strong> If unresolved, disputes shall be referred to binding
                arbitration under the Nairobi Centre for International Arbitration (NCIA) Rules.
                The seat of arbitration shall be Nairobi, Kenya. The language shall be English.
              </p>
              <p className="text-muted-foreground">
                <strong>12.4</strong> Nothing in this clause prevents TalkSasa from seeking urgent
                injunctive or equitable relief from a competent court.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                13. Entire Agreement and Severability
              </h2>
              <p className="text-muted-foreground mb-2">
                <strong>13.1</strong> These Terms, together with any applicable service order or
                invoice, constitute the entire agreement between you and TalkSasa with respect to
                the Services and supersede all prior agreements, representations, or understandings.
              </p>
              <p className="text-muted-foreground mb-2">
                <strong>13.2</strong> If any provision of these Terms is found to be unenforceable,
                the remaining provisions shall continue in full force and effect.
              </p>
              <p className="text-muted-foreground">
                <strong>13.3</strong> TalkSasa&apos;s failure to enforce any right under these
                Terms shall not constitute a waiver of that right.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">14. Contact Information</h2>
              <p className="text-muted-foreground">
                For any questions, complaints, or notices under these Terms, contact TalkSasa at:
              </p>
              <p className="mt-4 text-muted-foreground">
                Email:{" "}
                <a href="mailto:info@talksasa.com" className="text-primary hover:underline">
                  info@talksasa.com
                </a>
                <br />
                Phone: +254 712 295 880 | +254 781 000 403
                <br />
                Website: www.talksasa.com
              </p>
              <p className="mt-4 text-muted-foreground">
                These Terms and Conditions were last updated on 10th August 2024.
              </p>
            </section>
          </div>

          <footer className="mt-16 pt-8 border-t border-border text-center">
            <Button asChild variant="outline">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </footer>
        </article>
      </main>
      <Footer />
    </div>
  );
}

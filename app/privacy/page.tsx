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
    { "@type": "ListItem", position: 2, name: "Privacy Policy", item: `${SITE_URL}/privacy` },
  ],
};

export const metadata: Metadata = {
  title: "Privacy Policy | Data Protection & Your Rights",
  description:
    "TalkSasa Privacy Policy. Learn how we collect, use, store, and protect your personal data in compliance with the Kenya Data Protection Act 2019. Your rights and how to contact us.",
  keywords: [
    "TalkSasa privacy policy",
    "data protection Kenya",
    "Kenya Data Protection Act",
    "TalkSasa GDPR",
    "privacy policy Kenya",
  ],
  openGraph: {
    title: "Privacy Policy",
    description:
      "How TalkSasa collects, uses, and protects your personal data. Compliant with Kenya Data Protection Act 2019.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com"}/privacy`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com"}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Script
        id="breadcrumb-schema-privacy"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      <main id="main-content" className="pt-24 pb-20">
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <header className="mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Privacy <span className="gradient-text">Policy</span>
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
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-12">
            <p className="text-muted-foreground leading-relaxed">
              This Privacy Policy explains how TalkSasa Ltd collects, uses, stores, protects, and
              discloses personal data in compliance with the Kenya Data Protection Act No. 24 of
              2019, the Kenya Information and Communications Act, and all applicable regulations. By
              using any TalkSasa service, you consent to the practices described in this Policy.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Who We Are</h2>
              <p className="text-muted-foreground">
                TalkSasa Ltd (&quot;TalkSasa,&quot; &quot;We,&quot; &quot;Us&quot;) is a technology
                company registered in Kenya providing Bulk SMS, Sender ID Registration, Domain
                Registration, Business Email, Application Hosting, and Reseller Hosting services. We are a data controller in
                respect of personal data collected from our clients and website visitors.
              </p>
              <p className="mt-4 text-muted-foreground">
                <strong>Data Controller Contact:</strong>
                <br />
                Email:{" "}
                <a href="mailto:info@talksasa.com" className="text-primary hover:underline">
                  info@talksasa.com
                </a>
                <br />
                Phone: +254 712 295 880 | +254 781 000 403
                <br />
                Website: www.talksasa.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. Personal Data We Collect
              </h2>

              <h3 className="text-lg font-medium text-foreground mt-6 mb-2">2.1 Data You Provide Directly</h3>
              <p className="text-muted-foreground mb-2">
                When you register, purchase a service, or contact us, we may collect:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Full name and identity information.</li>
                <li>Business name and registration details.</li>
                <li>Email address, phone number, and physical/postal address.</li>
                <li>
                  Payment information (processed securely; TalkSasa does not store full card
                  numbers).
                </li>
                <li>
                  Domain registrant/WHOIS details (name, address, email, phone — as required by
                  ICANN/KENIC).
                </li>
                <li>
                  Sender ID registration details including business registration documents and
                  use-case declarations.
                </li>
                <li>Content and data uploaded to hosting accounts.</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mt-6 mb-2">2.2 Data Collected Automatically</h3>
              <p className="text-muted-foreground mb-2">
                When you visit our website, we automatically collect:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>IP address and browser type.</li>
                <li>Pages visited, time spent, and referring URLs.</li>
                <li>Cookies and similar tracking data (see Section 9).</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mt-6 mb-2">2.3 Data from Third Parties</h3>
              <p className="text-muted-foreground">
                We may receive data about you from payment processors, domain registries, or mobile
                network operators in the course of providing Services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Data</h2>
              <p className="text-muted-foreground mb-2">
                We process your personal data strictly for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>To provision, manage, and maintain the Services you have subscribed to.</li>
                <li>
                  To communicate service updates, renewal notices, invoices, and support
                  information.
                </li>
                <li>
                  To comply with domain registration requirements of ICANN, KENIC, and other
                  registries (WHOIS publication).
                </li>
                <li>To process payments and prevent fraud.</li>
                <li>
                  To comply with legal obligations, including requests from law enforcement and
                  regulatory authorities.
                </li>
                <li>To enforce our Terms and Conditions.</li>
                <li>To improve our services and website experience.</li>
              </ul>
              <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-foreground font-medium">
                  We do not sell, rent, or trade your personal data to third parties for their
                  marketing purposes.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. Legal Basis for Processing
              </h2>
              <p className="text-muted-foreground mb-2">
                Under the Kenya Data Protection Act 2019, our processing is based on:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>
                  <strong>Contract Performance:</strong> Processing necessary to deliver the
                  Services you have purchased.
                </li>
                <li>
                  <strong>Legal Obligation:</strong> Processing required to comply with Kenyan
                  law, court orders, or regulatory requirements.
                </li>
                <li>
                  <strong>Legitimate Interests:</strong> Processing to detect fraud, enforce our
                  Terms, and maintain service security.
                </li>
                <li>
                  <strong>Consent:</strong> Where we rely on your consent (e.g., marketing
                  communications), you may withdraw consent at any time.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Disclosure of Your Data</h2>

              <h3 className="text-lg font-medium text-foreground mt-6 mb-2">
                5.1 Third-Party Service Providers
              </h3>
              <p className="text-muted-foreground mb-2">
                We share your data with trusted third parties solely to provide our Services,
                including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>
                  Domain registries (ICANN-accredited, KENIC) — for domain registration and
                  WHOIS publication.
                </li>
                <li>Mobile network operators — for Sender ID registration and SMS delivery.</li>
                <li>Payment processors — for secure transaction processing.</li>
                <li>
                  Hosting infrastructure providers — for data center and server operations.
                </li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                All third-party providers are contractually required to handle your data in
                compliance with applicable data protection laws.
              </p>

              <h3 className="text-lg font-medium text-foreground mt-6 mb-2">
                5.2 Legal and Regulatory Disclosure
              </h3>
              <p className="text-muted-foreground mb-2">
                TalkSasa will disclose Client data to government authorities, law enforcement,
                courts, or regulatory bodies when:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Required by a valid court order, subpoena, or legal process under Kenyan law.</li>
                <li>Required by the Communications Authority of Kenya or other competent authority.</li>
                <li>Necessary to prevent, detect, or investigate fraud or illegal activity.</li>
                <li>Required to protect the rights, safety, or property of TalkSasa or third parties.</li>
              </ul>
              <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-foreground font-medium">
                  TalkSasa is legally obligated to comply with valid legal orders and will do so
                  without prior notice to the Client where the law so permits.
                </p>
              </div>

              <h3 className="text-lg font-medium text-foreground mt-6 mb-2">5.3 Business Transfers</h3>
              <p className="text-muted-foreground">
                In the event of a merger, acquisition, or asset sale, your personal data may be
                transferred as part of the transaction. We will notify you by email or a prominent
                notice on our website before your data is transferred and becomes subject to a
                different privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                6. Domain WHOIS Data — Special Notice
              </h2>
              <p className="text-muted-foreground mb-2">
                6.1 Domain registration requires the publication of registrant contact details in
                publicly accessible WHOIS databases maintained by ICANN, KENIC, or other registries.
                By registering a domain through TalkSasa, you acknowledge and consent to this
                mandatory publication.
              </p>
              <p className="text-muted-foreground mb-2">
                6.2 Where available, WHOIS privacy/proxy services may be offered. These are subject
                to the policies of the relevant registry and are not guaranteed.
              </p>
              <p className="text-muted-foreground">
                6.3 TalkSasa is not liable for any consequences arising from the public disclosure
                of WHOIS data as required by registry policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Data Retention</h2>
              <p className="text-muted-foreground mb-2">
                We retain your personal data for as long as necessary to provide the Services and
                fulfill the purposes in this Policy, subject to the following:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>
                  Account data is retained for the duration of your active account plus a minimum
                  of 5 years after account closure, for legal and audit purposes.
                </li>
                <li>
                  Transaction and billing records are retained for a minimum of 7 years in
                  compliance with Kenyan tax and financial regulations.
                </li>
                <li>
                  SMS logs and message metadata may be retained for up to 1 year for compliance
                  and audit purposes.
                </li>
                <li>
                  Hosting account data is purged 7 days after account suspension due to
                  non-renewal, as stated in our Terms and Conditions.
                </li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                After the applicable retention period, data is securely deleted or anonymized.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Data Security</h2>
              <p className="text-muted-foreground mb-2">
                TalkSasa implements appropriate technical and organizational measures to protect
                your personal data against unauthorized access, disclosure, alteration, or
                destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Encryption of sensitive data in transit and at rest.</li>
                <li>Access controls and authentication protocols for staff accessing client data.</li>
                <li>Regular security assessments of our infrastructure.</li>
                <li>Secure payment processing via PCI-DSS compliant payment gateways.</li>
              </ul>
              <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-foreground font-medium">
                  No method of electronic transmission or storage is 100% secure. While we take
                  reasonable precautions, TalkSasa cannot guarantee absolute security. You transmit
                  data to us at your own risk.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                9. Cookies and Tracking Technologies
              </h2>
              <p className="text-muted-foreground mb-2">
                Our website uses cookies and similar tracking technologies to improve your
                experience. Cookies we use include:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>
                  <strong>Essential Cookies:</strong> Necessary for the website to function.
                  Cannot be disabled.
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how visitors interact
                  with our website (e.g., Google Analytics). These are anonymized.
                </li>
                <li>
                  <strong>Preference Cookies:</strong> Remember your settings and preferences.
                </li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                You can control cookies through your browser settings. Disabling certain cookies
                may impact website functionality. By continuing to use our website, you consent
                to our use of cookies as described in this Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Your Data Rights</h2>
              <p className="text-muted-foreground mb-2">
                Under the Kenya Data Protection Act 2019, you have the following rights:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>
                  <strong>Right of Access:</strong> To request a copy of the personal data we
                  hold about you.
                </li>
                <li>
                  <strong>Right to Rectification:</strong> To request correction of inaccurate
                  or incomplete data.
                </li>
                <li>
                  <strong>Right to Erasure:</strong> To request deletion of your data, subject
                  to legal retention obligations.
                </li>
                <li>
                  <strong>Right to Restrict Processing:</strong> To request that we limit how we
                  use your data.
                </li>
                <li>
                  <strong>Right to Data Portability:</strong> To receive your data in a
                  structured, machine-readable format.
                </li>
                <li>
                  <strong>Right to Object:</strong> To object to processing based on legitimate
                  interests.
                </li>
                <li>
                  <strong>Right to Withdraw Consent:</strong> Where processing is based on
                  consent, to withdraw it at any time without affecting prior processing.
                </li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                To exercise any of these rights, submit a written request to{" "}
                <a href="mailto:info@talksasa.com" className="text-primary hover:underline">
                  info@talksasa.com
                </a>
                . We will respond within 21 days. We may require identity verification before
                processing requests.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Children&apos;s Privacy</h2>
              <p className="text-muted-foreground">
                TalkSasa Services are not directed at or intended for individuals under the age of
                18. We do not knowingly collect personal data from children. If we become aware
                that we have inadvertently collected data from a minor, we will delete it
                promptly. If you believe a minor has submitted data to us, please contact us
                immediately at{" "}
                <a href="mailto:info@talksasa.com" className="text-primary hover:underline">
                  info@talksasa.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                12. Third-Party Links and Services
              </h2>
              <p className="text-muted-foreground">
                Our website may contain links to third-party websites or services. TalkSasa is not
                responsible for the privacy practices or content of those third parties. We
                encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                13. Changes to This Privacy Policy
              </h2>
              <p className="text-muted-foreground">
                TalkSasa reserves the right to update or modify this Privacy Policy at any time.
                Changes will be posted on our website at www.talksasa.com with a revised effective
                date. Your continued use of our Services after any changes constitutes your
                acceptance of the updated Policy. We encourage you to review this Policy
                periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                14. Complaints and Regulatory Authority
              </h2>
              <p className="text-muted-foreground mb-2">
                If you believe your data protection rights have been violated, you may lodge a
                complaint with:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>
                  TalkSasa directly at{" "}
                  <a href="mailto:info@talksasa.com" className="text-primary hover:underline">
                    info@talksasa.com
                  </a>{" "}
                  — we will endeavor to resolve complaints within 21 business days.
                </li>
                <li>
                  The Office of the Data Protection Commissioner (ODPC), Kenya — the supervisory
                  authority for data protection in Kenya (
                  <a
                    href="https://www.odpc.go.ke"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    www.odpc.go.ke
                  </a>
                  ).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                15. Contact the Data Controller
              </h2>
              <p className="text-muted-foreground">
                For all privacy-related queries, requests, or concerns, contact TalkSasa at:
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
                This Privacy Policy was last updated on 10th August 2024.
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

import { ProductLanding } from "@/components/product-landing";
import { EmailHostingPlans } from "@/components/email-hosting/email-hosting-plans";
import { PRODUCT_PAGES, buildProductMetadata } from "@/lib/cloud-content";

const page = PRODUCT_PAGES["email-hosting"];

export const metadata = buildProductMetadata(page);

const EMAIL_FAQS = [
  {
    question: "Can I use my existing .co.ke domain for business email?",
    answer:
      "Yes. Choose “I have a domain”, enter the FQDN, pick a plan, and checkout. Talksasa Cloud locks that domain to the email service line so you can complete account setup and payment on the portal.",
  },
  {
    question: "Should I register the domain and email together?",
    answer:
      "Recommended. Adding domain registration and email hosting in the same cart lets MX, SPF, DKIM and DMARC helpers be applied automatically after payment.",
  },
  {
    question: "What webmail do I get?",
    answer:
      "Plans run on a Mailcow stack with webmail (including SOGo where enabled on the product). Exact mailbox, alias, and quota limits are shown on each live plan.",
  },
  {
    question: "Can I pay with M-Pesa?",
    answer:
      "Yes. Checkout continues on Talksasa Cloud where M-Pesa STK push and other payment methods are available for Kenyan customers.",
  },
];

export default function EmailHostingPage() {
  return (
    <ProductLanding
      page={page}
      relatedFaqs={EMAIL_FAQS}
      afterHero={
        <div className="py-16 sm:py-20 border-b border-border">
          <EmailHostingPlans />
        </div>
      }
    />
  );
}

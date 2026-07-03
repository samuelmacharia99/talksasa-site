import { ProductLanding } from "@/components/product-landing";
import { SMSCalculator } from "@/components/sms-calculator";
import { PRODUCT_PAGES, buildProductMetadata, FAQ_ITEMS } from "@/lib/cloud-content";

const page = PRODUCT_PAGES["bulk-sms"];

export const metadata = buildProductMetadata(page);

export default function BulkSmsPage() {
  const faqs = FAQ_ITEMS.filter((f) =>
    f.question.toLowerCase().includes("sms") || f.answer.toLowerCase().includes("sms")
  );
  return (
    <ProductLanding
      page={page}
      relatedFaqs={faqs}
      afterHero={
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SMSCalculator />
        </section>
      }
    />
  );
}

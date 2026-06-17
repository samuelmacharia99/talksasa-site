import { ProductLanding } from "@/components/product-landing";
import { PRODUCT_PAGES, buildProductMetadata, FAQ_ITEMS } from "@/lib/cloud-content";

const page = PRODUCT_PAGES["bulk-sms"];

export const metadata = buildProductMetadata(page);

export default function BulkSmsPage() {
  const faqs = FAQ_ITEMS.filter((f) =>
    f.question.toLowerCase().includes("sms") || f.answer.toLowerCase().includes("sms")
  );
  return <ProductLanding page={page} relatedFaqs={faqs} />;
}

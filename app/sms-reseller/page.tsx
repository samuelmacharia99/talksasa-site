import { ProductLanding } from "@/components/product-landing";
import { PRODUCT_PAGES, buildProductMetadata, FAQ_ITEMS } from "@/lib/cloud-content";

const page = PRODUCT_PAGES["sms-reseller"];

export const metadata = buildProductMetadata(page);

export default function SmsResellerPage() {
  const faqs = FAQ_ITEMS.filter((f) => {
    const q = f.question.toLowerCase();
    return q.includes("sms reseller") || q.includes("white-label bulk sms");
  });
  return <ProductLanding page={page} relatedFaqs={faqs} />;
}

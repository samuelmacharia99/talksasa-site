import { ProductLanding } from "@/components/product-landing";
import { PRODUCT_PAGES, buildProductMetadata, FAQ_ITEMS } from "@/lib/cloud-content";

const page = PRODUCT_PAGES.mpesa;

export const metadata = buildProductMetadata(page);

export default function MpesaPaymentsPage() {
  const faqs = FAQ_ITEMS.filter((f) => f.question.toLowerCase().includes("m-pesa"));
  return <ProductLanding page={page} relatedFaqs={faqs} />;
}

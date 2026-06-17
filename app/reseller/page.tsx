import { ProductLanding } from "@/components/product-landing";
import { PRODUCT_PAGES, buildProductMetadata, FAQ_ITEMS } from "@/lib/cloud-content";

const page = PRODUCT_PAGES.reseller;

export const metadata = buildProductMetadata(page);

export default function ResellerPage() {
  const faqs = FAQ_ITEMS.filter((f) =>
    f.question.toLowerCase().includes("reseller") || f.question.toLowerCase().includes("white-label")
  );
  return <ProductLanding page={page} relatedFaqs={faqs} />;
}

import { ProductLanding } from "@/components/product-landing";
import { PRODUCT_PAGES, buildProductMetadata, FAQ_ITEMS } from "@/lib/cloud-content";

const page = PRODUCT_PAGES.domains;

export const metadata = buildProductMetadata(page);

export default function DomainsPage() {
  const faqs = FAQ_ITEMS.filter((f) =>
    [".co.ke", "domain"].some((k) => f.question.toLowerCase().includes(k) || f.answer.toLowerCase().includes("domain"))
  );
  return <ProductLanding page={page} relatedFaqs={faqs.length ? faqs : [FAQ_ITEMS[2]]} />;
}

import { ProductLanding } from "@/components/product-landing";
import { PRODUCT_PAGES, buildProductMetadata, FAQ_ITEMS } from "@/lib/cloud-content";

const page = PRODUCT_PAGES["cloud-hosting"];

export const metadata = buildProductMetadata(page);

export default function CloudHostingPage() {
  const faqs = FAQ_ITEMS.filter((f) =>
    ["Laravel", "Node", "provision"].some((k) =>
      f.question.toLowerCase().includes(k.toLowerCase()) || f.answer.toLowerCase().includes(k.toLowerCase())
    )
  );
  return <ProductLanding page={page} relatedFaqs={faqs} />;
}

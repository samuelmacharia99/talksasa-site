import { ProductLanding } from "@/components/product-landing";
import { PRODUCT_PAGES, buildProductMetadata, FAQ_ITEMS } from "@/lib/cloud-content";

const page = PRODUCT_PAGES["reseller-hosting"];

export const metadata = buildProductMetadata(page);

export default function ResellerHostingPage() {
  const faqs = FAQ_ITEMS.filter((f) => {
    const text = `${f.question} ${f.answer}`.toLowerCase();
    return (
      text.includes("reseller hosting") ||
      text.includes("hosting reseller") ||
      text.includes("white-label reseller") ||
      text.includes("white label hosting")
    );
  });
  return <ProductLanding page={page} relatedFaqs={faqs} />;
}

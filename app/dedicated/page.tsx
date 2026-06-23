import { ProductLanding } from "@/components/product-landing";
import { PRODUCT_PAGES, buildProductMetadata } from "@/lib/cloud-content";

const page = PRODUCT_PAGES.dedicated;

export const metadata = buildProductMetadata(page);

export default function DedicatedPage() {
  return <ProductLanding page={page} />;
}

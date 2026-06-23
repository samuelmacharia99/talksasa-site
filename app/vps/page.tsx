import { ProductLanding } from "@/components/product-landing";
import { PRODUCT_PAGES, buildProductMetadata } from "@/lib/cloud-content";

const page = PRODUCT_PAGES.vps;

export const metadata = buildProductMetadata(page);

export default function VpsPage() {
  return <ProductLanding page={page} />;
}

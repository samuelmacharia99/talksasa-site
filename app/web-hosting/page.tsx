import { ProductLanding } from "@/components/product-landing";
import { PRODUCT_PAGES, buildProductMetadata } from "@/lib/cloud-content";

const page = PRODUCT_PAGES["web-hosting"];

export const metadata = buildProductMetadata(page);

export default function WebHostingPage() {
  return <ProductLanding page={page} />;
}

import { ProductLanding } from "@/components/product-landing";
import { PRODUCT_PAGES, buildProductMetadata } from "@/lib/cloud-content";

const page = PRODUCT_PAGES.servers;

export const metadata = buildProductMetadata(page);

export default function ServersPage() {
  return <ProductLanding page={page} />;
}

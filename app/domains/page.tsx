import { DomainsLanding } from "@/components/domains/domains-landing";
import { PRODUCT_PAGES, buildProductMetadata } from "@/lib/cloud-content";

export const metadata = buildProductMetadata(PRODUCT_PAGES.domains);

export default function DomainsPage() {
  return <DomainsLanding />;
}

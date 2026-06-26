import { ResellerHostingLanding } from "@/components/reseller/reseller-hosting-landing";
import { PRODUCT_PAGES, buildProductMetadata } from "@/lib/cloud-content";

export const metadata = buildProductMetadata(PRODUCT_PAGES["reseller-hosting"]);

export default function ResellerHostingPage() {
  return <ResellerHostingLanding />;
}

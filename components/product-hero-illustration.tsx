"use client";

import type { ComponentType } from "react";
import type { ProductPageSlug } from "@/lib/cloud-content";
import { DomainSearchDesign } from "@/components/hero-illustrations/domain-search-design";
import { PipelineDesign } from "@/components/hero-illustrations/pipeline-design";
import { HostingServerDesign } from "@/components/hero-illustrations/hosting-server-design";
import { SmsBroadcastDesign, SmsResellerDesign } from "@/components/hero-illustrations/sms-broadcast-design";
import { ServerRackDesign } from "@/components/hero-illustrations/server-rack-design";
import { ResellerBrandDesign } from "@/components/hero-illustrations/reseller-brand-design";
import { MpesaStkDesign } from "@/components/hero-illustrations/mpesa-stk-design";

type IllustrationProps = { compact?: boolean };

const PRODUCT_HERO_MAP: Record<ProductPageSlug, ComponentType<IllustrationProps>> = {
  domains: DomainSearchDesign,
  "cloud-hosting": PipelineDesign,
  vps: ServerRackDesign,
  dedicated: ServerRackDesign,
  servers: ServerRackDesign,
  reseller: ResellerBrandDesign,
  "reseller-hosting": ResellerBrandDesign,
  "sms-reseller": SmsResellerDesign,
  mpesa: MpesaStkDesign,
  "bulk-sms": SmsBroadcastDesign,
  "email-hosting": HostingServerDesign,
};

export function ProductHeroIllustration({ slug }: { slug: ProductPageSlug }) {
  const Illustration = PRODUCT_HERO_MAP[slug];
  return (
    <div className="w-full max-w-md mx-auto lg:max-w-none h-[240px] sm:h-[300px] md:h-[320px] lg:h-[380px] overflow-hidden">
      <Illustration compact />
    </div>
  );
}

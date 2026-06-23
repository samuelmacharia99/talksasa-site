export type BillingCycle = "monthly" | "quarterly" | "semi-annual" | "annual";

export type ServiceType =
  | "shared_hosting"
  | "vps"
  | "dedicated_server"
  | "container_hosting"
  | "domain";

export type PlatformService = {
  id: number;
  name: string;
  description: string | null;
  type: ServiceType;
  category: string;
  monthly_price: number;
  yearly_price: number | null;
  setup_fee: number;
  currency: string;
  billing_cycles: BillingCycle[];
  features: string[] | null;
};

export type ServicesResponse = {
  success: boolean;
  currency: string;
  services: PlatformService[];
};

export type DomainExtension = {
  extension: string;
  description: string;
  period_years: number;
  price: number;
  currency: string;
};

export type DomainExtensionsResponse = {
  success: boolean;
  period_years: number;
  currency: string;
  extensions: DomainExtension[];
  checkout_url: string;
};

export type DomainSearchResult = {
  domain: string;
  extension: string;
  full_domain: string;
  available: boolean;
  period_years: number;
  price: number;
  currency: string;
  checkout_url: string;
};

export type DomainSearchResponse = {
  success: boolean;
  query: string;
  period_years: number;
  currency: string;
  checkout_url: string;
  results: DomainSearchResult[];
};

export type CartDomainItem = {
  type: "domain";
  full_domain: string;
  years: number;
};

export type CartServiceItem = {
  type: "service";
  product_id: number;
  billing_cycle: BillingCycle;
};

export type CartItem = CartDomainItem | CartServiceItem;

export type CartRequest = {
  items: CartItem[];
};

export type CloudProductTab = "hosting" | "vps" | "dedicated" | "cloud";

export const CLOUD_PRODUCT_LABELS: Record<CloudProductTab, string> = {
  hosting: "Web Hosting",
  vps: "VPS",
  dedicated: "Dedicated Servers",
  cloud: "Application Hosting",
};

export const SERVICE_TYPES_BY_TAB: Record<CloudProductTab, ServiceType[]> = {
  hosting: ["shared_hosting"],
  vps: ["vps"],
  dedicated: ["dedicated_server"],
  cloud: ["container_hosting"],
};

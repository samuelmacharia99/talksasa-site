export type BillingCycle = "monthly" | "quarterly" | "semi-annual" | "annual";

export type ResellerBillingCycle = "monthly" | "annual";

export type ServiceType =
  | "shared_hosting"
  | "vps"
  | "dedicated_server"
  | "container_hosting"
  | "email_hosting"
  | "domain";

export type LocationPrices = {
  monthly: number;
  quarterly: number;
  "semi-annual": number;
  annual: number;
  setup_fee: number;
  currency: string;
};

export type ServerLocation = {
  key: string;
  name: string;
  city: string | null;
  prices: LocationPrices;
};

export type ServerIpOption = {
  ip_count: number;
  monthly_addon: number;
  setup_addon: number;
  label: string;
};

export type ServerOperatingSystem = {
  key: string;
  label: string;
};

export type ServerConfiguration = {
  specs: {
    cpu_cores: number;
    ram_gb: number;
    storage_gb: number;
    storage_type: string | null;
    raid: string | null;
    bandwidth_tb: number | null;
    managed: boolean;
    money_back_days: number | null;
  };
  spec_lines: string[];
  locations: ServerLocation[];
  ip_options: ServerIpOption[];
  operating_systems: ServerOperatingSystem[];
  max_ip_count: number;
};

export type EmailHostingConfiguration = {
  mailboxes?: number;
  aliases?: number;
  quota_mb?: number;
  mailbox_quota_mb?: number;
  msgs_per_day?: number;
  requires_domain?: boolean;
  webmail?: boolean;
  driver?: string;
};

export type PlatformService = {
  id: number;
  name: string;
  description: string | null;
  type: ServiceType | string;
  /** Container hosting runtime, e.g. laravel, nodejs (when exposed by billing API). */
  tech_stack?: string | null;
  category: string;
  monthly_price: number;
  yearly_price: number | null;
  setup_fee: number;
  currency: string;
  billing_cycles: BillingCycle[];
  features: string[] | null;
  configuration?: ServerConfiguration | EmailHostingConfiguration | null;
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
  transfer_price: number;
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

export type CartDomainTransferItem = {
  type: "domain_transfer";
  full_domain: string;
  epp_code: string;
  old_registrar: string;
  old_registrar_url?: string;
};

export type CartServiceItem = {
  type: "service";
  product_id: number;
  billing_cycle: BillingCycle;
  location_key?: string;
  ip_count?: number;
  operating_system?: string;
  /** Existing FQDN for email hosting (or other domain-bound services). */
  domain?: string;
  full_domain?: string;
};

export type CartResellerPackageItem = {
  type: "reseller_package";
  reseller_package_id: number;
};

export type CartItem =
  | CartDomainItem
  | CartDomainTransferItem
  | CartServiceItem
  | CartResellerPackageItem;

export type CartRequest = {
  items: CartItem[];
};

export type ResellerPackage = {
  id: number;
  name: string;
  description: string;
  billing_cycle: ResellerBillingCycle;
  price: number;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  max_services: number;
  max_users: number;
  disk_pool_gb: number;
  disk_overage_rate: number;
  features: string[];
};

export type ResellerPackagesResponse = {
  success: boolean;
  currency: string;
  checkout_url: string;
  packages: ResellerPackage[];
};

export type CloudProductTab = "hosting" | "vps" | "dedicated" | "cloud" | "email";

export const CLOUD_PRODUCT_LABELS: Record<CloudProductTab, string> = {
  hosting: "Web Hosting",
  vps: "VPS",
  dedicated: "Dedicated Servers",
  cloud: "Application Hosting",
  email: "Email Hosting",
};

export const SERVICE_TYPES_BY_TAB: Record<CloudProductTab, ServiceType[]> = {
  hosting: ["shared_hosting"],
  vps: ["vps"],
  dedicated: ["dedicated_server"],
  cloud: ["container_hosting"],
  email: ["email_hosting"],
};

export function isEmailHostingPlan(plan: PlatformService): boolean {
  return plan.type === "email_hosting";
}

export function getEmailHostingConfig(
  plan: PlatformService
): EmailHostingConfiguration | null {
  if (!isEmailHostingPlan(plan) || !plan.configuration) return null;
  const config = plan.configuration;
  if (isServerConfiguration(config)) return null;
  return config;
}

export function isServerConfiguration(
  config: PlatformService["configuration"]
): config is ServerConfiguration {
  return !!config && Array.isArray((config as ServerConfiguration).locations);
}

export function asServerConfiguration(
  plan: PlatformService
): ServerConfiguration | null {
  if (!plan.configuration || !isServerConfiguration(plan.configuration)) return null;
  return plan.configuration;
}

export function isConfigurableServer(plan: PlatformService): boolean {
  return (
    (plan.type === "vps" || plan.type === "dedicated_server") &&
    !!asServerConfiguration(plan)
  );
}

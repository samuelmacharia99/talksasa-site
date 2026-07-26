import type { LucideIcon } from "lucide-react";
import {
  MessageSquare,
  Server,
  Container,
  Globe,
  Layers,
  Boxes,
  Code2,
  Users,
  Tag,
  Mail,
} from "lucide-react";
import { BULK_SMS_URL, HOSTING_URL } from "@/lib/urls";

export type PlatformPillarId = "messaging" | "hosting" | "applications";

export type PlatformPillar = {
  id: PlatformPillarId;
  icon: LucideIcon;
  label: string;
  detail: string;
  href: string;
  lineEnd: { x: number; y: number };
  positionClass: string;
  floatOffset: number;
};

export const PLATFORM_HUB = { x: 200, y: 190 };

export const platformPillars: PlatformPillar[] = [
  {
    id: "messaging",
    icon: MessageSquare,
    label: "Bulk SMS",
    detail: "Gateway & API",
    href: "/bulk-sms",
    lineEnd: { x: 80, y: 70 },
    positionClass: "top-4 left-2 sm:left-4",
    floatOffset: 0,
  },
  {
    id: "hosting",
    icon: Server,
    label: "Talksasa Cloud",
    detail: "Hosting & domains",
    href: "/web-hosting",
    lineEnd: { x: 310, y: 115 },
    positionClass: "top-6 right-2 sm:right-6",
    floatOffset: 1.2,
  },
  {
    id: "applications",
    icon: Container,
    label: "Application hosting",
    detail: "Laravel & Node.js",
    href: "/cloud-hosting",
    lineEnd: { x: 88, y: 318 },
    positionClass: "bottom-14 left-2 sm:left-6",
    floatOffset: 2.4,
  },
];

export const deployPipelineSteps = ["git push", "deploy", "live"] as const;

export type MegaMenuLink = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
};

export type MegaMenuGroup = {
  id: string;
  label: string;
  tagline: string;
  accent: string;
  items: MegaMenuLink[];
};

export const megaMenuGroups: MegaMenuGroup[] = [
  {
    id: "cloud",
    label: "Talksasa Cloud",
    tagline: "Hosting, domains & apps",
    accent: "from-violet-500/20 to-purple-500/10",
    items: [
      {
        icon: Server,
        title: "Web hosting",
        description: "DirectAdmin shared hosting with auto-provisioning.",
        href: "/web-hosting",
      },
      {
        icon: Globe,
        title: "Domains",
        description: "Register .co.ke, .com, transfer & manage DNS.",
        href: "/domains",
      },
      {
        icon: Mail,
        title: "Email hosting",
        description: "Business email on your domain with Mailcow webmail.",
        href: "/email-hosting",
      },
      {
        icon: Container,
        title: "Application hosting",
        description: "Laravel, Node.js, Python containers.",
        href: "/cloud-hosting",
      },
      {
        icon: Layers,
        title: "VPS",
        description: "Cloud VPS with full root access.",
        href: "/vps",
      },
      {
        icon: Server,
        title: "Dedicated servers",
        description: "Bare-metal performance for enterprise workloads.",
        href: "/dedicated",
      },
    ],
  },
  {
    id: "reseller",
    label: "Resellers",
    tagline: "White-label platform",
    accent: "from-fuchsia-500/20 to-pink-500/10",
    items: [
      {
        icon: Server,
        title: "Reseller hosting",
        description: "White-label hosting, domains, and cloud apps.",
        href: "/reseller-hosting",
      },
      {
        icon: Tag,
        title: "Become a reseller",
        description: "Your brand, pricing, and M-Pesa on our infra.",
        href: "/reseller",
      },
      {
        icon: Boxes,
        title: "Reseller portal",
        description: "Manage customers, wallet, and catalog.",
        href: HOSTING_URL,
      },
    ],
  },
  {
    id: "messaging",
    label: "Messaging",
    tagline: "Bulk SMS & API",
    accent: "from-sky-500/20 to-indigo-500/10",
    items: [
      {
        icon: MessageSquare,
        title: "Bulk SMS",
        description: "Marketing, alerts, 2FA — portal & API.",
        href: "/bulk-sms",
      },
      {
        icon: Code2,
        title: "SMS API",
        description: "2FA, OTP, and transactional SMS.",
        href: BULK_SMS_URL,
      },
      {
        icon: Users,
        title: "SMS reseller",
        description: "White-label SMS for agencies.",
        href: "/sms-reseller",
      },
    ],
  },
];

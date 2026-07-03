import type { Metadata } from "next";
import { ThankYouClient } from "@/components/thank-you-client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Your request was received. The TalkSasa team will follow up shortly.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/thank-you` },
};

type PageProps = {
  searchParams: { type?: string; open_whatsapp?: string };
};

export default function ThankYouPage({ searchParams }: PageProps) {
  const type = searchParams.type && ["contact", "demo", "exit_intent"].includes(searchParams.type)
    ? searchParams.type
    : "contact";

  return (
    <ThankYouClient
      type={type}
      openWhatsapp={searchParams.open_whatsapp === "1"}
    />
  );
}

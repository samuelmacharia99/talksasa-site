"use client";

import type { Attribution, LeadType } from "@/lib/leads/types";
import { getAttribution } from "@/lib/attribution";
import { trackLeadCaptured } from "@/components/analytics";

export type SubmitLeadInput = {
  type: LeadType;
  name?: string;
  email: string;
  phone?: string;
  service?: string;
  message?: string;
  metadata?: Record<string, string>;
  website?: string;
  attribution?: Attribution;
};

export type SubmitLeadResult =
  | { ok: true; id: string; redirect: string }
  | { ok: false; error: string };

export async function submitLead(input: SubmitLeadInput): Promise<SubmitLeadResult> {
  const attribution: Attribution = {
    ...getAttribution(),
    ...input.attribution,
    page_url: input.attribution?.page_url || (typeof window !== "undefined" ? window.location.href : undefined),
  };

  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: input.type,
      name: input.name,
      email: input.email,
      phone: input.phone,
      service: input.service,
      message: input.message,
      metadata: input.metadata,
      attribution,
      website: input.website ?? "",
    }),
  });

  const data = (await res.json()) as {
    success?: boolean;
    id?: string;
    redirect?: string;
    error?: string;
  };

  if (!res.ok || !data.success || !data.id) {
    return { ok: false, error: data.error || "Could not save your request" };
  }

  trackLeadCaptured(input.type, data.id);
  return { ok: true, id: data.id, redirect: data.redirect || `/thank-you?type=${input.type}` };
}

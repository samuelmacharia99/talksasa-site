export type LeadType = "contact" | "demo" | "exit_intent";

export type Attribution = {
  gclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  page_url?: string;
};

export type LeadPayload = {
  type: LeadType;
  name?: string;
  email: string;
  phone?: string;
  service?: string;
  message?: string;
  metadata?: Record<string, string>;
  attribution?: Attribution;
  /** Honeypot — must be empty */
  website?: string;
};

export type LeadRecord = {
  id: string;
  createdAt: string;
};

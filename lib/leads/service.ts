import { createHash, randomUUID } from "crypto";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import type { LeadPayload, LeadRecord } from "./types";

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || "talksasa-leads";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export async function createLead(payload: LeadPayload, ip: string): Promise<LeadRecord> {
  const db = await getDb();
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const attr = payload.attribution;

  await db.insert(leads).values({
    id,
    type: payload.type,
    name: payload.name ?? null,
    email: payload.email,
    phone: payload.phone ?? null,
    service: payload.service ?? null,
    message: payload.message ?? null,
    metadata: payload.metadata ? JSON.stringify(payload.metadata) : null,
    gclid: attr?.gclid ?? null,
    utmSource: attr?.utm_source ?? null,
    utmMedium: attr?.utm_medium ?? null,
    utmCampaign: attr?.utm_campaign ?? null,
    utmTerm: attr?.utm_term ?? null,
    utmContent: attr?.utm_content ?? null,
    pageUrl: attr?.page_url ?? null,
    ipHash: hashIp(ip),
    status: "new",
    createdAt,
  });

  return { id, createdAt };
}

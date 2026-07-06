import { createHash, randomUUID } from "crypto";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { logActivity } from "./activities";
import { findDuplicateLead } from "./duplicates";
import { notifyNewLead } from "@/lib/email/notify";
import { computeLeadScore } from "./score";
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
  const score = computeLeadScore(payload);
  const duplicate = await findDuplicateLead(payload.email, payload.phone);

  await db.insert(leads).values({
    id,
    type: payload.type,
    name: payload.name ?? null,
    email: payload.email.trim().toLowerCase(),
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
    score,
    duplicateOf: duplicate?.id ?? null,
    createdAt,
  });

  await logActivity(id, "created", `Lead captured via ${payload.type} form`, {
    score: String(score),
  });

  if (duplicate) {
    await logActivity(id, "duplicate_linked", `Linked to previous lead ${duplicate.email}`, {
      original_id: duplicate.id,
    });
    await logActivity(duplicate.id, "duplicate_linked", `Duplicate submission from ${payload.email}`, {
      duplicate_id: id,
    });
  }

  void notifyNewLead(id).catch(() => undefined);

  return { id, createdAt };
}

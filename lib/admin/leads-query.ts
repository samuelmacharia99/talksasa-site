import { desc, eq, sql } from "drizzle-orm";
import type { ResultSetHeader } from "mysql2";
import { getDb } from "@/lib/db";
import { leads, type Lead } from "@/lib/db/schema";

export type LeadListItem = {
  id: string;
  type: Lead["type"];
  name: string | null;
  email: string;
  phone: string | null;
  service: string | null;
  message: string | null;
  metadata: Record<string, string> | null;
  gclid: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  pageUrl: string | null;
  status: string;
  createdAt: string;
};

export type LeadsListResult = {
  leads: LeadListItem[];
  total: number;
  page: number;
  pageSize: number;
};

const VALID_STATUSES = new Set(["new", "contacted", "converted"]);

function mapLead(row: Lead): LeadListItem {
  let metadata: Record<string, string> | null = null;
  if (row.metadata) {
    try {
      metadata = JSON.parse(row.metadata) as Record<string, string>;
    } catch {
      metadata = null;
    }
  }

  return {
    id: row.id,
    type: row.type,
    name: row.name,
    email: row.email,
    phone: row.phone,
    service: row.service,
    message: row.message,
    metadata,
    gclid: row.gclid,
    utmSource: row.utmSource,
    utmMedium: row.utmMedium,
    utmCampaign: row.utmCampaign,
    pageUrl: row.pageUrl,
    status: row.status,
    createdAt: row.createdAt,
  };
}

export async function listLeads(page = 1, pageSize = 25, type?: string): Promise<LeadsListResult> {
  const db = await getDb();
  const safePage = Math.max(1, page);
  const safeSize = Math.min(100, Math.max(1, pageSize));
  const offset = (safePage - 1) * safeSize;

  const typeFilter =
    type && ["contact", "demo", "exit_intent"].includes(type)
      ? eq(leads.type, type as Lead["type"])
      : undefined;

  const rows = await db
    .select()
    .from(leads)
    .where(typeFilter)
    .orderBy(desc(leads.createdAt))
    .limit(safeSize)
    .offset(offset);

  const [countRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(leads)
    .where(typeFilter);

  return {
    leads: rows.map(mapLead),
    total: Number(countRow?.count ?? 0),
    page: safePage,
    pageSize: safeSize,
  };
}

export async function updateLeadStatus(id: string, status: string): Promise<boolean> {
  if (!VALID_STATUSES.has(status)) return false;
  const db = await getDb();
  const [result] = await db.update(leads).set({ status: status as Lead["status"] }).where(eq(leads.id, id));
  const header = result as ResultSetHeader;
  return header.affectedRows > 0;
}

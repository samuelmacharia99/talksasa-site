import { and, desc, eq, like, or, sql, gte, lte } from "drizzle-orm";
import type { ResultSetHeader } from "mysql2";
import { randomUUID } from "crypto";
import { getDb } from "@/lib/db";
import { leads, leadNotes, type Lead, type LeadNote } from "@/lib/db/schema";

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

export type LeadStats = {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  byStatus: { new: number; contacted: number; converted: number };
  byType: { contact: number; demo: number; exit_intent: number };
  bySource: { google_ads: number; organic: number; direct: number };
};

export type NoteItem = {
  id: string;
  content: string;
  createdAt: string;
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

type ListFilters = {
  type?: string;
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
};

function buildFilters(filters: ListFilters) {
  const conditions = [];

  if (filters.type && ["contact", "demo", "exit_intent"].includes(filters.type)) {
    conditions.push(eq(leads.type, filters.type as Lead["type"]));
  }

  if (filters.status && VALID_STATUSES.has(filters.status)) {
    conditions.push(eq(leads.status, filters.status as Lead["status"]));
  }

  if (filters.search) {
    const term = `%${filters.search}%`;
    conditions.push(
      or(
        like(leads.name, term),
        like(leads.email, term),
        like(leads.phone, term),
        like(leads.service, term),
        like(leads.message, term)
      )
    );
  }

  if (filters.dateFrom) {
    conditions.push(gte(leads.createdAt, filters.dateFrom));
  }

  if (filters.dateTo) {
    conditions.push(lte(leads.createdAt, filters.dateTo + "T23:59:59.999Z"));
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

export async function listLeads(
  page = 1,
  pageSize = 25,
  type?: string,
  filters?: Omit<ListFilters, "type">
): Promise<LeadsListResult> {
  const db = await getDb();
  const safePage = Math.max(1, page);
  const safeSize = Math.min(100, Math.max(1, pageSize));
  const offset = (safePage - 1) * safeSize;

  const where = buildFilters({ type, ...filters });

  const rows = await db
    .select()
    .from(leads)
    .where(where)
    .orderBy(desc(leads.createdAt))
    .limit(safeSize)
    .offset(offset);

  const [countRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(leads)
    .where(where);

  return {
    leads: rows.map(mapLead),
    total: Number(countRow?.count ?? 0),
    page: safePage,
    pageSize: safeSize,
  };
}

export async function getLeadById(id: string): Promise<LeadListItem | null> {
  const db = await getDb();
  const rows = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  if (rows.length === 0) return null;
  return mapLead(rows[0]);
}

export async function updateLeadStatus(id: string, status: string): Promise<boolean> {
  if (!VALID_STATUSES.has(status)) return false;
  const db = await getDb();
  const [result] = await db
    .update(leads)
    .set({ status: status as Lead["status"] })
    .where(eq(leads.id, id));
  const header = result as ResultSetHeader;
  return header.affectedRows > 0;
}

export async function deleteLead(id: string): Promise<boolean> {
  const db = await getDb();
  await db.delete(leadNotes).where(eq(leadNotes.leadId, id));
  const [result] = await db.delete(leads).where(eq(leads.id, id));
  const header = result as ResultSetHeader;
  return header.affectedRows > 0;
}

export async function getLeadNotes(leadId: string): Promise<NoteItem[]> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(leadNotes)
    .where(eq(leadNotes.leadId, leadId))
    .orderBy(desc(leadNotes.createdAt));
  return rows.map((r) => ({ id: r.id, content: r.content, createdAt: r.createdAt }));
}

export async function addLeadNote(leadId: string, content: string): Promise<NoteItem> {
  const db = await getDb();
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  await db.insert(leadNotes).values({ id, leadId, content, createdAt });
  return { id, content, createdAt };
}

export async function deleteNote(noteId: string): Promise<boolean> {
  const db = await getDb();
  const [result] = await db.delete(leadNotes).where(eq(leadNotes.id, noteId));
  const header = result as ResultSetHeader;
  return header.affectedRows > 0;
}

export async function getLeadStats(): Promise<LeadStats> {
  const db = await getDb();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [totalRow] = await db.select({ count: sql<number>`count(*)` }).from(leads);
  const [todayRow] = await db.select({ count: sql<number>`count(*)` }).from(leads).where(gte(leads.createdAt, todayStart));
  const [weekRow] = await db.select({ count: sql<number>`count(*)` }).from(leads).where(gte(leads.createdAt, weekStart));
  const [monthRow] = await db.select({ count: sql<number>`count(*)` }).from(leads).where(gte(leads.createdAt, monthStart));

  const statusRows = await db
    .select({ status: leads.status, count: sql<number>`count(*)` })
    .from(leads)
    .groupBy(leads.status);

  const typeRows = await db
    .select({ type: leads.type, count: sql<number>`count(*)` })
    .from(leads)
    .groupBy(leads.type);

  const [adsRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(leads)
    .where(sql`${leads.gclid} IS NOT NULL AND ${leads.gclid} != ''`);

  const [utmRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(leads)
    .where(
      and(
        or(eq(leads.gclid, ""), sql`${leads.gclid} IS NULL`),
        sql`${leads.utmSource} IS NOT NULL AND ${leads.utmSource} != ''`
      )
    );

  const total = Number(totalRow?.count ?? 0);
  const adsCount = Number(adsRow?.count ?? 0);
  const utmCount = Number(utmRow?.count ?? 0);

  const byStatus = { new: 0, contacted: 0, converted: 0 };
  for (const row of statusRows) {
    if (row.status in byStatus) byStatus[row.status as keyof typeof byStatus] = Number(row.count);
  }

  const byType = { contact: 0, demo: 0, exit_intent: 0 };
  for (const row of typeRows) {
    if (row.type in byType) byType[row.type as keyof typeof byType] = Number(row.count);
  }

  return {
    total,
    today: Number(todayRow?.count ?? 0),
    thisWeek: Number(weekRow?.count ?? 0),
    thisMonth: Number(monthRow?.count ?? 0),
    byStatus,
    byType,
    bySource: {
      google_ads: adsCount,
      organic: utmCount,
      direct: total - adsCount - utmCount,
    },
  };
}

export async function exportLeadsCsv(filters?: ListFilters): Promise<string> {
  const db = await getDb();
  const where = filters ? buildFilters(filters) : undefined;
  const rows = await db.select().from(leads).where(where).orderBy(desc(leads.createdAt));

  const headers = [
    "Date", "Type", "Status", "Name", "Email", "Phone",
    "Service", "Message", "GCLID", "UTM Source", "UTM Medium",
    "UTM Campaign", "Page URL",
  ];

  const csvRows = rows.map((row) => [
    row.createdAt,
    row.type,
    row.status,
    row.name ?? "",
    row.email,
    row.phone ?? "",
    row.service ?? "",
    (row.message ?? "").replace(/[\n\r]+/g, " "),
    row.gclid ?? "",
    row.utmSource ?? "",
    row.utmMedium ?? "",
    row.utmCampaign ?? "",
    row.pageUrl ?? "",
  ]);

  function escapeCsv(value: string): string {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  return [
    headers.join(","),
    ...csvRows.map((row) => row.map(escapeCsv).join(",")),
  ].join("\n");
}

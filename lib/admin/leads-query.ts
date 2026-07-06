import { and, desc, eq, like, or, sql, gte, lte, isNull } from "drizzle-orm";
import type { ResultSetHeader } from "mysql2";
import { randomUUID } from "crypto";
import { getDb } from "@/lib/db";
import {
  leads,
  leadNotes,
  leadActivities,
  leadReminders,
  type Lead,
} from "@/lib/db/schema";
import { logActivity } from "@/lib/leads/activities";
import { getSlaWarnMinutes, getAdminAssignees } from "@/lib/email/config";
import { scoreLabel } from "@/lib/leads/score";

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
  score: number;
  scoreLabel: "hot" | "warm" | "cold";
  assignedTo: string | null;
  contactedAt: string | null;
  convertedAt: string | null;
  duplicateOf: string | null;
  confirmationSentAt: string | null;
  createdAt: string;
  minutesSinceCreated: number;
  slaBreached: boolean;
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
  staleCount: number;
  avgResponseMinutes: number | null;
  emailConfigured: boolean;
  assignees: string[];
};

export type CampaignRow = {
  campaign: string;
  source: string;
  leads: number;
  contacted: number;
  converted: number;
  conversionRate: number;
};

export type ReminderItem = {
  id: string;
  leadId: string;
  leadName: string | null;
  leadEmail: string;
  content: string;
  remindAt: string;
  completedAt: string | null;
  createdAt: string;
  overdue: boolean;
};

export type NoteItem = {
  id: string;
  content: string;
  createdAt: string;
};

const VALID_STATUSES = new Set(["new", "contacted", "converted"]);

function minutesSince(iso: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60_000));
}

function mapLead(row: Lead): LeadListItem {
  let metadata: Record<string, string> | null = null;
  if (row.metadata) {
    try {
      metadata = JSON.parse(row.metadata) as Record<string, string>;
    } catch {
      metadata = null;
    }
  }

  const mins = minutesSince(row.createdAt);
  const slaBreached = row.status === "new" && mins >= getSlaWarnMinutes();

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
    score: row.score,
    scoreLabel: scoreLabel(row.score),
    assignedTo: row.assignedTo,
    contactedAt: row.contactedAt,
    convertedAt: row.convertedAt,
    duplicateOf: row.duplicateOf,
    confirmationSentAt: row.confirmationSentAt,
    createdAt: row.createdAt,
    minutesSinceCreated: mins,
    slaBreached,
  };
}

type ListFilters = {
  type?: string;
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  assignedTo?: string;
  priority?: string;
  staleOnly?: boolean;
};

function buildFilters(filters: ListFilters) {
  const conditions = [];

  if (filters.type && ["contact", "demo", "exit_intent"].includes(filters.type)) {
    conditions.push(eq(leads.type, filters.type as Lead["type"]));
  }

  if (filters.status && VALID_STATUSES.has(filters.status)) {
    conditions.push(eq(leads.status, filters.status as Lead["status"]));
  }

  if (filters.assignedTo) {
    if (filters.assignedTo === "__unassigned__") {
      conditions.push(or(isNull(leads.assignedTo), eq(leads.assignedTo, "")));
    } else {
      conditions.push(eq(leads.assignedTo, filters.assignedTo));
    }
  }

  if (filters.priority === "hot") {
    conditions.push(gte(leads.score, 60));
  } else if (filters.priority === "warm") {
    conditions.push(and(gte(leads.score, 35), lte(leads.score, 59)));
  }

  if (filters.staleOnly) {
    const cutoff = new Date(Date.now() - getSlaWarnMinutes() * 60_000).toISOString();
    conditions.push(eq(leads.status, "new"));
    conditions.push(lte(leads.createdAt, cutoff));
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
    .orderBy(desc(leads.score), desc(leads.createdAt))
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

export async function updateLead(
  id: string,
  updates: { status?: string; assignedTo?: string | null }
): Promise<boolean> {
  const db = await getDb();
  const existing = await getLeadById(id);
  if (!existing) return false;

  const patch: Partial<Lead> = {};
  const now = new Date().toISOString();

  if (updates.status !== undefined) {
    if (!VALID_STATUSES.has(updates.status)) return false;
    patch.status = updates.status as Lead["status"];
    if (updates.status === "contacted" && !existing.contactedAt) {
      patch.contactedAt = now;
    }
    if (updates.status === "converted") {
      patch.convertedAt = now;
      if (!existing.contactedAt) patch.contactedAt = now;
    }
    if (updates.status !== existing.status) {
      await logActivity(id, "status_changed", `Status changed to ${updates.status}`, {
        from: existing.status,
        to: updates.status,
      });
    }
  }

  if (updates.assignedTo !== undefined) {
    patch.assignedTo = updates.assignedTo || null;
    if (updates.assignedTo !== existing.assignedTo) {
      await logActivity(
        id,
        "assigned",
        updates.assignedTo
          ? `Assigned to ${updates.assignedTo}`
          : "Assignment cleared"
      );
    }
  }

  if (Object.keys(patch).length === 0) return true;

  const [result] = await db.update(leads).set(patch).where(eq(leads.id, id));
  const header = result as ResultSetHeader;
  return header.affectedRows > 0;
}

export async function updateLeadStatus(id: string, status: string): Promise<boolean> {
  return updateLead(id, { status });
}

export async function deleteLead(id: string): Promise<boolean> {
  const db = await getDb();
  await db.delete(leadNotes).where(eq(leadNotes.leadId, id));
  await db.delete(leadActivities).where(eq(leadActivities.leadId, id));
  await db.delete(leadReminders).where(eq(leadReminders.leadId, id));
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
  await logActivity(leadId, "note_added", content.slice(0, 200));
  return { id, content, createdAt };
}

export async function deleteNote(noteId: string): Promise<boolean> {
  const db = await getDb();
  const [result] = await db.delete(leadNotes).where(eq(leadNotes.id, noteId));
  const header = result as ResultSetHeader;
  return header.affectedRows > 0;
}

export async function addReminder(
  leadId: string,
  content: string,
  remindAt: string
): Promise<ReminderItem | null> {
  const lead = await getLeadById(leadId);
  if (!lead) return null;

  const db = await getDb();
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  await db.insert(leadReminders).values({ id, leadId, content, remindAt, createdAt });
  await logActivity(leadId, "reminder_set", `Follow-up scheduled: ${content}`, { remind_at: remindAt });

  return {
    id,
    leadId,
    leadName: lead.name,
    leadEmail: lead.email,
    content,
    remindAt,
    completedAt: null,
    createdAt,
    overdue: new Date(remindAt).getTime() < Date.now(),
  };
}

export async function completeReminder(reminderId: string): Promise<boolean> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(leadReminders)
    .where(eq(leadReminders.id, reminderId))
    .limit(1);
  const reminder = rows[0];
  if (!reminder || reminder.completedAt) return false;

  const now = new Date().toISOString();
  const [result] = await db
    .update(leadReminders)
    .set({ completedAt: now })
    .where(eq(leadReminders.id, reminderId));
  const header = result as ResultSetHeader;
  if (header.affectedRows > 0) {
    await logActivity(reminder.leadId, "reminder_completed", `Reminder completed: ${reminder.content}`);
  }
  return header.affectedRows > 0;
}

export async function listReminders(includeCompleted = false): Promise<ReminderItem[]> {
  const db = await getDb();
  const rows = await db
    .select({
      id: leadReminders.id,
      leadId: leadReminders.leadId,
      content: leadReminders.content,
      remindAt: leadReminders.remindAt,
      completedAt: leadReminders.completedAt,
      createdAt: leadReminders.createdAt,
      leadName: leads.name,
      leadEmail: leads.email,
    })
    .from(leadReminders)
    .innerJoin(leads, eq(leadReminders.leadId, leads.id))
    .orderBy(leadReminders.remindAt);

  const now = Date.now();
  return rows
    .filter((r) => includeCompleted || !r.completedAt)
    .map((r) => ({
      id: r.id,
      leadId: r.leadId,
      leadName: r.leadName,
      leadEmail: r.leadEmail,
      content: r.content,
      remindAt: r.remindAt,
      completedAt: r.completedAt,
      createdAt: r.createdAt,
      overdue: !r.completedAt && new Date(r.remindAt).getTime() < now,
    }));
}

export async function getLeadStats(): Promise<LeadStats> {
  const db = await getDb();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const staleCutoff = new Date(Date.now() - getSlaWarnMinutes() * 60_000).toISOString();

  const [totalRow] = await db.select({ count: sql<number>`count(*)` }).from(leads);
  const [todayRow] = await db.select({ count: sql<number>`count(*)` }).from(leads).where(gte(leads.createdAt, todayStart));
  const [weekRow] = await db.select({ count: sql<number>`count(*)` }).from(leads).where(gte(leads.createdAt, weekStart));
  const [monthRow] = await db.select({ count: sql<number>`count(*)` }).from(leads).where(gte(leads.createdAt, monthStart));
  const [staleRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(leads)
    .where(and(eq(leads.status, "new"), lte(leads.createdAt, staleCutoff)));

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

  const responseRows = await db
    .select({ contactedAt: leads.contactedAt, createdAt: leads.createdAt })
    .from(leads)
    .where(sql`${leads.contactedAt} IS NOT NULL`);

  let avgResponseMinutes: number | null = null;
  if (responseRows.length > 0) {
    const totalMs = responseRows.reduce((sum, row) => {
      const created = new Date(row.createdAt).getTime();
      const contacted = new Date(row.contactedAt!).getTime();
      return sum + Math.max(0, contacted - created);
    }, 0);
    avgResponseMinutes = Math.round(totalMs / responseRows.length / 60_000);
  }

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

  const { isEmailConfigured } = await import("@/lib/email/config");

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
    staleCount: Number(staleRow?.count ?? 0),
    avgResponseMinutes,
    emailConfigured: isEmailConfigured(),
    assignees: getAdminAssignees(),
  };
}

export async function getCampaignStats(): Promise<CampaignRow[]> {
  const db = await getDb();
  const rows = await db
    .select({
      campaign: leads.utmCampaign,
      source: leads.utmSource,
      status: leads.status,
      count: sql<number>`count(*)`,
    })
    .from(leads)
    .groupBy(leads.utmCampaign, leads.utmSource, leads.status);

  const map = new Map<string, CampaignRow>();

  for (const row of rows) {
    const campaign = row.campaign || "(no campaign)";
    const source = row.source || (row.campaign ? "utm" : "direct");
    const key = `${campaign}::${source}`;
    const existing = map.get(key) || {
      campaign,
      source,
      leads: 0,
      contacted: 0,
      converted: 0,
      conversionRate: 0,
    };
    const count = Number(row.count);
    existing.leads += count;
    if (row.status === "contacted") existing.contacted += count;
    if (row.status === "converted") existing.converted += count;
    map.set(key, existing);
  }

  return Array.from(map.values())
    .map((r) => ({
      ...r,
      conversionRate: r.leads > 0 ? Math.round((r.converted / r.leads) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.leads - a.leads);
}

export async function getDigestData(): Promise<{
  period: string;
  newLeads: number;
  demos: number;
  converted: number;
  staleLeads: { name: string | null; email: string; minutes: number }[];
  dueReminders: { leadName: string | null; content: string; remindAt: string }[];
}> {
  const db = await getDb();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const staleCutoff = new Date(Date.now() - getSlaWarnMinutes() * 60_000).toISOString();

  const recent = await db.select().from(leads).where(gte(leads.createdAt, since));
  const staleRows = await db
    .select({ name: leads.name, email: leads.email, createdAt: leads.createdAt })
    .from(leads)
    .where(and(eq(leads.status, "new"), lte(leads.createdAt, staleCutoff)))
    .orderBy(leads.createdAt)
    .limit(10);

  const reminders = await listReminders(false);
  const dueReminders = reminders
    .filter((r) => r.overdue || new Date(r.remindAt).getTime() <= Date.now() + 24 * 60 * 60 * 1000)
    .slice(0, 10);

  return {
    period: "last 24 hours",
    newLeads: recent.length,
    demos: recent.filter((l) => l.type === "demo").length,
    converted: recent.filter((l) => l.status === "converted").length,
    staleLeads: staleRows.map((r) => ({
      name: r.name,
      email: r.email,
      minutes: minutesSince(r.createdAt),
    })),
    dueReminders: dueReminders.map((r) => ({
      leadName: r.leadName,
      content: r.content,
      remindAt: r.remindAt,
    })),
  };
}

export async function exportLeadsCsv(filters?: ListFilters): Promise<string> {
  const db = await getDb();
  const where = filters ? buildFilters(filters) : undefined;
  const rows = await db.select().from(leads).where(where).orderBy(desc(leads.createdAt));

  const headers = [
    "Date", "Type", "Status", "Score", "Assigned To", "Name", "Email", "Phone",
    "Service", "Message", "GCLID", "UTM Source", "UTM Medium",
    "UTM Campaign", "Page URL", "Contacted At", "Converted At",
  ];

  const csvRows = rows.map((row) => [
    row.createdAt,
    row.type,
    row.status,
    String(row.score),
    row.assignedTo ?? "",
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
    row.contactedAt ?? "",
    row.convertedAt ?? "",
  ]);

  function escapeCsv(value: string): string {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  return [headers.join(","), ...csvRows.map((row) => row.map(escapeCsv).join(","))].join("\n");
}

export async function exportOfflineConversionsCsv(): Promise<string> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(leads)
    .where(
      and(
        eq(leads.status, "converted"),
        sql`${leads.gclid} IS NOT NULL AND ${leads.gclid} != ''`
      )
    )
    .orderBy(desc(leads.convertedAt));

  const headers = [
    "Google Click ID",
    "Conversion Name",
    "Conversion Time",
    "Conversion Value",
    "Conversion Currency",
  ];

  const csvRows = rows.map((row) => {
    const time = row.convertedAt || row.createdAt;
    const formatted = new Date(time)
      .toISOString()
      .replace("T", " ")
      .replace(/\.\d{3}Z$/, "+0000");
    return [row.gclid!, "Lead converted", formatted, "1", "KES"];
  });

  function escapeCsv(value: string): string {
    if (value.includes(",") || value.includes('"')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  return [headers.join(","), ...csvRows.map((row) => row.map(escapeCsv).join(","))].join("\n");
}

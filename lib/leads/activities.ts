import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { leadActivities, type LeadActivity } from "@/lib/db/schema";

export type ActivityType = LeadActivity["type"];

export type ActivityItem = {
  id: string;
  type: ActivityType;
  message: string;
  metadata: Record<string, string> | null;
  createdAt: string;
};

export async function logActivity(
  leadId: string,
  type: ActivityType,
  message: string,
  metadata?: Record<string, string>
): Promise<void> {
  const db = await getDb();
  await db.insert(leadActivities).values({
    id: randomUUID(),
    leadId,
    type,
    message,
    metadata: metadata ? JSON.stringify(metadata) : null,
    createdAt: new Date().toISOString(),
  });
}

export async function getLeadActivities(leadId: string): Promise<ActivityItem[]> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(leadActivities)
    .where(eq(leadActivities.leadId, leadId))
    .orderBy(desc(leadActivities.createdAt));

  return rows.map((row) => {
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
      message: row.message,
      metadata,
      createdAt: row.createdAt,
    };
  });
}

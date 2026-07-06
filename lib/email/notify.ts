import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { logActivity } from "@/lib/leads/activities";
import { getNotifyEmails, isEmailConfigured } from "./config";
import { sendEmail } from "./send";
import {
  digestEmail,
  leadConfirmationEmail,
  teamAlertEmail,
  type DigestData,
  type LeadEmailData,
} from "./templates";

function toLeadEmailData(row: {
  id: string;
  type: string;
  name: string | null;
  email: string;
  phone: string | null;
  service: string | null;
  message: string | null;
  metadata: string | null;
  gclid: string | null;
  utmSource: string | null;
  utmCampaign: string | null;
  pageUrl: string | null;
  score: number;
  createdAt: string;
}): LeadEmailData {
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
    utmCampaign: row.utmCampaign,
    pageUrl: row.pageUrl,
    score: row.score,
    createdAt: row.createdAt,
  };
}

export async function notifyNewLead(leadId: string): Promise<void> {
  if (!isEmailConfigured()) return;

  const db = await getDb();
  const rows = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
  const row = rows[0];
  if (!row) return;

  const data = toLeadEmailData(row);

  try {
    const team = teamAlertEmail(data);
    const sent = await sendEmail({ to: getNotifyEmails(), subject: team.subject, html: team.html });
    if (sent) {
      await logActivity(leadId, "email_sent", "Team alert email sent");
    }
  } catch {
    // don't block lead capture
  }

  try {
    const confirm = leadConfirmationEmail(data);
    const sent = await sendEmail({ to: data.email, subject: confirm.subject, html: confirm.html });
    if (sent) {
      await db
        .update(leads)
        .set({ confirmationSentAt: new Date().toISOString() })
        .where(eq(leads.id, leadId));
      await logActivity(leadId, "email_sent", "Confirmation email sent to lead");
    }
  } catch {
    // ignore
  }
}

export async function sendDigestEmail(data: DigestData): Promise<boolean> {
  if (!isEmailConfigured()) return false;
  const { subject, html } = digestEmail(data);
  return sendEmail({ to: getNotifyEmails(), subject, html });
}

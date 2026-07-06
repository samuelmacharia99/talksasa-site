import { CONTACT, SALES_EMAIL } from "@/lib/contact";
import { getSiteUrl } from "./config";

function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#1e293b;border-radius:12px;border:1px solid #334155;overflow:hidden;">
        <tr><td style="padding:24px 28px 8px;">
          <div style="font-size:18px;font-weight:700;color:#38bdf8;">TalkSasa</div>
          <div style="font-size:13px;color:#94a3b8;margin-top:4px;">${title}</div>
        </td></tr>
        <tr><td style="padding:8px 28px 28px;color:#e2e8f0;font-size:14px;line-height:1.6;">
          ${body}
        </td></tr>
        <tr><td style="padding:16px 28px;background:#0f172a;border-top:1px solid #334155;font-size:12px;color:#64748b;">
          ${CONTACT.address.display} · ${SALES_EMAIL}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function row(label: string, value: string): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:6px 0;color:#94a3b8;vertical-align:top;width:120px;">${label}</td>
    <td style="padding:6px 0;color:#f1f5f9;">${escapeHtml(value)}</td>
  </tr>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const TYPE_LABELS: Record<string, string> = {
  contact: "Contact form",
  demo: "Demo booking",
  exit_intent: "Exit offer",
};

export type LeadEmailData = {
  id: string;
  type: string;
  name: string | null;
  email: string;
  phone: string | null;
  service: string | null;
  message: string | null;
  metadata: Record<string, string> | null;
  gclid: string | null;
  utmSource: string | null;
  utmCampaign: string | null;
  pageUrl: string | null;
  score: number;
  createdAt: string;
};

export function teamAlertEmail(lead: LeadEmailData): { subject: string; html: string } {
  const site = getSiteUrl();
  const typeLabel = TYPE_LABELS[lead.type] || lead.type;
  const urgent = lead.type === "demo" ? "🔥 " : "";
  const metaRows = lead.metadata
    ? Object.entries(lead.metadata)
        .map(([k, v]) => row(k.replace(/_/g, " "), v))
        .join("")
    : "";

  const body = `
    <p style="margin:0 0 16px;">A new <strong>${escapeHtml(typeLabel)}</strong> lead just came in. Score: <strong>${lead.score}/100</strong>.</p>
    <table style="width:100%;border-collapse:collapse;">
      ${row("Name", lead.name || "—")}
      ${row("Email", lead.email)}
      ${row("Phone", lead.phone || "—")}
      ${row("Service", lead.service || "—")}
      ${row("Message", lead.message || "—")}
      ${metaRows}
      ${row("Campaign", lead.utmCampaign || lead.utmSource || "—")}
      ${row("GCLID", lead.gclid || "—")}
      ${row("Page", lead.pageUrl || "—")}
      ${row("Time", new Date(lead.createdAt).toLocaleString("en-KE", { timeZone: "Africa/Nairobi" }))}
    </table>
    <p style="margin:20px 0 0;">
      <a href="${site}/admin/leads" style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600;">
        Open in CRM
      </a>
    </p>`;

  return {
    subject: `${urgent}New ${typeLabel} lead — ${lead.name || lead.email}`,
    html: layout(`New ${typeLabel}`, body),
  };
}

export function leadConfirmationEmail(lead: LeadEmailData): { subject: string; html: string } {
  const site = getSiteUrl();
  const name = lead.name || "there";

  let headline = "We received your message";
  let detail = "Our team will get back to you within one business hour.";

  if (lead.type === "demo") {
    headline = "Your demo request is confirmed";
    const date = lead.metadata?.preferred_date;
    const time = lead.metadata?.preferred_time;
    detail = date
      ? `We've saved your preferred slot (${date}${time ? ` at ${time}` : ""}). Our team will confirm shortly.`
      : "We've saved your demo request. Our team will confirm your slot shortly.";
  } else if (lead.type === "exit_intent") {
    headline = "Your 100 free SMS units are on the way";
    detail = "Check your inbox shortly for signup details. We'll also reach out on the phone number you provided.";
  }

  const body = `
    <p style="margin:0 0 12px;">Hi ${escapeHtml(name)},</p>
    <p style="margin:0 0 12px;">${detail}</p>
    <p style="margin:0 0 12px;">Need help right away? Call us at <strong>${CONTACT.phones[0].display}</strong> or reply to this email.</p>
    <p style="margin:20px 0 0;">
      <a href="${site}" style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600;">
        Visit TalkSasa
      </a>
    </p>`;

  return {
    subject: `TalkSasa — ${headline}`,
    html: layout(headline, body),
  };
}

export type DigestData = {
  period: string;
  newLeads: number;
  demos: number;
  converted: number;
  staleLeads: { name: string | null; email: string; minutes: number }[];
  dueReminders: { leadName: string | null; content: string; remindAt: string }[];
};

export function digestEmail(data: DigestData): { subject: string; html: string } {
  const site = getSiteUrl();
  const staleRows = data.staleLeads.length
    ? data.staleLeads
        .map(
          (l) =>
            `<li style="margin:4px 0;">${escapeHtml(l.name || l.email)} — <strong>${l.minutes} min</strong> without contact</li>`
        )
        .join("")
    : "<li style='color:#94a3b8;'>No stale leads 🎉</li>";

  const reminderRows = data.dueReminders.length
    ? data.dueReminders
        .map(
          (r) =>
            `<li style="margin:4px 0;">${escapeHtml(r.leadName || "Lead")}: ${escapeHtml(r.content)}</li>`
        )
        .join("")
    : "<li style='color:#94a3b8;'>No reminders due</li>";

  const body = `
    <p style="margin:0 0 16px;">Here's your ${escapeHtml(data.period)} sales summary.</p>
    <table style="width:100%;margin-bottom:20px;">
      <tr>
        <td style="padding:12px;background:#0f172a;border-radius:8px;text-align:center;width:33%;">
          <div style="font-size:22px;font-weight:700;color:#38bdf8;">${data.newLeads}</div>
          <div style="font-size:11px;color:#94a3b8;">New leads</div>
        </td>
        <td style="padding:12px;background:#0f172a;border-radius:8px;text-align:center;width:33%;">
          <div style="font-size:22px;font-weight:700;color:#fbbf24;">${data.demos}</div>
          <div style="font-size:11px;color:#94a3b8;">Demos</div>
        </td>
        <td style="padding:12px;background:#0f172a;border-radius:8px;text-align:center;width:33%;">
          <div style="font-size:22px;font-weight:700;color:#34d399;">${data.converted}</div>
          <div style="font-size:11px;color:#94a3b8;">Converted</div>
        </td>
      </tr>
    </table>
    <h3 style="margin:0 0 8px;font-size:14px;color:#f87171;">Needs attention</h3>
    <ul style="margin:0 0 16px;padding-left:20px;">${staleRows}</ul>
    <h3 style="margin:0 0 8px;font-size:14px;color:#fbbf24;">Due reminders</h3>
    <ul style="margin:0 0 16px;padding-left:20px;">${reminderRows}</ul>
    <p style="margin:20px 0 0;">
      <a href="${site}/admin/leads" style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600;">
        Open CRM
      </a>
    </p>`;

  return {
    subject: `TalkSasa sales digest — ${data.newLeads} new, ${data.staleLeads.length} need follow-up`,
    html: layout("Sales digest", body),
  };
}

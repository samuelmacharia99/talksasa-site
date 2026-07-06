export type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
  secure: boolean;
};

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD &&
      process.env.NOTIFY_EMAIL_TO
  );
}

export function getSmtpConfig(): SmtpConfig | null {
  if (!isEmailConfigured()) return null;
  const port = Number(process.env.SMTP_PORT || "587");
  return {
    host: process.env.SMTP_HOST!,
    port,
    user: process.env.SMTP_USER!,
    password: process.env.SMTP_PASSWORD!,
    from: process.env.SMTP_FROM || `TalkSasa <${process.env.SMTP_USER}>`,
    secure: port === 465,
  };
}

export function getNotifyEmails(): string[] {
  const to = process.env.NOTIFY_EMAIL_TO || "";
  const cc = process.env.NOTIFY_EMAIL_CC || "";
  return [...to.split(","), ...cc.split(",")]
    .map((e) => e.trim())
    .filter(Boolean);
}

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com").replace(/\/$/, "");
}

export function getAdminAssignees(): string[] {
  const raw = process.env.ADMIN_ASSIGNEES || "Sales Team";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function getSlaWarnMinutes(): number {
  const n = Number(process.env.SLA_WARN_MINUTES || "30");
  return Number.isFinite(n) && n > 0 ? n : 30;
}

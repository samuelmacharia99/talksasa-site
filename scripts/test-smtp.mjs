/**
 * Send a test email via SMTP (container-safe, no curl).
 * Usage: npm run test:smtp
 * Requires: SMTP_HOST, SMTP_USER, SMTP_PASSWORD, NOTIFY_EMAIL_TO in .env
 */
import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || "587");
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASSWORD;
const to = process.env.NOTIFY_EMAIL_TO;
const from = process.env.SMTP_FROM || `TalkSasa <${user}>`;

if (!host || !user || !pass || !to) {
  console.error("Missing SMTP_HOST, SMTP_USER, SMTP_PASSWORD, or NOTIFY_EMAIL_TO");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
});

try {
  await transporter.verify();
  console.log("SMTP connection OK");

  const info = await transporter.sendMail({
    from,
    to: to.split(",")[0].trim(),
    subject: "TalkSasa SMTP test",
    text: "If you received this, SMTP is configured correctly.",
    html: "<p>If you received this, <strong>SMTP is configured correctly</strong>.</p>",
  });

  console.log("Test email sent:", info.messageId);
  console.log("To:", to.split(",")[0].trim());
} catch (err) {
  console.error("SMTP test failed:", err instanceof Error ? err.message : err);
  process.exit(1);
}

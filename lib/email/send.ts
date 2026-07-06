import nodemailer from "nodemailer";
import { getSmtpConfig } from "./config";

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const config = getSmtpConfig();
  if (!config) return false;

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.password },
  });

  const recipients = Array.isArray(input.to) ? input.to.join(", ") : input.to;

  await transporter.sendMail({
    from: config.from,
    to: recipients,
    subject: input.subject,
    html: input.html,
    text: input.text || stripHtml(input.html),
  });

  return true;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

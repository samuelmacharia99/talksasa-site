import { and, desc, eq, or, gte } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length > 9 ? digits.slice(-9) : digits;
}

export async function findDuplicateLead(
  email: string,
  phone?: string | null
): Promise<{ id: string; name: string | null; email: string } | null> {
  const db = await getDb();
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = phone ? normalizePhone(phone) : "";

  const conditions = [eq(leads.email, normalizedEmail)];
  if (normalizedPhone.length >= 9) {
    conditions.push(eq(leads.phone, phone!.trim()));
  }

  const rows = await db
    .select({ id: leads.id, name: leads.name, email: leads.email })
    .from(leads)
    .where(and(gte(leads.createdAt, since), or(...conditions)))
    .orderBy(desc(leads.createdAt))
    .limit(1);

  return rows[0] ?? null;
}

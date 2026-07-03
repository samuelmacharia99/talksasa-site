import { sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const leads = sqliteTable(
  "leads",
  {
    id: text("id").primaryKey(),
    type: text("type", { enum: ["contact", "demo", "exit_intent"] }).notNull(),
    name: text("name"),
    email: text("email").notNull(),
    phone: text("phone"),
    service: text("service"),
    message: text("message"),
    metadata: text("metadata"),
    gclid: text("gclid"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmTerm: text("utm_term"),
    utmContent: text("utm_content"),
    pageUrl: text("page_url"),
    ipHash: text("ip_hash"),
    status: text("status").notNull().default("new"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("leads_type_idx").on(table.type),
    index("leads_created_at_idx").on(table.createdAt),
    index("leads_email_idx").on(table.email),
  ]
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

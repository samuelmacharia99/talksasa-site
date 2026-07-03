import { index, mysqlEnum, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

export const leads = mysqlTable(
  "leads",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    type: mysqlEnum("type", ["contact", "demo", "exit_intent"]).notNull(),
    name: varchar("name", { length: 120 }),
    email: varchar("email", { length: 254 }).notNull(),
    phone: varchar("phone", { length: 30 }),
    service: varchar("service", { length: 80 }),
    message: text("message"),
    metadata: text("metadata"),
    gclid: varchar("gclid", { length: 120 }),
    utmSource: varchar("utm_source", { length: 120 }),
    utmMedium: varchar("utm_medium", { length: 120 }),
    utmCampaign: varchar("utm_campaign", { length: 120 }),
    utmTerm: varchar("utm_term", { length: 120 }),
    utmContent: varchar("utm_content", { length: 120 }),
    pageUrl: varchar("page_url", { length: 500 }),
    ipHash: varchar("ip_hash", { length: 64 }),
    status: mysqlEnum("status", ["new", "contacted", "converted"]).notNull().default("new"),
    createdAt: varchar("created_at", { length: 30 }).notNull(),
  },
  (table) => [
    index("leads_type_idx").on(table.type),
    index("leads_created_at_idx").on(table.createdAt),
    index("leads_email_idx").on(table.email),
  ]
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

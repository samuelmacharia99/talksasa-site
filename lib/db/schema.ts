import { index, int, mysqlEnum, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

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
    score: int("score").notNull().default(0),
    assignedTo: varchar("assigned_to", { length: 120 }),
    contactedAt: varchar("contacted_at", { length: 30 }),
    convertedAt: varchar("converted_at", { length: 30 }),
    duplicateOf: varchar("duplicate_of", { length: 36 }),
    confirmationSentAt: varchar("confirmation_sent_at", { length: 30 }),
    createdAt: varchar("created_at", { length: 30 }).notNull(),
  },
  (table) => [
    index("leads_type_idx").on(table.type),
    index("leads_created_at_idx").on(table.createdAt),
    index("leads_email_idx").on(table.email),
    index("leads_status_idx").on(table.status),
    index("leads_assigned_to_idx").on(table.assignedTo),
    index("leads_score_idx").on(table.score),
  ]
);

export const leadNotes = mysqlTable(
  "lead_notes",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    leadId: varchar("lead_id", { length: 36 }).notNull(),
    content: text("content").notNull(),
    createdAt: varchar("created_at", { length: 30 }).notNull(),
  },
  (table) => [
    index("lead_notes_lead_id_idx").on(table.leadId),
    index("lead_notes_created_at_idx").on(table.createdAt),
  ]
);

export const leadActivities = mysqlTable(
  "lead_activities",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    leadId: varchar("lead_id", { length: 36 }).notNull(),
    type: mysqlEnum("type", [
      "created",
      "status_changed",
      "note_added",
      "assigned",
      "reminder_set",
      "reminder_completed",
      "email_sent",
      "duplicate_linked",
    ]).notNull(),
    message: text("message").notNull(),
    metadata: text("metadata"),
    createdAt: varchar("created_at", { length: 30 }).notNull(),
  },
  (table) => [
    index("lead_activities_lead_id_idx").on(table.leadId),
    index("lead_activities_created_at_idx").on(table.createdAt),
  ]
);

export const leadReminders = mysqlTable(
  "lead_reminders",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    leadId: varchar("lead_id", { length: 36 }).notNull(),
    content: text("content").notNull(),
    remindAt: varchar("remind_at", { length: 30 }).notNull(),
    completedAt: varchar("completed_at", { length: 30 }),
    createdAt: varchar("created_at", { length: 30 }).notNull(),
  },
  (table) => [
    index("lead_reminders_lead_id_idx").on(table.leadId),
    index("lead_reminders_remind_at_idx").on(table.remindAt),
  ]
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type LeadNote = typeof leadNotes.$inferSelect;
export type LeadActivity = typeof leadActivities.$inferSelect;
export type LeadReminder = typeof leadReminders.$inferSelect;

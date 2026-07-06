ALTER TABLE `leads` ADD `score` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `leads` ADD `assigned_to` varchar(120);--> statement-breakpoint
ALTER TABLE `leads` ADD `contacted_at` varchar(30);--> statement-breakpoint
ALTER TABLE `leads` ADD `converted_at` varchar(30);--> statement-breakpoint
ALTER TABLE `leads` ADD `duplicate_of` varchar(36);--> statement-breakpoint
ALTER TABLE `leads` ADD `confirmation_sent_at` varchar(30);--> statement-breakpoint
CREATE INDEX `leads_status_idx` ON `leads` (`status`);--> statement-breakpoint
CREATE INDEX `leads_assigned_to_idx` ON `leads` (`assigned_to`);--> statement-breakpoint
CREATE INDEX `leads_score_idx` ON `leads` (`score`);--> statement-breakpoint
CREATE TABLE `lead_activities` (
	`id` varchar(36) NOT NULL,
	`lead_id` varchar(36) NOT NULL,
	`type` enum('created','status_changed','note_added','assigned','reminder_set','reminder_completed','email_sent','duplicate_linked') NOT NULL,
	`message` text NOT NULL,
	`metadata` text,
	`created_at` varchar(30) NOT NULL,
	CONSTRAINT `lead_activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `lead_activities_lead_id_idx` ON `lead_activities` (`lead_id`);--> statement-breakpoint
CREATE INDEX `lead_activities_created_at_idx` ON `lead_activities` (`created_at`);--> statement-breakpoint
CREATE TABLE `lead_reminders` (
	`id` varchar(36) NOT NULL,
	`lead_id` varchar(36) NOT NULL,
	`content` text NOT NULL,
	`remind_at` varchar(30) NOT NULL,
	`completed_at` varchar(30),
	`created_at` varchar(30) NOT NULL,
	CONSTRAINT `lead_reminders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `lead_reminders_lead_id_idx` ON `lead_reminders` (`lead_id`);--> statement-breakpoint
CREATE INDEX `lead_reminders_remind_at_idx` ON `lead_reminders` (`remind_at`);

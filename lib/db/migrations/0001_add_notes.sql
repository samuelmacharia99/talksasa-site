CREATE TABLE `lead_notes` (
	`id` varchar(36) NOT NULL,
	`lead_id` varchar(36) NOT NULL,
	`content` text NOT NULL,
	`created_at` varchar(30) NOT NULL,
	CONSTRAINT `lead_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `lead_notes_lead_id_idx` ON `lead_notes` (`lead_id`);--> statement-breakpoint
CREATE INDEX `lead_notes_created_at_idx` ON `lead_notes` (`created_at`);

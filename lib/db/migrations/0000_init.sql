CREATE TABLE `leads` (
	`id` varchar(36) NOT NULL,
	`type` enum('contact','demo','exit_intent') NOT NULL,
	`name` varchar(120),
	`email` varchar(254) NOT NULL,
	`phone` varchar(30),
	`service` varchar(80),
	`message` text,
	`metadata` text,
	`gclid` varchar(120),
	`utm_source` varchar(120),
	`utm_medium` varchar(120),
	`utm_campaign` varchar(120),
	`utm_term` varchar(120),
	`utm_content` varchar(120),
	`page_url` varchar(500),
	`ip_hash` varchar(64),
	`status` enum('new','contacted','converted') NOT NULL DEFAULT 'new',
	`created_at` varchar(30) NOT NULL,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `leads_type_idx` ON `leads` (`type`);--> statement-breakpoint
CREATE INDEX `leads_created_at_idx` ON `leads` (`created_at`);--> statement-breakpoint
CREATE INDEX `leads_email_idx` ON `leads` (`email`);

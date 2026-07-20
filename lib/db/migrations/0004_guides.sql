CREATE TABLE `guides` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(160) NOT NULL,
	`title` varchar(200) NOT NULL,
	`excerpt` text NOT NULL,
	`body` text NOT NULL,
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`seo_title` varchar(200),
	`seo_description` varchar(320),
	`cta_label` varchar(80),
	`cta_href` varchar(300),
	`published_at` varchar(30),
	`created_at` varchar(30) NOT NULL,
	`updated_at` varchar(30) NOT NULL,
	CONSTRAINT `guides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guides_slug_uidx` ON `guides` (`slug`);
--> statement-breakpoint
CREATE INDEX `guides_status_idx` ON `guides` (`status`);
--> statement-breakpoint
CREATE INDEX `guides_published_at_idx` ON `guides` (`published_at`);

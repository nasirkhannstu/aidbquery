ALTER TABLE `messages` ADD `content` text;--> statement-breakpoint
ALTER TABLE `messages` ADD `role` enum('system','user','assistant','function','data','tool') NOT NULL;--> statement-breakpoint
ALTER TABLE `messages` DROP COLUMN `text`;--> statement-breakpoint
ALTER TABLE `messages` DROP COLUMN `sender`;
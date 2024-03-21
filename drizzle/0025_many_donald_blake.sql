ALTER TABLE `users` ADD `first_name` varchar(32) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `last_name` varchar(32) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `full_name`;
ALTER TABLE `users` DROP INDEX `users_customer_id_unique`;--> statement-breakpoint
ALTER TABLE `users` ADD `stripe_customer_id` varchar(256);--> statement-breakpoint
ALTER TABLE `subscriptions` DROP COLUMN `customer_id`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `customer_id`;
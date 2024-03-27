ALTER TABLE `users` ADD CONSTRAINT `users_customer_id_unique` UNIQUE(`customer_id`);--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `customer_id` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `customer_id` varchar(256);
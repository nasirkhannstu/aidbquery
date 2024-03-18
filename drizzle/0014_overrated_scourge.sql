CREATE TABLE `subscriptions` (
	`id` varchar(128) NOT NULL,
	`user_id` varchar(128) NOT NULL,
	`amount` int NOT NULL,
	`stripe_payment_id` varchar(256),
	`stripe_customer_id` varchar(256),
	`stripe_subscription_id` varchar(256),
	`stripe_payment_method` varchar(256),
	`stripe_subscription_status` varchar(256),
	`stripe_subscription_end` timestamp,
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` timestamp NOT NULL DEFAULT now() ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `payments`;--> statement-breakpoint
ALTER TABLE `messages` MODIFY COLUMN `sender` enum('USER','BOT') NOT NULL;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
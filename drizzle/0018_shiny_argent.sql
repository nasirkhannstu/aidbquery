ALTER TABLE `subscriptions` MODIFY COLUMN `stripe_price_id` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `subscriptions` MODIFY COLUMN `stripe_customer_id` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `subscriptions` MODIFY COLUMN `stripe_subscription_id` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `subscriptions` MODIFY COLUMN `stripe_payment_method` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `subscriptions` MODIFY COLUMN `stripe_subscription_end` timestamp NOT NULL;
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `users` ADD `email` varchar(256);--> statement-breakpoint
ALTER TABLE `users` ADD `password` varchar(256);--> statement-breakpoint
ALTER TABLE `users` ADD `created_at` bigint;--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` bigint;
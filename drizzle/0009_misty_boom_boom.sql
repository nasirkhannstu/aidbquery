CREATE TABLE `files` (
	`id` varchar(128) NOT NULL,
	`name` varchar(256) NOT NULL,
	`status` enum('PENDING','PROCESSING','FAILED','SUCCESS') NOT NULL DEFAULT 'PENDING',
	`path` varchar(256) NOT NULL,
	`type` enum('CSV','JSON') NOT NULL DEFAULT 'CSV',
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` timestamp NOT NULL DEFAULT now() ON UPDATE CURRENT_TIMESTAMP,
	`user_id` varchar(128) NOT NULL,
	CONSTRAINT `files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` varchar(128) NOT NULL,
	`text` text,
	`sender` enum('USER','BOT'),
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` timestamp NOT NULL DEFAULT now() ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_settings` (
	`id` varchar(128) NOT NULL,
	`document_uploaded` int NOT NULL DEFAULT 0,
	`csv_uploaded` int NOT NULL DEFAULT 0,
	`json_uploaded` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` timestamp NOT NULL DEFAULT now() ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `files` ADD CONSTRAINT `files_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
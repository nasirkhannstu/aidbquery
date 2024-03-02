-- CreateTable
CREATE TABLE `Users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191) NOT NULL DEFAULT 'avatar.png',
    `is_email_verify` BOOLEAN NOT NULL DEFAULT false,
    `email_verify_at` DATETIME(3) NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `status` ENUM('ACTIVE', 'SUSPEND', 'RESTRICTED', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `stripe_customer_id` VARCHAR(191) NULL,
    `stripe_subscription_id` VARCHAR(191) NULL,
    `stripe_price_id` VARCHAR(191) NULL,
    `stripe_current_period_end` DATETIME(3) NULL,
    `subscription_status` ENUM('CANCELED', 'ACTIVE', 'NULL') NULL DEFAULT 'NULL',
    `user_setting_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Users_email_key`(`email`),
    UNIQUE INDEX `Users_stripe_customer_id_key`(`stripe_customer_id`),
    UNIQUE INDEX `Users_stripe_subscription_id_key`(`stripe_subscription_id`),
    INDEX `Users_user_setting_id_idx`(`user_setting_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ForgotPasswords` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `reason` ENUM('FORGOT', 'CHANGE') NOT NULL DEFAULT 'FORGOT',
    `status` ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `token` VARCHAR(191) NULL,
    `message_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    INDEX `ForgotPasswords_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Files` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `upload_status` ENUM('PENDING', 'PROCESSING', 'FAILED', 'SUCCESS') NOT NULL DEFAULT 'PENDING',
    `url` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `file_type` ENUM('CSV', 'JSON') NOT NULL,
    `texts` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NULL,

    INDEX `Files_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Messages` (
    `id` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `is_user_message` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `file_id` VARCHAR(191) NULL,

    INDEX `Messages_user_id_idx`(`user_id`),
    INDEX `Messages_file_id_idx`(`file_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSettings` (
    `id` VARCHAR(191) NOT NULL,
    `document_upload_quote_used` INTEGER NOT NULL DEFAULT 0,
    `csv_quote_used` INTEGER NOT NULL DEFAULT 0,
    `json_quote_used` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

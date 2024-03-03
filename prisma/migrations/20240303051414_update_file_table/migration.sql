-- AlterTable
ALTER TABLE `files` ADD COLUMN `csv_file_size` VARCHAR(191) NULL,
    ADD COLUMN `csv_row_count` INTEGER NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `subscription_status` ENUM('CANCELED', 'ACTIVE', 'NULL') NULL DEFAULT 'NULL';

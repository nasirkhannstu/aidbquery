/*
  Warnings:

  - You are about to alter the column `csv_file_size` on the `files` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `files` MODIFY `csv_file_size` DOUBLE NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `subscription_status` ENUM('CANCELED', 'ACTIVE', 'NULL') NULL DEFAULT 'NULL';

-- AlterTable
ALTER TABLE `users` MODIFY `subscription_status` ENUM('CANCELED', 'ACTIVE', 'NULL') NULL DEFAULT 'NULL';

/*
  Warnings:

  - You are about to drop the column `added_at` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `publication_date` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `confirm_password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `books` DROP COLUMN `added_at`,
    DROP COLUMN `publication_date`,
    ADD COLUMN `addedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `publicationDate` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `users` DROP COLUMN `confirm_password`,
    DROP COLUMN `first_name`,
    DROP COLUMN `last_name`,
    ADD COLUMN `confirmPassword` VARCHAR(20) NOT NULL DEFAULT '',
    ADD COLUMN `firstName` VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN `lastName` VARCHAR(255) NOT NULL DEFAULT '';

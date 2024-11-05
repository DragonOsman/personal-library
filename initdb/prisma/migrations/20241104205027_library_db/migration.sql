/*
  Warnings:

  - You are about to drop the column `addedAt` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `publicationDate` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE `books` DROP COLUMN `addedAt`,
    DROP COLUMN `publicationDate`,
    ADD COLUMN `added_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `publication_date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `users` DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    ADD COLUMN `confirm_password` VARCHAR(20) NOT NULL DEFAULT '',
    ADD COLUMN `first_name` VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN `last_name` VARCHAR(255) NOT NULL DEFAULT '',
    MODIFY `password` VARCHAR(20) NOT NULL DEFAULT '';

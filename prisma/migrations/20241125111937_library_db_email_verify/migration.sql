/*
  Warnings:

  - A unique constraint covering the columns `[emailVerificationToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `emailVerificationToken` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `emailVerificationToken` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_emailVerificationToken_key` ON `users`(`emailVerificationToken`);

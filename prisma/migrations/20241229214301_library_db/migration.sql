/*
  Warnings:

  - Made the column `user_id` on table `session` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `session` MODIFY `user_id` VARCHAR(191) NOT NULL;

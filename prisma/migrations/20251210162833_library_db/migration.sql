/*
  Warnings:

  - You are about to drop the `AlternateEmail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AlternateEmail" DROP CONSTRAINT "AlternateEmail_userId_fkey";

-- DropTable
DROP TABLE "AlternateEmail";

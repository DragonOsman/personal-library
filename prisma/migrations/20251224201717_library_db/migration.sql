/*
  Warnings:

  - Added the required column `type` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Email" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "type" TEXT NOT NULL;

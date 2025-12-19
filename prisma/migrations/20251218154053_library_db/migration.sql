/*
  Warnings:

  - Added the required column `description` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publishedDate` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Made the column `isbn` on table `Book` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "fk_book_user";

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "authors" TEXT[],
ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "imageLinks" JSONB,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "pageCount" INTEGER,
ADD COLUMN     "publishedDate" VARCHAR(50) NOT NULL,
ALTER COLUMN "isbn" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

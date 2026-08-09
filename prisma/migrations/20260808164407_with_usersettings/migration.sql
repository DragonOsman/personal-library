-- CreateEnum
CREATE TYPE "ViewMode" AS ENUM ('GRID', 'LIST');

-- CreateEnum
CREATE TYPE "TileSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "SortOrder" AS ENUM ('RECENT', 'TITLE_ASC', 'TITLE_DESC', 'AUTHOR', 'PUBLICATION_DATE', 'RATING');

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "showBookCovers" BOOLEAN NOT NULL DEFAULT true,
    "showRatings" BOOLEAN NOT NULL DEFAULT true,
    "showDescriptions" BOOLEAN NOT NULL DEFAULT true,
    "viewMode" "ViewMode" NOT NULL DEFAULT 'GRID',
    "tileSize" "TileSize" NOT NULL DEFAULT 'MEDIUM',
    "booksPerPage" INTEGER NOT NULL DEFAULT 20,
    "defaultSort" "SortOrder" NOT NULL DEFAULT 'RECENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

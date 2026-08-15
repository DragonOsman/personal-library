/*
  Warnings:

  - You are about to drop the `UserSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserSettings" DROP CONSTRAINT "UserSettings_userId_fkey";

-- DropTable
DROP TABLE "UserSettings";

-- CreateTable
CREATE TABLE "LibrarySettings" (
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

    CONSTRAINT "LibrarySettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LibrarySettings_userId_key" ON "LibrarySettings"("userId");

-- AddForeignKey
ALTER TABLE "LibrarySettings" ADD CONSTRAINT "LibrarySettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

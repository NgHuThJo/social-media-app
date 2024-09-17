/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Asset_url_key";

-- CreateIndex
CREATE UNIQUE INDEX "Asset_postId_key" ON "Asset"("postId");

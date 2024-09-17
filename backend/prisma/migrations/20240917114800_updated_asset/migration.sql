/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Asset_url_key" ON "Asset"("url");

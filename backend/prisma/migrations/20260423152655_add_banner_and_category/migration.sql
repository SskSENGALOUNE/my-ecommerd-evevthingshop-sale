/*
  Warnings:

  - You are about to drop the column `slug` on the `categories` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "categories_slug_idx";

-- DropIndex
DROP INDEX "categories_slug_key";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "slug";

-- CreateTable
CREATE TABLE "banners" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "link_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "banners_is_active_idx" ON "banners"("is_active");

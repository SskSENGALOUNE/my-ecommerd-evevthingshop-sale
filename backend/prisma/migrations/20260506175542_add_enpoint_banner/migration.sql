-- AlterTable
ALTER TABLE "banners" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "banners_order_idx" ON "banners"("order");

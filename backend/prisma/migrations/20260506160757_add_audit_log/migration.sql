/*
  Warnings:

  - You are about to drop the column `district` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `postal_code` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `variant_id` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `variant_id` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_address` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_fee` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_name` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_phone` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `orders` table. All the data in the column will be lost.
  - Added the required column `shippingName` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_variant_id_fkey";

-- DropIndex
DROP INDEX "cart_items_cart_id_variant_id_key";

-- DropIndex
DROP INDEX "cart_items_variant_id_idx";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "district",
DROP COLUMN "full_name",
DROP COLUMN "phone",
DROP COLUMN "postal_code",
DROP COLUMN "province";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "variant_id",
ADD COLUMN     "productVariantId" UUID;

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "variant_id",
ADD COLUMN     "productVariantId" UUID;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "note",
DROP COLUMN "shipping_address",
DROP COLUMN "shipping_fee",
DROP COLUMN "shipping_name",
DROP COLUMN "shipping_phone",
DROP COLUMN "subtotal",
ADD COLUMN     "shippingName" "ShippingType" NOT NULL;

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "admin_id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "table_name" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "old_value" JSONB,
    "new_value" JSONB,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_admin_id_idx" ON "audit_logs"("admin_id");

-- CreateIndex
CREATE INDEX "audit_logs_table_name_idx" ON "audit_logs"("table_name");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

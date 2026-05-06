/*
  Warnings:

  - You are about to drop the column `address_line` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `sub_district` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `colors` table. All the data in the column will be lost.
  - You are about to drop the column `hex_code` on the `colors` table. All the data in the column will be lost.
  - You are about to drop the column `name_en` on the `colors` table. All the data in the column will be lost.
  - You are about to drop the column `name_th` on the `colors` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `has_size` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `inventories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shipments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `colors` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `color_name` on the `order_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ColorType" AS ENUM ('RED', 'GREEN', 'BLUE', 'YELLOW', 'BLACK', 'WHITE', 'GRAY', 'PURPLE', 'ORANGE', 'PINK', 'BROWN', 'GOLD', 'SILVER');

-- CreateEnum
CREATE TYPE "ShippingType" AS ENUM ('RAIDER', 'ANOUSITH_EXPRESS', 'HOUNGALOUN_EXPRESS', 'MIXAY_EXPRESS', 'UNITEL_EXPRESS');

-- DropForeignKey
ALTER TABLE "inventories" DROP CONSTRAINT "inventories_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_logs" DROP CONSTRAINT "inventory_logs_inventory_id_fkey";

-- DropForeignKey
ALTER TABLE "shipments" DROP CONSTRAINT "shipments_order_id_fkey";

-- DropIndex
DROP INDEX "colors_code_idx";

-- DropIndex
DROP INDEX "colors_code_key";

-- DropIndex
DROP INDEX "products_sku_idx";

-- DropIndex
DROP INDEX "products_sku_key";

-- DropIndex
DROP INDEX "products_slug_idx";

-- DropIndex
DROP INDEX "products_slug_key";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "address_line",
DROP COLUMN "sub_district",
ADD COLUMN     "address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "colors" DROP COLUMN "code",
DROP COLUMN "hex_code",
DROP COLUMN "name_en",
DROP COLUMN "name_th",
ADD COLUMN     "color" "ColorType" NOT NULL;

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "color_name",
ADD COLUMN     "color_name" "ColorType" NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "description",
DROP COLUMN "has_size",
DROP COLUMN "sku",
DROP COLUMN "slug",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reserved_qty" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "inventories";

-- DropTable
DROP TABLE "inventory_logs";

-- DropTable
DROP TABLE "shipments";

-- DropEnum
DROP TYPE "InventoryReason";

-- CreateIndex
CREATE INDEX "colors_color_idx" ON "colors"("color");

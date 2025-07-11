/*
  Warnings:

  - A unique constraint covering the columns `[clerkUserId]` on the table `Seller` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkUserId` to the `Seller` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "clerkUserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Seller_clerkUserId_key" ON "Seller"("clerkUserId");

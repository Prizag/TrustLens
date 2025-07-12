/*
  Warnings:

  - You are about to drop the column `metaMasked` on the `Customer` table. All the data in the column will be lost.
  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dest1` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `dest2` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `issuer_bank_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `productID` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `Transaction` table. All the data in the column will be lost.
  - The `card_id` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `card_bin` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `addr1` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The required column `transactionID` was added to the `Transaction` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "metaMasked",
ADD COLUMN     "avgTrustScore" BIGINT,
ADD COLUMN     "walletAddress" TEXT;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "isAttested" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userAddress" TEXT;

-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
DROP COLUMN "dest1",
DROP COLUMN "dest2",
DROP COLUMN "issuer_bank_id",
DROP COLUMN "productID",
DROP COLUMN "transactionId",
ADD COLUMN     "P_emaildomain" TEXT,
ADD COLUMN     "R_emaildomain" TEXT,
ADD COLUMN     "Transaction Date" DATE,
ADD COLUMN     "Transaction Time" TIME(6),
ADD COLUMN     "addr2" BIGINT,
ADD COLUMN     "dist1" DOUBLE PRECISION,
ADD COLUMN     "dist2" DOUBLE PRECISION,
ADD COLUMN     "issuer_bank_code" DOUBLE PRECISION,
ADD COLUMN     "productCD" TEXT,
ADD COLUMN     "transactionID" TEXT NOT NULL,
ADD COLUMN     "trustScore" BIGINT,
DROP COLUMN "card_id",
ADD COLUMN     "card_id" BIGINT,
DROP COLUMN "card_bin",
ADD COLUMN     "card_bin" INTEGER,
DROP COLUMN "addr1",
ADD COLUMN     "addr1" BIGINT,
ALTER COLUMN "deviceInfo" SET DATA TYPE TEXT,
ALTER COLUMN "isFraud" DROP NOT NULL,
ALTER COLUMN "isFraud" DROP DEFAULT,
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transactionID");

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `Services` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CarsServices" ADD COLUMN     "paymentMethod" TEXT;

-- AlterTable
ALTER TABLE "Services" DROP COLUMN "paymentMethod";

/*
  Warnings:

  - You are about to drop the column `checkInTime` on the `Cars` table. All the data in the column will be lost.
  - You are about to drop the column `checkOutTime` on the `Cars` table. All the data in the column will be lost.
  - You are about to drop the column `isFinished` on the `Cars` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Cars` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cars" DROP COLUMN "checkInTime",
DROP COLUMN "checkOutTime",
DROP COLUMN "isFinished",
DROP COLUMN "status";

-- AlterTable
ALTER TABLE "CarsServices" ADD COLUMN     "finishedAt" TIMESTAMP(3),
ADD COLUMN     "isFinished" BOOLEAN NOT NULL DEFAULT false;

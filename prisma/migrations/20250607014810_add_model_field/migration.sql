/*
  Warnings:

  - You are about to drop the column `ownerName` on the `Car` table. All the data in the column will be lost.
  - Added the required column `model` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Car" DROP COLUMN "ownerName",
ADD COLUMN     "model" TEXT NOT NULL;

/*
  Warnings:

  - You are about to drop the column `model` on the `Cars` table. All the data in the column will be lost.
  - Added the required column `modelCode` to the `Cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelName` to the `Cars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cars" DROP COLUMN "model",
ADD COLUMN     "modelCode" TEXT NOT NULL,
ADD COLUMN     "modelName" TEXT NOT NULL;

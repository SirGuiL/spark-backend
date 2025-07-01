/*
  Warnings:

  - You are about to drop the column `brand` on the `Cars` table. All the data in the column will be lost.
  - Added the required column `brandId` to the `Cars` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('cars', 'motorcycles', 'trucks');

-- AlterTable
ALTER TABLE "Cars" DROP COLUMN "brand",
ADD COLUMN     "brandId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "Type" NOT NULL DEFAULT 'cars',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_code_key" ON "Brand"("code");

-- AddForeignKey
ALTER TABLE "Cars" ADD CONSTRAINT "Cars_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

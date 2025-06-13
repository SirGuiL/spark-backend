/*
  Warnings:

  - You are about to drop the column `serviceId` on the `Cars` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cars" DROP CONSTRAINT "Cars_serviceId_fkey";

-- AlterTable
ALTER TABLE "Cars" DROP COLUMN "serviceId";

-- CreateTable
CREATE TABLE "_CarsToServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CarsToServices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CarsToServices_B_index" ON "_CarsToServices"("B");

-- AddForeignKey
ALTER TABLE "_CarsToServices" ADD CONSTRAINT "_CarsToServices_A_fkey" FOREIGN KEY ("A") REFERENCES "Cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarsToServices" ADD CONSTRAINT "_CarsToServices_B_fkey" FOREIGN KEY ("B") REFERENCES "Services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

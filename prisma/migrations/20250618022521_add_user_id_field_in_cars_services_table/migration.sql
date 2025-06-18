/*
  Warnings:

  - Added the required column `userId` to the `CarsServices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CarsServices" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CarsServices" ADD CONSTRAINT "CarsServices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

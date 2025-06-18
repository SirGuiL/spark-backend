/*
  Warnings:

  - Added the required column `userId` to the `ServicesTags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServicesTags" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ServicesTags" ADD CONSTRAINT "ServicesTags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

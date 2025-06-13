/*
  Warnings:

  - A unique constraint covering the columns `[plate]` on the table `Cars` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cars_plate_key" ON "Cars"("plate");

-- AlterTable
ALTER TABLE "Tags" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "ServicesTags" (
    "id" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "ServicesTags_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServicesTags" ADD CONSTRAINT "ServicesTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesTags" ADD CONSTRAINT "ServicesTags_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

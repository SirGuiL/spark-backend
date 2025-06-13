-- CreateTable
CREATE TABLE "CarsServices" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarsServices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CarsServices" ADD CONSTRAINT "CarsServices_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarsServices" ADD CONSTRAINT "CarsServices_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

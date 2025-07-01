import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

import { BrandsService } from "../services/brandsService";

cron.schedule("0 3 * * 1", async () => {
  console.log("Sync brands cron job running");

  const prisma = new PrismaClient();

  const brandsService = new BrandsService(prisma);
  await brandsService.syncBrands();
});

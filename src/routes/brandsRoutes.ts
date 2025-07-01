import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { authenticateJWT } from "../middlewares/authenticateJWT";
import { BrandsController } from "../controllers/brandsController";

const router = Router();

const prisma = new PrismaClient();
const brandsController = new BrandsController(prisma);

router.get(
  "/",
  // @ts-ignore
  [authenticateJWT],
  brandsController.fetchAll.bind(brandsController)
);

router.post(
  "/sync",
  // @ts-ignore
  [authenticateJWT],
  brandsController.syncBrands.bind(brandsController)
);

export { router };

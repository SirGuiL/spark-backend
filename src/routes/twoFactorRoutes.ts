import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { authenticateJWT } from "../middlewares/authenticateJWT";
import { TwoFactorController } from "../controllers/twoFactorController";

const router = Router();

const prisma = new PrismaClient();
const twoFactorController = new TwoFactorController(prisma);

router.get(
  "/setup",
  // @ts-ignore
  [authenticateJWT],
  twoFactorController.generateSecret.bind(twoFactorController)
);

router.post(
  "/verify",
  // @ts-ignore
  [authenticateJWT],
  twoFactorController.generateSecret.bind(twoFactorController)
);

export { router };

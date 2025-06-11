import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { CarsController } from "../controllers/carsController";
import { authenticateJWT } from "../middlewares/authenticateJWT";

const router = Router();

const prisma = new PrismaClient();
const carsController = new CarsController(prisma);

// @ts-ignore
router.post("/", [authenticateJWT], carsController.create.bind(carsController));

router.get(
  "/",
  // @ts-ignore
  [authenticateJWT],
  carsController.fetchAll.bind(carsController)
);

router.get(
  "/:id",
  // @ts-ignore
  [authenticateJWT],
  carsController.findUniqueById.bind(carsController)
);

router.put(
  "/:id",
  // @ts-ignore
  [authenticateJWT],
  carsController.update.bind(carsController)
);

router.delete(
  "/:id",
  // @ts-ignore
  [authenticateJWT],
  carsController.delete.bind(carsController)
);

export { router };

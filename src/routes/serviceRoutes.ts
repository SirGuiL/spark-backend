import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { ServicesController } from "../controllers/servicesController";
import { authenticateJWT } from "../middlewares/authenticateJWT";

const router = Router();

const prisma = new PrismaClient();
const servicesController = new ServicesController(prisma);

router.post(
  "/",
  // @ts-ignore
  [authenticateJWT],
  servicesController.create.bind(servicesController)
);

router.get(
  "/",
  // @ts-ignore
  [authenticateJWT],
  servicesController.fetchAll.bind(servicesController)
);

router.get(
  "/:id",
  // @ts-ignore
  [authenticateJWT],
  servicesController.findUniqueById.bind(servicesController)
);

router.put(
  "/:id",
  // @ts-ignore
  [authenticateJWT],
  servicesController.update.bind(servicesController)
);

router.delete(
  "/:id",
  // @ts-ignore
  [authenticateJWT],
  servicesController.delete.bind(servicesController)
);

export { router };

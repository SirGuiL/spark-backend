import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { TagsController } from "../controllers/tagsController";
import { authenticateJWT } from "../middlewares/authenticateJWT";

const router = Router();

const prisma = new PrismaClient();
const servicesController = new TagsController(prisma);

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

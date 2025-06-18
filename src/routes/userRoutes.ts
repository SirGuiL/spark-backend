import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { UsersController } from "../controllers/usersController";
import { authenticateJWT } from "../middlewares/authenticateJWT";

const router = Router();

const prisma = new PrismaClient();
const usersController = new UsersController(prisma);

router.post("/", usersController.create.bind(usersController));

router.get(
  "/me",
  // @ts-ignore
  [authenticateJWT],
  usersController.getByToken.bind(usersController)
);

router.put(
  "/:id",
  // @ts-ignore
  [authenticateJWT],
  usersController.update.bind(usersController)
);

router.delete(
  "/:id",
  // @ts-ignore
  [authenticateJWT],
  usersController.delete.bind(usersController)
);

router.patch(
  "/:id/activate",
  // @ts-ignore
  [authenticateJWT],
  usersController.activate.bind(usersController)
);

router.patch(
  "/:id/deactivate",
  // @ts-ignore
  [authenticateJWT],
  usersController.deactivate.bind(usersController)
);

export { router };

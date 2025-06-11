import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { UsersController } from "../controllers/usersController";
import { authenticateJWT } from "../middlewares/authenticateJWT";

const router = Router();

const prisma = new PrismaClient();
const usersController = new UsersController(prisma);

router.post("/", usersController.create.bind(usersController));
router.get(
  "/",
  // @ts-ignore
  [authenticateJWT],
  usersController.getByToken.bind(usersController)
);

export { router };

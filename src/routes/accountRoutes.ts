import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { AccountController } from "../controllers/accountController";
import { authenticateJWT } from "../middlewares/authenticateJWT";

const router = Router();

const prisma = new PrismaClient();
const accountController = new AccountController(prisma);

router.post("/", accountController.create.bind(accountController));

router.get(
  "/",
  // @ts-ignore
  [authenticateJWT],
  accountController.getByToken.bind(accountController)
);

router.put(
  "/:id",
  // @ts-ignore
  [authenticateJWT],
  accountController.update.bind(accountController)
);

router.patch(
  "/:id/activate",
  // @ts-ignore
  [authenticateJWT],
  accountController.activate.bind(accountController)
);

router.patch(
  "/:id/deactivate",
  // @ts-ignore
  [authenticateJWT],
  accountController.deactivate.bind(accountController)
);

router.get(
  "/users",
  // @ts-ignore
  [authenticateJWT],
  accountController.fetchUsers.bind(accountController)
);

export { router };

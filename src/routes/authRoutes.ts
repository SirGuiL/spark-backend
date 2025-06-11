import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { AuthController } from "../controllers/authController";

const router = Router();

const prisma = new PrismaClient();
const authController = new AuthController(prisma);

router.post("/login", authController.login.bind(authController));
router.post("/logout", authController.logout.bind(authController));
// @ts-ignore
router.post("/refresh", authController.refresh.bind(authController));

export { router };

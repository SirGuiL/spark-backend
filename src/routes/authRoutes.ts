import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { AuthController } from "../controllers/authController";

const router = Router();

const prisma = new PrismaClient();
const authController = new AuthController(prisma);

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);

export { router };

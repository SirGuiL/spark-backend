import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { ServicesController } from "../controllers/servicesController";
import { authenticateJWT } from "../middlewares/authenticateJWT";

const router = Router();

const prisma = new PrismaClient();
const servicesController = new ServicesController(prisma);

// @ts-ignore
router.post("/", [authenticateJWT], servicesController.create);
// @ts-ignore
router.get("/", [authenticateJWT], servicesController.fetchAll);
// @ts-ignore
router.get("/:id", [authenticateJWT], servicesController.findUniqueById);
// @ts-ignore
router.put("/:id", [authenticateJWT], servicesController.update);
// @ts-ignore
router.delete("/:id", [authenticateJWT], servicesController.delete);

export { router };

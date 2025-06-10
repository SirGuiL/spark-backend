import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { CarsController } from "../controllers/carsController";
import { authenticateJWT } from "../middlewares/authenticateJWT";

const router = Router();

const prisma = new PrismaClient();
const carsController = new CarsController(prisma);

// @ts-ignore
router.post("/", [authenticateJWT], carsController.create);
// @ts-ignore
router.get("/", [authenticateJWT], carsController.fetchAll);
// @ts-ignore
router.get("/:id", [authenticateJWT], carsController.findUniqueById);
// @ts-ignore
router.put("/:id", [authenticateJWT], carsController.update);
// @ts-ignore
router.delete("/:id", [authenticateJWT], carsController.delete);

export { router };

import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

import { SignatureController } from "../controllers/signatureController";
import { authenticateJWT } from "../middlewares/authenticateJWT";

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const prisma = new PrismaClient();
const signatureController = new SignatureController(prisma, stripe);

router.get(
  "/",
  // @ts-ignore
  [authenticateJWT],
  signatureController.fetchAll.bind(signatureController)
);

router.post(
  "/subscribe",
  // @ts-ignore
  [authenticateJWT],
  signatureController.subscribe.bind(signatureController)
);

router.delete(
  "/:subscriptionId/cancel",
  // @ts-ignore
  [authenticateJWT],
  signatureController.cancelSubscription.bind(signatureController)
);

export { router };

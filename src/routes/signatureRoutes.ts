import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

import { SignatureController } from "../controllers/signatureController";
import { authenticateJWT } from "../middlewares/authenticateJWT";

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const prisma = new PrismaClient();
const signatureController = new SignatureController(prisma, stripe);

router.post(
  "/subscribe",
  // @ts-ignore
  [authenticateJWT],
  signatureController.subscribe.bind(signatureController)
);

router.post(
  "/webhook",
  // @ts-ignore
  signatureController.webhook.bind(signatureController)
);

export { router };

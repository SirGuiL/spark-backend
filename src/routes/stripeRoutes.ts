import { Router, raw } from "express";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

import { SignatureController } from "../controllers/signatureController";

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const prisma = new PrismaClient();
const signatureController = new SignatureController(prisma, stripe);

router.post(
  "/webhook",
  raw({ type: "application/json" }),
  // @ts-ignore
  signatureController.webhook.bind(signatureController)
);

export { router };

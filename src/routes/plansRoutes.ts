import { Router } from "express";
import Stripe from "stripe";
import { PlansController } from "../controllers/plansController";

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const plansController = new PlansController(stripe);

router.get("/", plansController.fetchAll);

export { router };

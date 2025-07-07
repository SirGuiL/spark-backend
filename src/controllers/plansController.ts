import { Request, RequestHandler, Response } from "express";
import Stripe from "stripe";
import { PlansService } from "../services/plansService";

export class PlansController {
  stripe: Stripe;

  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }

  fetchAll: RequestHandler = async (_req, res) => {
    const plansService = new PlansService(this.stripe);
    const plans = await plansService.fetchAll();

    res.status(200).json(
      plans.data.map((price) => ({
        id: price.id,
        nickname: price.nickname,
        amount: price.unit_amount,
        interval: price.recurring?.interval,
        productName: (price.product as Stripe.Product)?.name,
      }))
    );
  };
}

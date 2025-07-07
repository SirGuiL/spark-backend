import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

import { SignatureService } from "../services/signatureService";

export class SignatureController {
  prisma: PrismaClient;
  stripe: Stripe;

  constructor(prisma: PrismaClient, stripe: Stripe) {
    this.prisma = prisma;
    this.stripe = stripe;
  }

  async subscribe(req: Request, res: Response) {
    // @ts-ignore
    const user = req.user;

    const { planId, successUrl, cancelUrl } = req.body;

    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const signatureService = new SignatureService(this.stripe, this.prisma);

    const storedSubscription =
      await signatureService.findSubscriptionByAccountId({
        accountId: user.accountId,
      });

    if (storedSubscription) {
      const subscription = await signatureService.checkoutSession({
        cancel_url: cancelUrl,
        success_url: successUrl,
        customer: storedSubscription.planId,
        line_items: [
          {
            price: planId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        payment_method_types: ["card"],
      });

      return res
        .status(200)
        .json({ message: "Subscribed successfully", url: subscription.url });
    }

    const customer = await signatureService.createCustomer({
      email: user.email,
    });

    const subscription = await signatureService.checkoutSession({
      cancel_url: cancelUrl,
      success_url: successUrl,
      customer: customer.id,
      line_items: [
        {
          price: planId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      payment_method_types: ["card"],
    });

    res
      .status(200)
      .json({ message: "Subscribed successfully", url: subscription.url });
  }

  async webhook(req: Request, res: Response) {
    const sig = req.headers["stripe-signature"]!;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );
    } catch (err: any) {
      console.error("Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("✅ Assinatura confirmada:", session);
    }

    res.status(200).end();
  }
}

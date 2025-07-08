import { Request, Response } from "express";
import { PrismaClient, SubscriptionStatus } from "@prisma/client";
import Stripe from "stripe";

import { SignatureService } from "../services/signatureService";
import { Validators } from "../utils/validators";

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
    const requiredFields = { planId, successUrl, cancelUrl };

    if (!Validators.validateRequiredFields(res, requiredFields)) {
      return;
    }

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
        metadata: {
          accountId: user.accountId,
        },
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
      metadata: {
        accountId: user.accountId,
      },
    });

    res
      .status(200)
      .json({ message: "Subscribed successfully", url: subscription.url });
  }

  async cancelSubscription(req: Request, res: Response) {
    // @ts-ignore
    const user = req.user;

    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const signatureService = new SignatureService(this.stripe, this.prisma);

    const subscription = await signatureService.findSubscriptionByAccountId({
      accountId: user.accountId,
    });

    if (!subscription) {
      res.status(400).json({ error: "Subscription not found" });
      return;
    }

    await signatureService.cancelSubscription({
      planId: subscription.planId,
    });

    res.status(200).json({ message: "Subscription canceled successfully" });
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
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("✅ Assinatura confirmada:", session);

      const subscriptionId = session.subscription as string;
      const subscription = await this.stripe.subscriptions.retrieve(
        subscriptionId
      );

      const accountId = session.metadata?.accountId;

      const signatureService = new SignatureService(this.stripe, this.prisma);

      await signatureService.createSubscription({
        status: subscription.status as SubscriptionStatus,
        currentPeriodStart: new Date(subscription.start_date * 1000),
        currentPeriodEnd: new Date(subscription.billing_cycle_anchor * 1000),
        cancelAt: subscription.cancel_at
          ? new Date(subscription.cancel_at * 1000)
          : null,
        canceledAt: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000)
          : null,
        updatedAt: new Date(),
        accountId: accountId!,
        planId: subscription.id,
      });
    }

    res.status(200).end();
  }
}

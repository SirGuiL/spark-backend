import { PrismaClient, SubscriptionStatus } from "@prisma/client";
import Stripe from "stripe";

type createCustomerParams = {
  email: string;
};

type lineItem = {
  price: string;
  quantity: number;
};

type checkoutSessionData = {
  mode: "subscription";
  payment_method_types:
    | Stripe.Checkout.SessionCreateParams.PaymentMethodType[]
    | undefined;
  customer: string;
  line_items: lineItem[];
  success_url: string;
  cancel_url: string;
  metadata: {
    accountId: string;
  };
};

type createSubscriptionData = {
  accountId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAt: Date | null;
  canceledAt: Date | null;
  updatedAt: Date;
};

export class SignatureService {
  stripe: Stripe;
  db: PrismaClient;

  constructor(stripe: Stripe, db: PrismaClient) {
    this.stripe = stripe;
    this.db = db;
  }

  async createCustomer({ email }: createCustomerParams) {
    return await this.stripe.customers.create({ email });
  }

  async checkoutSession(data: checkoutSessionData) {
    return await this.stripe.checkout.sessions.create(data);
  }

  async findSubscriptionByAccountId({ accountId }: { accountId: string }) {
    return await this.db.subscription.findFirst({
      where: { accountId },
    });
  }

  async createSubscription(data: createSubscriptionData) {
    const { planId, accountId, ...rest } = data;

    const subscriptionData = {
      ...rest,
      accountId,
    };

    await this.db.subscription.upsert({
      where: {
        planId,
      },
      update: subscriptionData,
      create: {
        planId,
        ...subscriptionData,
      },
    });
  }

  async cancelSubscription({ planId }: { planId: string }) {
    return await this.stripe.subscriptions.update(planId, {
      cancel_at_period_end: true,
    });
  }
}

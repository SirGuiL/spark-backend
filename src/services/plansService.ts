import Stripe from "stripe";

export class PlansService {
  stripe: Stripe;

  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }

  async fetchAll() {
    return await this.stripe.prices.list({
      active: true,
      expand: ["data.product"],
    });
  }
}

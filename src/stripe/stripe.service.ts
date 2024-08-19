import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import config from 'config';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private SECRET_KEY: string = config.get('STRIPE.SECRET_KEY');

  constructor() {
    this.stripe = new Stripe(this.SECRET_KEY);
  }

  async createProduct(data) {
    return await this.stripe.products.create(data);
  }
}

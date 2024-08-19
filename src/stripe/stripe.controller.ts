import { Controller } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  createProduct() {
    // return this.stripeService.createProduct();
  }
}

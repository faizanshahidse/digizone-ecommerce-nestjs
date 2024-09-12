import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
// import { StripeService } from 'src/stripe/stripe.service';
import { ProductRepository } from 'src/shared/repositories/product.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductSchema } from 'src/shared/schema/products';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/shared/middleware/roles.guard';
import { AuthMiddleware } from 'src/shared/middleware/auth';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { Users, userSchema } from 'src/shared/schema/users';
import config from 'config';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Products.name,
        schema: ProductSchema,
      },
      {
        name: Users.name,
        schema: userSchema,
      },
    ]),
    StripeModule,
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    // StripeService,
    ProductRepository,
    UserRepository,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class ProductsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    console.log(`${config.get('APP_PREFIX')}/products`);
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: '/products',
          method: RequestMethod.GET,
        },
        {
          path: '/products/:id',
          method: RequestMethod.GET,
        },
      )
      .forRoutes(ProductsController);
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import config from 'config';
import { AllExceptionFilter } from './httpExceptionFilter';
import { APP_FILTER } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { StripeModule } from './stripe/stripe.module';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    MongooseModule.forRoot(config.get('MONGODB_URL'), {}),
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env.development' : `.env.${ENV}`,
    }),
    ProductsModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: 'TEST',
    //   inject: [HttpAdapterHost],
    //   useFactory: (httpAdapterHost: HttpAdapterHost) => {
    //     console.log(!!httpAdapterHost.httpAdapter);
    //     return 'Test';
    //   },
    // },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}

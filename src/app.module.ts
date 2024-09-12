import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllExceptionFilter } from './httpExceptionFilter';
import { APP_FILTER } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { StripeModule } from './stripe/stripe.module';

import { DatabaseModule } from './shared/modules/database.module';
// import { EnvConfigModule } from './shared/modules/env-config.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    DatabaseModule,
    // EnvConfigModule,
    ConfigModule.forRoot({ folder: './config' }),
    UsersModule,
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

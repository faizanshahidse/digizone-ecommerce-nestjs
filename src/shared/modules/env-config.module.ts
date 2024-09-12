import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env.development' : `.env.${ENV}`,
    }),
  ],
})
export class EnvConfigModule {}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from 'config';
import { responseInterceptor } from './responseInterceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.setGlobalPrefix(config.get('APP_PREFIX'));

  app.useGlobalInterceptors(new responseInterceptor());

  await app.listen(config.get('PORT'), () => {
    console.log(`Server is listening on PORT ${config.get('PORT')}`);
  });
}
bootstrap();

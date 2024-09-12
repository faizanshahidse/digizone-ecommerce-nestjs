import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from 'config';
import { responseInterceptor } from './responseInterceptor';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    morgan('combined', {
      stream: {
        write: (str) => {
          console.log(str);
        },
      },
    }),
  );

  app.use(cookieParser());

  app.setGlobalPrefix(config.get('APP_PREFIX'));

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new responseInterceptor());

  await app.listen(config.get('PORT'), () => {
    console.log(`Server is listening on PORT ${config.get('PORT')}`);
  });
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Global } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(3000);
}
bootstrap();


declare global {
  namespace Express {
    interface Request {

      user?: { sub: string, access_token: string }
    }
  }
}
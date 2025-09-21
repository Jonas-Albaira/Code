
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { AppDataSource } from './data-source';   // <-- add this

async function bootstrap() {
  await AppDataSource.initialize();             // now it’s defined
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();

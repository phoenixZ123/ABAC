import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from './config/db.config';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  AppDataSource.initialize().then();
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter())

   app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,         // remove extra fields not in DTO
      forbidNonWhitelisted: true, // throw error if extra fields are sent
      transform: true,         // transform payload to DTO class instance
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  console.log(`server running on port ${process.env.PORT}`);
}
bootstrap();

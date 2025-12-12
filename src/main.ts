import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from './config/db.config';

async function bootstrap() {
  AppDataSource.initialize().then();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  console.log(`server running on port ${process.env.PORT}`);
}
bootstrap();

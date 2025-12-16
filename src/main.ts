import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from './config/db.config';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  AppDataSource.initialize().then();

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(
              ({ level, message, timestamp, context }) =>
                `${timestamp} [${level}] ${context || 'App'}: ${message}`,
            ),
          ),
        }),
      ],
    }),
  });
  app.use((req, res, next) => {
    if (req.method === 'GET') {
      req.headers['content-type'] = undefined;
    }
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false, // ✅ MUST be false
      skipMissingProperties: true, // ✅ ALLOW empty body
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
  console.log(`server running on ${process.env.PORT}`);
}
bootstrap();


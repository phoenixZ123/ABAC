import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  Logger.log(`DB_HOST: ${configService.get<string>('DB_HOST')}`);
  Logger.log(`DB_PORT: ${configService.get<number>('DB_PORT')}`);
  Logger.log(`DB_USERNAME: ${configService.get<string>('DB_USER')}`);
  Logger.log(`DB_NAME: ${configService.get<string>('DB_NAME')}`);
  Logger.log(`DB_PASSWORD: ${configService.get<string>('DB_PASS')}`); // do NOT print actual password

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: +configService.get<number>('DB_PORT', 5433),
    username: configService.get<string>('DB_USER', 'postgres'),
    password: configService.get<string>('DB_PASS', 'admin'),
    database: configService.get<string>('DB_NAME', 'ABAC_test'),
    entities: [
      User,
    ],
    synchronize: true, // only for dev
    autoLoadEntities: true,
  };
};
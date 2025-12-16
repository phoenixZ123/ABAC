import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/typeOrm.config';
import { AuthGuard } from '@nestjs/passport';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { OperatorModule } from './modules/operator/operator.module';
import { PolicyModule } from './modules/policy/policy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        getTypeOrmConfig(configService),
    }),
    UserModule,
    OperatorModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }



import { Module } from '@nestjs/common';
import { OperatorService } from './operator.service';
import { OperatorController } from './operator.controller';
import { Operator } from './entities/operator.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PolicyModule } from 'src/modules/policy/policy.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Operator]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_OPERATOR_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),

    }),
    PolicyModule

  ],
  controllers: [OperatorController],
  providers: [OperatorService],
})
export class OperatorModule { }

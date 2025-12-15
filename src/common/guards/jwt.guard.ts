import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer '))
      throw new UnauthorizedException('Missing token');

    const token = authHeader.split(' ')[1];

    try {
      const verified = jwt.verify(
        token,
        this.configService.get('JWT_SECRET') || 'supersecret',
      );

      request.user = verified;
      return true;
    } catch {
      throw new UnauthorizedException('Token verification failed');
    }
  }
}


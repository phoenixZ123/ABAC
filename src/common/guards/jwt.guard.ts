import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      console.error('No Authorization header found');
      throw new UnauthorizedException('Missing Authorization header');
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.error('Authorization header is malformed:', authHeader);
      throw new UnauthorizedException('Invalid token format');
    }

    const token = authHeader.split(' ')[1];
    const secret = this.configService.get('JWT_USER_SECRET') || 'supersecret';

    try {
      const verified = jwt.verify(token, secret) as { [key: string]: any };
      console.log('Token verified successfully:', verified);

      // Attach user payload to request
      request.user = verified;
      console.log(verified);
      return true;
    } catch (err: any) {
      console.error('Token verification error:', err.message);
      throw new UnauthorizedException('Token verification failed: ' + err.message);
    }
  }
}

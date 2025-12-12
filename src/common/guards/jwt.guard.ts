import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config'
import { IS_PUBLIC_KEY } from '../decorators/public.decorators';
import * as jwt from "jsonwebtoken"
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private reflector: Reflector, private readonly configService: ConfigService) { }

    private getSecretByType(type: string): string | null {
        switch (type) {
            case 'user': return this.configService.get('JWT_USER_SECRET')!;
            case 'driver': return this.configService.get('JWT_DRIVER_SECRET')!;      
            case 'operation': return this.configService.get('JWT_OPERATION_SECRET')!;
            default: return null;
        }
    }

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer '))
            throw new UnauthorizedException('Missing or invalid token');

        const token = authHeader.split(' ')[1];

        // decode safely
        const decoded = jwt.decode(token) as { type?: string } | null;
        if (!decoded?.type) throw new UnauthorizedException({success: false, message: 'Invalid token'});
        console.log(decoded.type);

        const secret = this.getSecretByType(decoded.type);
        console.log(secret)
        if (!secret) throw new UnauthorizedException({success: false, message: 'Invalid user type'});

        try {
            const verified = jwt.verify(token, secret);
            
            request.user = verified;
            return true;
        } catch (e) {
            throw new UnauthorizedException({success: false, message: 'Token verification failed', error: e});
        }
    }
}

import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const key = req.headers['x-api-key'];
    if (!key || key !== process.env.INTERNAL_API_KEY) {
      throw new ForbiddenException({success: false, message: 'Unauthorized service call'});
    }
    return true;
  }
}

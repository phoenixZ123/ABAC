import { Reflector } from "@nestjs/core";
import { POLICY_KEY } from "../policy.decorator";
import { OperatorPolicy } from "./operator.policy";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private operatorPolicy: OperatorPolicy,
  ) { }

  canActivate(context: ExecutionContext): boolean {
    const policy = this.reflector.get(POLICY_KEY, context.getHandler());
    if (!policy) return true;

    const req = context.switchToHttp().getRequest();
    const actor = req.user;
    // console.log(actor);
    const allowed = this.operatorPolicy.can({
      actor,
      resource: policy.resource,
      action: policy.action,
    });
// console.log(allowed);
    if (!allowed) throw new ForbiddenException('Access denied');
    return true;
  }
}

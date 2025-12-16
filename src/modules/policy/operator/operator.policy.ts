// src/modules/policy/operator.policy.ts
import { Injectable } from '@nestjs/common';

export interface PolicyContext {
  actor: { position: string }; // operator's position from JWT
  resource: string;
  action: string;
}

@Injectable()
export class OperatorPolicy {
  can(ctx: PolicyContext): boolean {
    const { actor, action } = ctx;

    switch (actor.position) {
      case 'admin':
        return true; // admin can do everything
      case 'manager':
        return action !== 'delete'; // manager cannot delete
      case 'editor':
        return action === 'read' || action === 'update';
      case 'viewer':
        return action === 'read';
      default:
        return false;
    }
  }
}

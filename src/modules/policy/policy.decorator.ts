// src/modules/policy/policy.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const POLICY_KEY = 'policy';

export type ActionType = 'read' | 'create' | 'update' | 'delete';

export interface PolicyMeta {
  resource: string;
  action: ActionType;
}

export const Policy = (resource: string, action: ActionType) =>
  SetMetadata(POLICY_KEY, { resource, action });

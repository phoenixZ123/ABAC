import { SetMetadata } from '@nestjs/common';

export const POLICY_KEY = process.env.POLICY_KEY;

export interface PolicyMeta {
  resource: string;
  action: 'read' | 'create' | 'update' | 'delete';
}

export const Policy = (resource: string, action: PolicyMeta['action']) =>
  SetMetadata(POLICY_KEY, { resource, action });

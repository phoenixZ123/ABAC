import { Module } from '@nestjs/common';
import { OperatorPolicy } from './operator/operator.policy';
import { PolicyGuard } from './operator/operator-policy.guard';

@Module({
     providers: [OperatorPolicy, PolicyGuard],
  exports: [OperatorPolicy, PolicyGuard],
})
export class PolicyModule {}

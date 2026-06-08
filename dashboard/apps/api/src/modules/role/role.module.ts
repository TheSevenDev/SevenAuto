import { Module } from '@nestjs/common';

import { RoleController } from './role.controller';
import { RoleService } from './roleService';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}

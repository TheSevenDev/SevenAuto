import { Module } from '@nestjs/common';
import { RoleModule } from 'src/modules/role/role.module';
import { UserModule } from 'src/modules/user/user.module';

import { GeneralController } from './general.controller';
import { GeneralService } from './general.service';
import { SeedDataService } from './seedData.service';

@Module({
  imports: [UserModule, RoleModule],
  controllers: [GeneralController],
  providers: [GeneralService, SeedDataService],
})
export class GeneralModule {}

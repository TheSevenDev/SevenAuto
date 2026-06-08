import { forwardRef, Module } from '@nestjs/common';
import { EnvModule } from 'src/modules/env/env.module';
import { QueuesModule } from 'src/modules/queues/queues.module';

import { EmailController } from './controller/email.controller';
import { EmailTemplateController } from './controller/email-template.controller';
import { EmailHelper } from './email.helper';
import { EmailService } from './service/email.service';
import { EmailTemplateService } from './service/email-template.service';

@Module({
  imports: [EnvModule, forwardRef(() => QueuesModule)],
  controllers: [EmailTemplateController, EmailController],
  providers: [EmailService, EmailTemplateService, EmailHelper],
  exports: [EmailService, EmailTemplateService, EmailHelper],
})
export class EmailModule {}

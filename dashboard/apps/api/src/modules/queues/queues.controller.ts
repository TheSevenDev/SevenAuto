import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { QueuesEmailService } from './service/queues-email.service';
import { QueuesNotificationService } from './service/queues-notification.service';

@Controller('queues')
@ApiTags('queues')
export class QueuesController {
  constructor(
    private readonly queuesEmailService: QueuesEmailService,
    private readonly queuesNotificationService: QueuesNotificationService,
  ) {}

  // @Post('send-email')
  // async sendEmail(@Body() body: any) {
  //   await this.queuesEmailService.sendEmail(body);
  //   return { message: 'Email job added to queue!' };
  // }

  // @Post('send-notification')
  // async sendNotification() {
  //   await this.queuesNotificationService.sendNotificationNewFeed({
  //     feedId: 'b5a68a51-8b20-48f9-9dd7-ad000824d6f4',
  //   });
  //   return { message: 'Notification job added to queue!' };
  // }
}

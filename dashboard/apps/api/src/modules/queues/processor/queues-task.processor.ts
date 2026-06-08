import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { UserActionService } from 'src/modules/user/service/userAction.service';

@Processor('task')
export class QueuesTaskProcessor extends WorkerHost {
  constructor(private readonly userActionService: UserActionService) {
    super();
  }

  async process(job: Job<unknown>): Promise<void> {
    const { data, name } = job;
    console.log('Processed job:', `"${name}"`, ' with data:', data);

    return null;
  }
}

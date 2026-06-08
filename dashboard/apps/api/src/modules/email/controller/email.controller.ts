import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { permissions } from '@seven-auto/libs';
import { ApiSuccessBooleanResponse } from 'src/decorators/apiResponse.decorator';
import { Permissions } from 'src/decorators/permissions.decorator';

import { EmailSendMultiDto } from '../email.dto';
import { EmailService } from '../service/email.service';

@Controller('email')
@ApiTags('Email')
@ApiBearerAuth()
@Permissions(permissions.SUPER_ADMIN)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/')
  @Permissions(permissions.SUPER_ADMIN)
  @ApiSuccessBooleanResponse()
  @ApiOperation({ summary: 'Send email' })
  sendEmail(@Body() data: EmailSendMultiDto) {
    if (data.useBcc) {
      return this.emailService.sendMultiBcc(data);
    }
    return this.emailService.sendMulti(data);
  }
}

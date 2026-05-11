import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('')
@ApiTags('App')
export class AppController {
  constructor() {}

  @Get('/')
  @ApiOperation({ summary: 'Root' })
  root(): string {
    return 'Dashboard API';
  }

  @Get('/health')
  @ApiOperation({ summary: 'Health check' })
  health(): string {
    return 'OK';
  }
}

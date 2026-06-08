import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { IFindManyResponse, permissions } from '@seven-auto/libs';
import { ApiSuccessObjResponse } from 'src/decorators/apiResponse.decorator';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { RequireIdPipe } from 'src/pipes/requireId.pipe';
import { XSSFilterPipe } from 'src/pipes/xssFilter.pipe';

import {
  EmailTemplateDto,
  EmailTemplateFindManyDto,
  EmailTemplateUpdateDto,
} from '../email.dto';
import { EmailTemplateService } from '../service/email-template.service';

@Controller('email-template')
@ApiTags('Email Template')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
export class EmailTemplateController {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  @Get('/')
  @Permissions(permissions.SUPER_ADMIN)
  @ApiSuccessObjResponse(EmailTemplateDto)
  @ApiOperation({ summary: 'Get all email template' })
  findMany(
    @Query() args: EmailTemplateFindManyDto,
  ): Promise<IFindManyResponse<EmailTemplateDto>> {
    return this.emailTemplateService.findMany(args);
  }

  @Get(':id')
  @Permissions(permissions.SUPER_ADMIN)
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiSuccessObjResponse(EmailTemplateDto)
  @ApiOperation({ summary: 'Get email template by id' })
  findOne(@Param('id', RequireIdPipe) id: string): Promise<EmailTemplateDto> {
    return this.emailTemplateService.findOne({ id });
  }

  @Get('/by-key/:key')
  @Permissions(permissions.SUPER_ADMIN)
  @ApiParam({
    name: 'key',
    required: true,
  })
  @ApiSuccessObjResponse(EmailTemplateDto)
  @ApiOperation({ summary: 'Get email template by key' })
  findOneByKey(
    @Param('key', XSSFilterPipe) key: string,
  ): Promise<EmailTemplateDto> {
    return this.emailTemplateService.findOne({ key });
  }

  @Put(':id')
  @Permissions(permissions.SUPER_ADMIN)
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiSuccessObjResponse(EmailTemplateDto)
  @ApiOperation({ summary: 'Update email template' })
  update(
    @Param('id', XSSFilterPipe) id: string,
    @Body() data: EmailTemplateUpdateDto,
  ): Promise<EmailTemplateDto> {
    return this.emailTemplateService.update(id, data);
  }
}

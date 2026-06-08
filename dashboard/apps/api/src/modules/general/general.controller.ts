import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ISiteInfo, permissions } from '@seven-auto/libs';
import { Permissions } from 'src/decorators/permissions.decorator';
import { SeedDataDto } from 'src/dto/utils.dto';
import { PermissionsGuard } from 'src/guards/permissions.guard';

import { SiteInfoUpdateDto } from './general.dto';
import { GeneralService } from './general.service';
import { SeedDataService } from './seedData.service';

@Controller('general')
@ApiTags('General')
export class GeneralController {
  constructor(
    private readonly generalService: GeneralService,
    private readonly seedDataService: SeedDataService,
  ) {}

  @Get('/status')
  @ApiOperation({ summary: 'Get status' })
  async status(): Promise<{ status: string }> {
    return {
      status: 'ok',
    };
  }

  @Get('/site-info')
  @ApiOperation({ summary: 'Get site info' })
  async getSiteInfo(): Promise<ISiteInfo> {
    return this.generalService.getSiteInfo();
  }

  @Post('/site-info')
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(permissions.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update site info' })
  async updateSiteInfo(@Body() data: SiteInfoUpdateDto): Promise<ISiteInfo> {
    return this.generalService.updateSiteInfo(data);
  }

  @Post('/seed-data')
  async seedData(@Query() { key, type }: SeedDataDto) {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    if (key === process.env.GENERAL_KEY) {
      return this.seedDataService.run(type);
    } else {
      throw new BadRequestException('Invalid key');
    }
  }
}

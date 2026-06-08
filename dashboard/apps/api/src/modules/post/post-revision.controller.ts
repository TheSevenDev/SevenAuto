import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { permissions } from '@seven-auto/libs';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { XSSFilterPipe } from 'src/pipes/xssFilter.pipe';

import { PostRevisionFindManyDto } from './dto/postRevision.dto';
import { PostRevisionService } from './service/postRevision.service';

@Controller('post')
@ApiTags('Post')
export class PostRevisionController {
  constructor(private readonly postRevisionService: PostRevisionService) {}

  @Get(':id/revisions')
  @ApiOperation({ summary: 'Get post revisions' })
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  @Permissions(permissions.POST_UPDATE)
  async findManyRevisions(
    @Param('id', XSSFilterPipe) postId: string,
    @Query() args: PostRevisionFindManyDto,
  ) {
    return this.postRevisionService.findMany({ id: postId, ...args });
  }

  // NOTE: This endpoint name/verb is legacy. It returns a revision detail by id.
  @Post(':id/revisions')
  @ApiOperation({ summary: 'Get revision detail' })
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  @Permissions(permissions.POST_UPDATE)
  async getRevisionDetail(@Param('id', XSSFilterPipe) revisionId: string) {
    return this.postRevisionService.findOneById({ id: revisionId });
  }
}

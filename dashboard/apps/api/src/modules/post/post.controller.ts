import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
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
import {
  type IFindManyResponse,
  type IPost,
  type IUser,
  permissions,
} from '@seven-auto/libs';
import { ApiSuccessObjResponse } from 'src/decorators/apiResponse.decorator';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { Permissions } from 'src/decorators/permissions.decorator';
import { FindManyDto } from 'src/dto/utils.dto';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { UserGuard } from 'src/guards/user.guard';
import { XSSFilterPipe } from 'src/pipes/xssFilter.pipe';

import { PostCreateDto, PostUpdateDto } from './dto/postAction.dto';
import { PostFindManyDto } from './dto/postQuery.dto';
import { PostSummaryDto } from './dto/postSummary.dto';
import { PostService } from './post.service';
import { PostActionService } from './service/postAction.service';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postActionService: PostActionService,
  ) {}

  @Get('/slug/:slug')
  @ApiParam({
    name: 'slug',
    required: true,
  })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Get post by slug' })
  findOneBySlug(
    @Param('slug') slug: string,
    @CurrentUser() currentUser: IUser,
  ): Promise<IPost> {
    return this.postService.findOneBySlug(slug, currentUser);
  }

  @Get('/trending')
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Get trending post' })
  trendingPosts(@Query() args: PostFindManyDto): Promise<IPost[]> {
    return this.postService.trendingPosts(args);
  }

  @Get('/summary')
  @ApiSuccessObjResponse(PostSummaryDto)
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Post Summary' })
  getPostSummary(@CurrentUser() currentUser: IUser): Promise<PostSummaryDto> {
    return this.postService.getPostSummary({ currentUser });
  }

  @Get('/sitemap/count')
  @ApiOperation({ summary: 'Get Sitemap count' })
  sitemapCount(): Promise<number> {
    return this.postService.sitemapCount();
  }

  @Get('/sitemap')
  @ApiOperation({ summary: 'Get Sitemap' })
  sitemap(@Query() args: FindManyDto): Promise<IPost[]> {
    return this.postService.sitemap(args);
  }

  @Get('/count')
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Count Post' })
  countPost(
    @Query() args: PostFindManyDto,
    @CurrentUser() currentUser: IUser,
  ): Promise<number> {
    return this.postService.countPost(args, currentUser);
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiOperation({ summary: 'Find one Post' })
  async findOneById(
    @Param('id', XSSFilterPipe) id: string,
    @CurrentUser() currentUser: IUser,
  ): Promise<IPost> {
    return this.postService.findOneById(id, currentUser);
  }

  @Post('/:id/statistic')
  async updateStatistic(
    @Param('id', XSSFilterPipe) id: string,
  ): Promise<boolean> {
    return this.postService.updateStatistic(id);
  }

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Find Many Post' })
  async findMany(
    @Query() args: PostFindManyDto,
    @CurrentUser() currentUser: IUser,
  ): Promise<IFindManyResponse<IPost>> {
    return this.postService.findMany(args, currentUser);
  }

  @Post('/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create post' })
  @UseGuards(PermissionsGuard)
  @Permissions(permissions.POST_CREATE)
  async create(
    @Body() data: PostCreateDto,
    @CurrentUser() currentUser: IUser,
  ): Promise<IPost> {
    return this.postActionService.create(data, currentUser);
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update post by id' })
  @UseGuards(PermissionsGuard)
  @Permissions(permissions.POST_UPDATE)
  async update(
    @Param('id', XSSFilterPipe) id: string,
    @Body() data: PostUpdateDto,
    @CurrentUser() currentUser: IUser,
  ): Promise<IPost> {
    return this.postActionService.update({
      args: { ...data, id },
      currentUser,
    });
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiOperation({ summary: 'Delete post' })
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  @Permissions(permissions.POST_DELETE)
  delete(
    @Param('id', XSSFilterPipe) id: string,
    @CurrentUser() currentUser: IUser,
  ): Promise<IPost> {
    return this.postActionService.delete(id, currentUser);
  }
}

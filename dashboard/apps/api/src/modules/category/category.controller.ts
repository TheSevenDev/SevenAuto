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
  ICategory,
  IFindCategoryWithPostResponse,
  IFindManyResponse,
  IPost,
  permissions,
} from '@seven-auto/libs';
import { Permissions } from 'src/decorators/permissions.decorator';
import { FindManyDto, SelectDto } from 'src/dto/utils.dto';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { RequireIdPipe } from 'src/pipes/requireId.pipe';
import { XSSFilterPipe } from 'src/pipes/xssFilter.pipe';

import { CategoryCreateDto } from './dto/categoryCreate.dto';
import {
  CategoryFindManyDto,
  CategoryFindManyPostDto,
} from './dto/categoryQuery.dto';
import { CategoryUpdateDto } from './dto/categoryUpdate.dto';
import { CategoryCreateService } from './service/categoryCreate.service';
import { CategoryDeleteService } from './service/categoryDelete.service';
import { CategoryQueryService } from './service/categoryQuery.service';
import { CategoryUpdateService } from './service/categoryUpdate.service';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(
    private readonly categoryCreateService: CategoryCreateService,
    private readonly categoryQueryService: CategoryQueryService,
    private readonly categoryUpdateService: CategoryUpdateService,
    private readonly categoryDeleteService: CategoryDeleteService,
  ) {}

  @Get('/slug/:slug')
  @ApiParam({
    name: 'slug',
    required: true,
  })
  @ApiOperation({ summary: 'Find one Category by slug' })
  findOneBySlug(@Param('slug') slug: string): Promise<ICategory> {
    return this.categoryQueryService.findOneBySlug(slug);
  }

  @Get('/posts/:slug')
  @ApiParam({
    name: 'slug',
    required: true,
  })
  @ApiOperation({ summary: 'Find all post in category' })
  findAllPosts(
    @Param('slug') slug: string,
    @Query() args: CategoryFindManyPostDto,
  ): Promise<IFindCategoryWithPostResponse> {
    return this.categoryQueryService.findAllPosts(slug, args);
  }

  @Get('/top')
  @ApiOperation({ summary: 'Top category' })
  getTopCategories(
    @Query() args: FindManyDto,
  ): Promise<IFindManyResponse<ICategory>> {
    return this.categoryQueryService.topCategory(args);
  }

  @Get('/sitemap/count')
  @ApiOperation({ summary: 'Get Sitemap count' })
  sitemapCount(): Promise<number> {
    return this.categoryQueryService.sitemapCount();
  }

  @Get('/sitemap')
  @ApiOperation({ summary: 'Get Sitemap' })
  sitemap(@Query() args: FindManyDto): Promise<IPost[]> {
    return this.categoryQueryService.sitemap(args);
  }

  @Get('/')
  @ApiOperation({ summary: 'Find all Categories' })
  findMany(
    @Query() args: CategoryFindManyDto,
  ): Promise<IFindManyResponse<ICategory>> {
    return this.categoryQueryService.findMany(args);
  }

  @Post('/')
  @ApiOperation({ summary: 'Create Category' })
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(permissions.CATEGORY_CREATE)
  async create(@Body() args: CategoryCreateDto): Promise<ICategory> {
    return this.categoryCreateService.create(args);
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiOperation({ summary: 'Find one Category by id' })
  findOne(
    @Param('id', XSSFilterPipe, RequireIdPipe) id: string,
    @Query() { select }: SelectDto,
  ): Promise<ICategory> {
    return this.categoryQueryService.findOneById(id, select);
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @UseGuards(PermissionsGuard)
  @Permissions(permissions.CATEGORY_UPDATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Category' })
  update(
    @Param('id', XSSFilterPipe, RequireIdPipe) id: string,
    @Body() args: CategoryUpdateDto,
  ): Promise<ICategory> {
    return this.categoryUpdateService.update(id, args);
  }

  @Delete('/:id')
  @UseGuards(PermissionsGuard)
  @Permissions(permissions.CATEGORY_DELETE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Categories' })
  async delete(
    @Param('id', XSSFilterPipe, XSSFilterPipe) id: string,
  ): Promise<ICategory> {
    return this.categoryDeleteService.deleteCategoryById(id);
  }
}

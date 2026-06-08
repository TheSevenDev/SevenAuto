import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  type IFindManyResponse,
  type IMedia,
  type IUser,
  permissions,
} from '@seven-auto/libs';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { Permissions } from 'src/decorators/permissions.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { XSSFilterPipe } from 'src/pipes/xssFilter.pipe';

import { MediaFindManyDto } from './dto/mediaQuery.dto';
import { MediaSaveRemoteDto } from './dto/mediaRemote.dto';
import { MediaUpdateDto } from './dto/mediaUpdate.dto';
import { MediaUploadFromUrlDto, MediaUploadQueryDto } from './media.dto';
import { MediaQueryService } from './service/mediaQuery.service';
import { MediaUpdateService } from './service/mediaUpdate.service';
import { MediaUploadImageService } from './service/mediaUploadImage.service';

@Controller('media')
@ApiTags('Media')
export class MediaController {
  constructor(
    private readonly mediaUploadImageService: MediaUploadImageService,
    private readonly mediaQueryService: MediaQueryService,
    private readonly mediaUpdateService: MediaUpdateService,
  ) {}

  @Post('/')
  @ApiOperation({ summary: 'Upload media.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        key: {
          type: 'string',
        },
        signature: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  // @Permissions(permissions.media.MEDIA_CREATE)
  upload(
    @Body() args: MediaUploadQueryDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: IUser,
  ): Promise<IMedia> {
    try {
      return this.mediaUploadImageService.uploadImage({
        data: { file, ...args },
        currentUser,
        isThrowError: true,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/url')
  @ApiOperation({ summary: 'Upload media by url.' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  // @Permissions(permissions.MEDIA_CREATE)
  uploadFromUrl(
    @Body() args: MediaUploadFromUrlDto,
    @CurrentUser() currentUser: IUser,
  ): Promise<IMedia> {
    try {
      return this.mediaUploadImageService.uploadImageFromUrl(args, currentUser);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('/delete-many')
  @ApiOperation({ summary: 'Delete many media.' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  // @Permissions(permissions.MEDIA_DELETE)
  deleteMany(
    @Body() args: { ids: string[] },
    @CurrentUser() currentUser: IUser,
  ): Promise<IMedia[]> {
    try {
      return this.mediaUploadImageService.deleteMany(args.ids, currentUser);
    } catch (error) {
      throw new HttpException(error, HttpStatus.FORBIDDEN);
    }
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiOperation({ summary: 'Delete Image.' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  // @Permissions(permissions.MEDIA_DELETE)
  delete(
    @Param('id', XSSFilterPipe) id: string,
    @CurrentUser() currentUser: IUser,
  ): Promise<IMedia> {
    try {
      return this.mediaUploadImageService.delete(id, currentUser);
    } catch (error) {
      throw new HttpException(error, HttpStatus.FORBIDDEN);
    }
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  findOneById(@Param('id', XSSFilterPipe) id: string): Promise<IMedia> {
    return this.mediaQueryService.findOneById(id);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  // @Permissions(permissions.MEDIA_VIEW)
  findMany(
    @Query() args: MediaFindManyDto,
    @CurrentUser() currentUser: IUser,
  ): Promise<IFindManyResponse<IMedia>> {
    return this.mediaQueryService.findMany(args, currentUser);
  }

  @Post('/save-remote')
  @ApiOperation({
    description:
      'Create a record for save info unsplash image which a post use',
  })
  saveInfoUnsplash(@Body() args: MediaSaveRemoteDto): Promise<IMedia> {
    return this.mediaUpdateService.saveImageRemote(args);
  }

  @Put('/:id')
  @UseGuards(PermissionsGuard)
  @Permissions(permissions.MEDIA_UPDATE)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id', XSSFilterPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() args: MediaUpdateDto,
    @CurrentUser() currentUser: IUser,
  ): Promise<IMedia> {
    return this.mediaUploadImageService.updateMedia(
      { ...args, file, id },
      currentUser,
    );
  }

  @Post('/remove-not-used')
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(permissions.SUPER_ADMIN)
  async removeMediaNotUsed(): Promise<IMedia[]> {
    return this.mediaUploadImageService.deleteAllMediaNotUse();
  }
}

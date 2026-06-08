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
  type IUser,
  permissions,
} from '@seven-auto/libs';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { Permissions } from 'src/decorators/permissions.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { RequireIdPipe } from 'src/pipes/requireId.pipe';
import { XSSFilterPipe } from 'src/pipes/xssFilter.pipe';

import { UserCreateDto, UserFindManyDto, UserUpdateDto } from './dto/user.dto';
import { UserActionService } from './service/userAction.service';
import { UserQueryService } from './service/userQuery.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userQuerySev: UserQueryService,
    private readonly userActionSev: UserActionService,
  ) {}

  @Get('/username/:username')
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(permissions.USER_VIEW)
  @ApiParam({
    name: 'username',
    required: true,
  })
  @ApiOperation({ summary: 'Get User by username' })
  findOneByUsername(@Param('username') username: string): Promise<IUser> {
    return this.userQuerySev.findOne({ username });
  }

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(permissions.USER_VIEW)
  @ApiOperation({ summary: 'Get all users' })
  findMany(
    @Query() args: UserFindManyDto,
    @CurrentUser() currentUser: IUser,
  ): Promise<IFindManyResponse<IUser>> {
    return this.userQuerySev.findMany(args, currentUser);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get users count' })
  countUsers(
    @Query() args: UserFindManyDto,
    @CurrentUser() currentUser: IUser,
  ): Promise<number> {
    return this.userQuerySev.count(args, currentUser);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  @Permissions(permissions.USER_VIEW)
  @ApiOperation({ summary: 'Get user by id' })
  async findOne(
    @Param('id', RequireIdPipe) id: string,
    @CurrentUser() currentUser: IUser,
  ): Promise<IUser> {
    return this.userQuerySev.findOne({ id }, currentUser);
  }

  @Post('/')
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(permissions.USER_CREATE)
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() data: UserCreateDto): Promise<IUser> {
    return this.userActionSev.create(data);
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update user' })
  update(
    @Param('id', XSSFilterPipe) id: string,
    @Body() data: UserUpdateDto,
    @CurrentUser() currentUser: IUser,
  ): Promise<IUser> {
    return this.userActionSev.update({ ...data, id }, currentUser);
  }

  @Delete('/delete-many')
  @ApiOperation({ summary: 'Delete many user.' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Permissions(permissions.USER_DELETE)
  deleteMany(
    @Body() args: { ids: string[] },
    @CurrentUser() currentUser: IUser,
  ): Promise<IUser[]> {
    return this.userActionSev.deleteMany(args.ids, currentUser);
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiOperation({ summary: 'Delete user' })
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  @Permissions(permissions.USER_DELETE)
  delete(
    @Param('id', XSSFilterPipe) id: string,
    @CurrentUser() currentUser: IUser,
  ): Promise<IUser> {
    return this.userActionSev.delete(id, currentUser);
  }
}

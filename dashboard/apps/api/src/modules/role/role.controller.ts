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
import { IFindManyResponse, IRole, IUser, permissions } from '@seven-auto/libs';
import { Permissions } from 'src/decorators/permissions.decorator';
import { FindManyDto } from 'src/dto/utils.dto';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { XSSFilterPipe } from 'src/pipes/xssFilter.pipe';

import { PermissionUpdateDto, RoleCreateDto, RoleUpdateDto } from './role.dto';
import { RoleService } from './roleService';

@Controller('role')
@ApiTags('Role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/permissions')
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(permissions.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all permissions' })
  getPermissions(): Promise<string[]> {
    return this.roleService.findManyPermission();
  }

  @Post('/permissions')
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(permissions.SUPER_ADMIN)
  @ApiOperation({ summary: 'Reload permission' })
  async syncPermissions(): Promise<{
    length: number;
    status: boolean;
  }> {
    return this.roleService.syncPermissions();
  }

  @Post(':id/add')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(permissions.SUPER_ADMIN)
  @ApiOperation({ summary: 'Add permission' })
  async addPermission(
    @Param('id', XSSFilterPipe) id: string,
    @Body() { key }: PermissionUpdateDto,
  ): Promise<boolean> {
    return this.roleService.addPermission(id, key);
  }

  @Post(':id/remove')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(permissions.SUPER_ADMIN)
  @ApiOperation({ summary: 'Remove permission' })
  async removePermission(
    @Param('id', XSSFilterPipe) id: string,
    @Body() { key }: PermissionUpdateDto,
  ): Promise<boolean> {
    return this.roleService.removePermission(id, key);
  }

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(permissions.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all roles' })
  getRoles(@Query() args: FindManyDto): Promise<IFindManyResponse<IRole>> {
    return this.roleService.findMany(args);
  }

  @Post('/')
  @Permissions(permissions.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create role' })
  async createRole(@Body() data: RoleCreateDto): Promise<IRole> {
    return this.roleService.create(data);
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(permissions.SUPER_ADMIN)
  @ApiOperation({ summary: 'Find one role' })
  async findOneById(@Param('id', XSSFilterPipe) id: string): Promise<IRole> {
    return this.roleService.findOne(id);
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(permissions.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update role' })
  update(
    @Param('id', XSSFilterPipe) id: string,
    @Body() data: RoleUpdateDto,
  ): Promise<IUser> {
    return this.roleService.update(id, data);
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiOperation({ summary: 'Delete Role' })
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  @Permissions(permissions.SUPER_ADMIN)
  delete(@Param('id', XSSFilterPipe) id: string): Promise<IRole> {
    return this.roleService.delete(id);
  }
}

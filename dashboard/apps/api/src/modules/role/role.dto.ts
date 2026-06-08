import { ApiProperty } from '@nestjs/swagger';
import {
  IPermissionUpdate,
  IRole,
  IRoleCreate,
  IRoleUpdate,
} from '@seven-auto/libs';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { BaseEntityDto } from 'src/dto/utils.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { transformArray } from 'src/transform/transform.array';

export class RoleDto extends BaseEntityDto implements IRole {
  @ApiProperty({
    type: 'string',
    example: 'example',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    type: Array,
    example: ['example'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => transformArray(value))
  permissions?: string[];

  @ApiProperty({
    type: Array,
    example: [],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => transformArray(value))
  users?: UserDto[];
}
export class RoleCreateDto implements IRoleCreate {
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'example',
    required: true,
  })
  name: string;
}

export class RoleUpdateDto
  extends RoleCreateDto
  implements Omit<IRoleUpdate, 'id'> {}

export class PermissionUpdateDto implements IPermissionUpdate {
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'example',
    required: true,
  })
  key: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserHelperGetMetaDto {
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'xxx',
    required: true,
  })
  @IsNotEmpty({ message: 'User id is required' })
  userId: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'xxx',
    required: true,
  })
  @IsNotEmpty({ message: 'Key is required' })
  key: string;
}

export class UserHelperUpdateMetaDto {
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'xxx',
    required: true,
  })
  @IsNotEmpty({ message: 'User id is required' })
  userId: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'xxx',
    required: true,
  })
  @IsNotEmpty({ message: 'Key is required' })
  key: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'xxx',
    required: false,
  })
  value?: string;
}

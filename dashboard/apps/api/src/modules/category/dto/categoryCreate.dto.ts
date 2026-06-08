import { ApiProperty } from '@nestjs/swagger';
import { EStatus } from '@prisma/client';
import { ICategoryCreate } from '@seven-auto/libs';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CategoryCreateDto implements ICategoryCreate {
  @IsString()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  @IsOptional()
  slug?: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  @IsOptional()
  title: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  @IsOptional()
  description?: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  @IsOptional()
  color?: string;

  @IsString()
  @ApiProperty({
    required: false,
    example: EStatus.ACTIVE,
  })
  @IsOptional()
  status?: EStatus;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: 'number',
    example: 1,
    required: false,
  })
  @Transform(({ value }) => Number(value))
  sort?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 1,
    required: false,
  })
  imageId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 1,
    required: false,
  })
  iconId?: string;
}

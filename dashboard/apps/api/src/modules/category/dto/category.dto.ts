import { ApiProperty } from '@nestjs/swagger';
import { EStatus } from '@prisma/client';
import { ICategory } from '@seven-auto/libs';
import { Transform } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { BaseEntityDto } from 'src/dto/utils.dto';
import { MediaDto } from 'src/modules/media/dto/media.dto';

export class CategoryDto extends BaseEntityDto implements ICategory {
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
  title?: string;

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

  @ApiProperty({
    enum: EStatus,
    required: false,
    example: EStatus.ACTIVE,
  })
  @IsString()
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

  @ApiProperty({
    type: () => MediaDto,
    example: {},
    required: false,
  })
  @IsOptional()
  @IsObject()
  mediaImage?: MediaDto;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 1,
    required: false,
  })
  iconId?: string;

  @ApiProperty({
    type: () => MediaDto,
    example: {},
    required: false,
  })
  @IsOptional()
  @IsObject()
  mediaIcon?: MediaDto;
}

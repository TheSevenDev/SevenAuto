import { ApiProperty } from '@nestjs/swagger';
import {
  ELanguage,
  ESeedData,
  IBaseEntity,
  IFindMany,
  ISelect,
} from '@seven-auto/libs';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { authError } from 'src/messages/auth.message';
import { QueryArrayParam } from 'src/transform/query-array.decorator';

import { transformDate } from '../transform/transform.date';

export class SelectDto implements ISelect {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 'basic',
    enum: ['basic', 'detail', 'full'],
    required: false,
  })
  select?: 'basic' | 'detail' | 'full' = 'basic';
}

export class BaseEntityDto implements IBaseEntity {
  @ApiProperty({ type: 'string', example: '1', required: false })
  @IsOptional()
  @IsString()
  id: string;

  @ApiProperty({
    type: 'string',
    example: new Date().toISOString(),
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => transformDate(value))
  createdAt: Date;

  @ApiProperty({
    type: 'string',
    example: new Date().toISOString(),
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => transformDate(value))
  updatedAt: Date;
}

export class FindManyDto extends SelectDto implements IFindMany {
  @IsInt()
  @Min(0)
  @Max(100)
  @ApiProperty({ type: 'number', example: 10, required: false })
  @Transform(({ value }) => Number(value))
  take?: number = 10;

  @IsInt()
  @ApiProperty({ type: 'number', example: 0, required: false })
  @Transform(({ value }) => Number(value))
  skip?: number = 0;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', example: '', required: false })
  filter?: string;

  @QueryArrayParam('string')
  @ApiProperty({ type: 'string', example: [], required: false })
  includeIds?: string[];

  @QueryArrayParam('string')
  @ApiProperty({ type: 'string', example: [], required: false })
  excludeIds?: string[];

  @IsDate()
  @IsOptional()
  @ApiProperty({ type: 'string', required: false })
  @Transform(({ value }) => transformDate(value))
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({ type: 'string', required: false })
  @Transform(({ value }) => transformDate(value))
  endDate?: Date;
}

export class GeneralKeyDto {
  @IsString()
  @ApiProperty({ type: 'string', example: 'seven-auto', required: true })
  key: string;
}

export class SeedDataDto extends GeneralKeyDto {
  @IsEnum(ESeedData)
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 'user',
    enum: ESeedData,
    required: true,
  })
  type: ESeedData;
}

export class SuccessResponseDto<T> {
  data: T;
}

export class LanguageDto {
  @IsEnum(ELanguage)
  @ApiProperty({ enum: ELanguage, example: ELanguage.VI, required: true })
  @IsOptional()
  language?: ELanguage = ELanguage.VI;
}

export class EmailRequireDto {
  @IsString()
  @ApiProperty({ type: 'string', example: 'test@example.com', required: true })
  @IsNotEmpty({ message: authError.email_required })
  email: string;
}

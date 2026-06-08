import { ApiProperty, PartialType } from '@nestjs/swagger';
import { EStatusProcess, Prisma } from '@prisma/client';
import {
  EPaymentType,
  IPayment,
  IPaymentFindMany,
  IPaymentSummary,
  IPaymentUpdate,
} from '@seven-auto/libs';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BaseEntityDto, FindManyDto } from 'src/dto/utils.dto';
import { transformDate } from 'src/transform/transform.date';
import { OrderByQuery } from 'src/transform/transform-order-by';

import { UserDto } from '../user/dto/user.dto';

export class PaymentDto extends BaseEntityDto implements IPayment {
  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsOptional()
  @IsString()
  uniqueId?: string;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ type: () => UserDto, example: '{}', required: true })
  @IsObject()
  @IsOptional()
  user?: UserDto;

  @IsInt()
  @ApiProperty({ type: 'number', example: 0, required: true })
  @IsOptional()
  amount?: number;

  @IsInt()
  @ApiProperty({ type: 'number', example: 0, required: true })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  price?: number;

  @ApiProperty({
    enum: EPaymentType,
    example: EPaymentType.BANK_TRANSFER,
    required: true,
  })
  @IsString()
  @IsOptional()
  type?: EPaymentType;

  @ApiProperty({
    enum: EStatusProcess,
    example: EStatusProcess.PENDING,
    required: true,
  })
  @IsString()
  @IsOptional()
  status?: EStatusProcess;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsOptional()
  @IsString()
  bankCode?: string;

  @ApiProperty({ type: 'string', example: 'Dang ky khoa hoc', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  content?: string;

  @ApiProperty({
    type: 'string',
    example: new Date().toISOString(),
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => transformDate(value))
  doneAt: Date;
}

export class PaymentCreateDto {
  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ type: 'string', example: 'Nguyen Van A', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  name?: string;

  @ApiProperty({ type: 'string', example: 'a@example.com', required: false })
  @IsOptional()
  @IsEmail()
  @MaxLength(190)
  email?: string;

  @ApiProperty({ type: 'string', example: '0901234567', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({
    enum: EPaymentType,
    example: EPaymentType.BANK_TRANSFER,
    required: true,
  })
  @IsString()
  type: EPaymentType;

  @IsInt()
  @ApiProperty({ type: 'number', example: 0, required: true })
  @Transform(({ value }) => Number(value))
  amount: number;

  @IsInt()
  @ApiProperty({ type: 'number', example: 0, required: true })
  @Transform(({ value }) => Number(value))
  price: number;

  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsOptional()
  @IsString()
  bankCode?: string;

  @ApiProperty({ type: 'string', example: 'Dang ky khoa hoc', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  content?: string;
}

export class PaymentUpdateDto
  extends PartialType(PaymentCreateDto)
  implements IPaymentUpdate
{
  @ApiProperty({
    enum: EStatusProcess,
    example: EStatusProcess.PENDING,
    required: true,
  })
  @IsString()
  @IsOptional()
  status?: EStatusProcess;
}

export class PaymentFindManyDto
  extends FindManyDto
  implements IPaymentFindMany
{
  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    enum: EPaymentType,
    example: EPaymentType.BANK_TRANSFER,
    required: false,
  })
  @IsOptional()
  @IsEnum(EPaymentType)
  type?: EPaymentType;

  @ApiProperty({
    enum: EStatusProcess,
    example: EStatusProcess.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(EStatusProcess)
  status?: EStatusProcess;

  @ApiProperty({ type: 'number', example: 0, required: false })
  @IsOptional()
  @IsInt()
  amount_gte?: number;

  @ApiProperty({ type: 'number', example: 0, required: false })
  @IsOptional()
  @IsInt()
  amount_lte?: number;

  @ApiProperty({ type: 'number', example: 0, required: false })
  @IsOptional()
  @IsInt()
  price_gte?: number;

  @ApiProperty({ type: 'number', example: 0, required: false })
  @IsOptional()
  @IsInt()
  price_lte?: number;

  @IsDate()
  @IsOptional()
  @ApiProperty({ type: 'string', required: false })
  @Transform(({ value }) => transformDate(value))
  createdAt_gte?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({ type: 'string', required: false })
  @Transform(({ value }) => transformDate(value))
  createdAt_lte?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({ type: 'string', required: false })
  @Transform(({ value }) => transformDate(value))
  updatedAt_gte?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({ type: 'string', required: false })
  @Transform(({ value }) => transformDate(value))
  updatedAt_lte?: Date;

  @OrderByQuery()
  orderBy?: Prisma.PaymentOrderByWithRelationInput;
}

export class PaymentSummaryDto implements IPaymentSummary {
  @ApiProperty({ type: 'number', example: 0, required: true })
  @IsInt()
  pending: number;

  @ApiProperty({ type: 'number', example: 0, required: true })
  @IsInt()
  processing: number;

  @ApiProperty({ type: 'number', example: 0, required: true })
  @IsInt()
  completed: number;

  @ApiProperty({ type: 'number', example: 0, required: true })
  @IsInt()
  canceled: number;
}

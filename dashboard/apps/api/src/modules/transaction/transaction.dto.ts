import { ApiProperty, PartialType } from '@nestjs/swagger';
import { EStatusProcess, Prisma } from '@prisma/client';
import {
  EBalanceType,
  ETransactionType,
  ITransaction,
  ITransactionConvertCommission,
  ITransactionCreate,
  ITransactionFindMany,
  ITransactionUpdate,
} from '@seven-auto/libs';
import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsObject, IsOptional, IsString } from 'class-validator';
import { BaseEntityDto, FindManyDto } from 'src/dto/utils.dto';
import { transformDate } from 'src/transform/transform.date';
import { OrderByQuery } from 'src/transform/transform-order-by';

import { UserDto } from '../user/dto/user.dto';

export class TransactionDto extends BaseEntityDto implements ITransaction {
  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ type: () => UserDto, example: '{}', required: true })
  @IsObject()
  @IsOptional()
  user?: UserDto;

  @ApiProperty({
    enum: ETransactionType,
    example: ETransactionType.PAYMENT,
    required: true,
  })
  @IsString()
  @IsOptional()
  type?: ETransactionType;

  @IsInt()
  @ApiProperty({ type: 'number', example: 0, required: true })
  @IsOptional()
  newBalance?: number;

  @IsInt()
  @ApiProperty({ type: 'number', example: 0, required: true })
  @IsOptional()
  amount?: number;

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
  refId?: string;
}

export class TransactionCreateDto implements ITransactionCreate {
  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsString()
  userId: string;

  @ApiProperty({
    enum: ETransactionType,
    example: ETransactionType.PAYMENT,
    required: true,
  })
  @IsString()
  type: ETransactionType;

  @ApiProperty({
    enum: EBalanceType,
    example: EBalanceType.CREDIT,
    required: true,
  })
  @IsString()
  @IsOptional()
  balanceType?: EBalanceType = EBalanceType.CREDIT;

  @IsInt()
  @ApiProperty({ type: 'number', example: 0, required: true })
  @Transform(({ value }) => Number(value))
  amount: number;
}

export class TransactionUpdateDto
  extends PartialType(TransactionCreateDto)
  implements ITransactionUpdate
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

export class TransactionFindManyDto
  extends FindManyDto
  implements ITransactionFindMany
{
  @ApiProperty({ type: 'string', example: 'example', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    enum: ETransactionType,
    example: ETransactionType.PAYMENT,
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: ETransactionType;

  @ApiProperty({
    enum: EStatusProcess,
    example: EStatusProcess.PENDING,
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: EStatusProcess;

  @ApiProperty({
    enum: EBalanceType,
    example: EBalanceType.CREDIT,
    required: false,
  })
  @IsOptional()
  @IsString()
  balanceType?: EBalanceType;

  @ApiProperty({ type: 'number', example: 0, required: false })
  @IsOptional()
  @IsInt()
  amount_gte?: number;

  @ApiProperty({ type: 'number', example: 0, required: false })
  @IsOptional()
  @IsInt()
  amount_lte?: number;

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
  orderBy?: Prisma.TransactionOrderByWithRelationInput;
}

export class TransactionConvertCommissionDto implements ITransactionConvertCommission {
  @ApiProperty({ type: 'number', example: 0, required: true })
  @IsInt()
  @Transform(({ value }) => Number(value))
  amount: number;
}

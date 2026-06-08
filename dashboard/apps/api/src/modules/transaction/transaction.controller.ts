import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
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
  IFindManyResponse,
  ITransaction,
  type IUser,
  permissions,
} from '@seven-auto/libs';
import {
  ApiErrorResponse,
  ApiFindManyResponse,
  ApiSuccessObjResponse,
} from 'src/decorators/apiResponse.decorator';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { Permissions } from 'src/decorators/permissions.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { XSSFilterPipe } from 'src/pipes/xssFilter.pipe';

import {
  TransactionConvertCommissionDto,
  TransactionCreateDto,
  TransactionDto,
  TransactionFindManyDto,
  TransactionUpdateDto,
} from './transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
@ApiTags('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/')
  @ApiFindManyResponse(TransactionDto)
  @ApiErrorResponse()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Find many transactions' })
  async findMany(
    @Query() args: TransactionFindManyDto,
    @CurrentUser() currentUser: IUser,
  ): Promise<IFindManyResponse<ITransaction>> {
    return this.transactionService.findMany({
      args,
      currentUser,
    });
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiSuccessObjResponse(TransactionDto)
  @ApiOperation({ summary: 'Get transaction with id' })
  findOne(
    @CurrentUser() currentUser: IUser,
    @Param('id', XSSFilterPipe) id: string,
  ): Promise<TransactionDto> {
    return this.transactionService.findOne({
      currentUser,
      id,
    }) as Promise<TransactionDto>;
  }

  @Post('/approve/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @Permissions(permissions.TRANSACTION_UPDATE)
  @ApiOperation({ summary: 'Approve transaction' })
  approve(
    @CurrentUser() currentUser: IUser,
    @Param('id', XSSFilterPipe) id: string,
  ): Promise<ITransaction> {
    return this.transactionService.approve({
      currentUser,
      id,
    });
  }

  @Post('/reject/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @Permissions(permissions.TRANSACTION_UPDATE)
  @ApiOperation({ summary: 'Reject transaction' })
  reject(
    @CurrentUser() currentUser: IUser,
    @Param('id', XSSFilterPipe) id: string,
  ): Promise<ITransaction> {
    return this.transactionService.reject({
      currentUser,
      id,
    });
  }

  @Post('/convert')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Convert credits to commission' })
  convert(
    @CurrentUser() currentUser: IUser,
    @Body() args: TransactionConvertCommissionDto,
  ): Promise<boolean> {
    return this.transactionService.convertCommission({
      args,
      currentUser,
    });
  }

  @Post('/')
  @ApiSuccessObjResponse(TransactionDto)
  @Permissions(permissions.TRANSACTION_CREATE)
  @ApiOperation({ summary: 'Create transaction' })
  create(
    @CurrentUser() currentUser: IUser,
    @Body() args: TransactionCreateDto,
  ): Promise<ITransaction> {
    return this.transactionService.create({ args, currentUser });
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiSuccessObjResponse(TransactionDto)
  @ApiErrorResponse()
  @Permissions(permissions.TRANSACTION_UPDATE)
  @ApiOperation({ summary: 'Update transaction' })
  update(
    @Param('id', XSSFilterPipe) id: string,
    @Body() args: TransactionUpdateDto,
    @CurrentUser() currentUser: IUser,
  ): Promise<ITransaction> {
    return this.transactionService.update({
      id,
      args,
      currentUser,
    });
  }
}

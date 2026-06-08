import {
  Body,
  Controller,
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
import { ELanguage } from '@prisma/client';
import {
  IFindManyResponse,
  IPayment,
  IPaymentSummary,
  type IUser,
  permissions,
} from '@seven-auto/libs';
import {
  ApiErrorResponse,
  ApiFindManyResponse,
  ApiSuccessObjResponse,
} from 'src/decorators/apiResponse.decorator';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { Language } from 'src/decorators/language.decorator';
import { Permissions } from 'src/decorators/permissions.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserGuard } from 'src/guards/user.guard';
import { XSSFilterPipe } from 'src/pipes/xssFilter.pipe';

import {
  PaymentCreateDto,
  PaymentDto,
  PaymentFindManyDto,
  PaymentSummaryDto,
  PaymentUpdateDto,
} from './payment.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
@ApiTags('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('/')
  @ApiFindManyResponse(PaymentDto)
  @ApiErrorResponse()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Find many payments' })
  async findMany(
    @Query() args: PaymentFindManyDto,
    @CurrentUser() currentUser: IUser,
  ): Promise<IFindManyResponse<IPayment>> {
    return this.paymentService.findMany({
      args,
      currentUser,
    });
  }

  @Get('/summary')
  @ApiSuccessObjResponse(PaymentSummaryDto)
  @ApiOperation({ summary: 'Get Payment Summary' })
  getSummary(
    @Query() args: PaymentFindManyDto,
    @CurrentUser() currentUser: IUser,
  ): Promise<IPaymentSummary> {
    return this.paymentService.getSummary(args, currentUser);
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiSuccessObjResponse(PaymentDto)
  @ApiOperation({ summary: 'Get payment with id' })
  findOne(@Param('id', XSSFilterPipe) id: string): Promise<PaymentDto> {
    return this.paymentService.findOne({ id }) as Promise<PaymentDto>;
  }

  @Post('/approve/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @Permissions(permissions.PAYMENT_APPROVE)
  @ApiOperation({ summary: 'Approve payment' })
  approve(
    @CurrentUser() currentUser: IUser,
    @Param('id', XSSFilterPipe) id: string,
  ): Promise<IPayment> {
    return this.paymentService.approve({
      currentUser,
      id,
    });
  }

  @Post('/reject/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @Permissions(permissions.PAYMENT_REJECT)
  @ApiOperation({ summary: 'Reject payment' })
  reject(
    @CurrentUser() currentUser: IUser,
    @Param('id', XSSFilterPipe) id: string,
    @Body('reason') reason: string,
  ): Promise<IPayment> {
    return this.paymentService.reject({
      currentUser,
      id,
      reason,
    });
  }

  @Post('/reopen/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @Permissions(permissions.PAYMENT_REOPEN)
  @ApiOperation({ summary: 'Reopen payment' })
  reopen(
    @CurrentUser() currentUser: IUser,
    @Param('id', XSSFilterPipe) id: string,
    @Body('reason') reason: string,
  ): Promise<IPayment> {
    return this.paymentService.reopen({
      currentUser,
      id,
      reason,
    });
  }

  @Post('/cancel/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Cancel payment' })
  cancel(
    @CurrentUser() currentUser: IUser,
    @Param('id', XSSFilterPipe) id: string,
  ): Promise<IPayment> {
    return this.paymentService.reject({
      id,
      currentUser,
    });
  }

  @Post('/')
  @ApiSuccessObjResponse(PaymentDto)
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Create payment' })
  create(
    @CurrentUser() currentUser: IUser,
    @Body() args: PaymentCreateDto,
    @Language() language: ELanguage,
    @Query('affiliateSessionId') affiliateSessionId?: string,
  ): Promise<IPayment> {
    return this.paymentService.create({
      args,
      currentUser,
      affiliateSessionId,
      language,
    });
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiSuccessObjResponse(PaymentDto)
  @ApiErrorResponse()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update payment' })
  update(
    @Param('id', XSSFilterPipe) id: string,
    @Body() args: PaymentUpdateDto,
    @CurrentUser() currentUser: IUser,
  ): Promise<IPayment> {
    return this.paymentService.update({
      id,
      args,
      currentUser,
    });
  }
}

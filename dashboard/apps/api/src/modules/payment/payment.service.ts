import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  ELanguage,
  EStatusProcess,
  EUserLevel,
  EUserStatus,
  Prisma,
} from '@prisma/client';
import {
  AuthVerifyType,
  ENotificationType,
  EPaymentType,
  ETransactionType,
  getCreditsFromPrice,
  hasPermission,
  IFindManyResponse,
  IPayment,
  IPaymentFindMany,
  IPaymentSummary,
  IPaymentUpdate,
  IUser,
  paymentPackages,
  permissions,
  randomString,
} from '@seven-auto/libs';
import { paymentError } from 'src/messages/payment.message';
import { permissionError } from 'src/messages/premission.message';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserActionService } from 'src/modules/user/service/userAction.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { NotificationHelper } from '../notification/notification.helper';
import { PaymentCreateDto } from './payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationHelper: NotificationHelper,
    private readonly userActionService: UserActionService,
    private readonly authService: AuthService,
  ) {}

  private async generateUniqueId(): Promise<string> {
    let uniqueId = randomString(8).toUpperCase();
    let maxWhile = 10;

    while (
      (await this.prisma.payment.findFirst({
        where: { uniqueId },
      })) &&
      maxWhile > 0
    ) {
      uniqueId = randomString(8).toUpperCase();
      maxWhile--;
    }

    if (maxWhile === 0) {
      throw new BadRequestException(paymentError.unique_id_error);
    }

    return uniqueId;
  }

  private async resolveOrCreateGuestUser(args: {
    email: string;
    phone?: string;
    name?: string;
    affiliateSessionId?: string;
    language: ELanguage;
  }) {
    const email = args.email.toLowerCase().trim();
    const phone = args.phone?.trim();

    const userByEmail = await this.prisma.user.findFirst({
      where: { email },
      select: { id: true },
    });
    if (userByEmail?.id) return userByEmail.id;

    if (phone) {
      const userByPhone = await this.prisma.user.findFirst({
        where: { phone },
        select: { id: true },
      });
      if (userByPhone?.id) return userByPhone.id;
    }

    const baseUsername = email.split('@')[0]?.replace(/[^a-zA-Z0-9]/g, '');
    const username =
      `${baseUsername || 'guest'}${randomString(5)}`.toLowerCase();

    let referrerId: string | undefined;
    if (args.affiliateSessionId) {
      referrerId = args.affiliateSessionId;
    }

    const user = await this.userActionService.create({
      email,
      phone,
      fullname: args.name?.trim() || baseUsername || 'Guest User',
      username,
      status: EUserStatus.PENDING,
      referrerId,
    });

    await this.authService.sendConfirmRegisterEmail(
      { email: user.email, verifyType: AuthVerifyType.LINK },
      args.language,
    );

    return user.id;
  }

  async findMany({
    args,
    currentUser,
  }: {
    args: IPaymentFindMany;
    currentUser: IUser;
  }): Promise<IFindManyResponse<IPayment>> {
    const {
      take,
      skip,
      orderBy,
      status,
      type,
      userId,
      price_gte,
      price_lte,
      amount_gte,
      amount_lte,
      createdAt_gte,
      createdAt_lte,
      updatedAt_gte,
      updatedAt_lte,
    } = args;

    const where: Prisma.PaymentWhereInput = {};

    const isAdmin = hasPermission(currentUser, [permissions.PAYMENT_MANAGE]);

    if (userId) {
      where.userId = userId;
    }

    if (!isAdmin) {
      where.userId = currentUser.id;
    }

    if (status) {
      where.status = status as EStatusProcess;
    }

    if (type) {
      where.type = type;
    }

    if (price_gte && price_lte) {
      where.price = {
        gte: price_gte,
        lte: price_lte,
      };
    } else if (price_gte) {
      where.price = { gte: price_gte };
    } else if (price_lte) {
      where.price = { lte: price_lte };
    }

    if (amount_gte && amount_lte) {
      where.amount = {
        gte: amount_gte,
        lte: amount_lte,
      };
    } else if (amount_gte) {
      where.amount = { gte: amount_gte };
    } else if (amount_lte) {
      where.amount = { lte: amount_lte };
    }

    if (createdAt_gte && createdAt_lte) {
      where.createdAt = {
        gte: new Date(createdAt_gte),
        lte: new Date(createdAt_lte),
      };
    } else if (createdAt_gte) {
      where.createdAt = { gte: new Date(createdAt_gte) };
    } else if (createdAt_lte) {
      where.createdAt = { lte: new Date(createdAt_lte) };
    }

    if (updatedAt_gte && updatedAt_lte) {
      where.updatedAt = {
        gte: new Date(updatedAt_gte),
        lte: new Date(updatedAt_lte),
      };
    } else if (updatedAt_gte) {
      where.updatedAt = { gte: new Date(updatedAt_gte) };
    } else if (updatedAt_lte) {
      where.updatedAt = { lte: new Date(updatedAt_lte) };
    }

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        take,
        skip,
        orderBy,
        include: { user: { include: { avatar: true } } },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      items: payments.map(this.transformPayment),
      total,
    };
  }

  async findOne({ id }: { id: string }): Promise<IPayment> {
    const where: Prisma.PaymentWhereUniqueInput = { id };

    const payment = await this.prisma.payment.findFirst({
      where,
      include: { user: { include: { avatar: true } } },
    });

    if (!payment) {
      throw new BadRequestException(paymentError.not_found);
    }

    return this.transformPayment(payment);
  }

  async create({
    args,
    currentUser,
    affiliateSessionId,
    language,
  }: {
    args: PaymentCreateDto;
    currentUser: IUser;
    affiliateSessionId?: string;
    language: ELanguage;
  }): Promise<IPayment> {
    const {
      userId,
      name,
      email,
      phone,
      type,
      amount,
      price,
      bankCode,
      content,
    } = args;

    let resolvedAmount = amount;

    const isAdmin = hasPermission(currentUser, [permissions.PAYMENT_CREATE]);

    const uniqueId = await this.generateUniqueId();

    let resolvedUserId = userId;
    if (currentUser?.id && !isAdmin) {
      resolvedUserId = currentUser.id;
    }

    const isGuestFlow = !currentUser?.id;
    if (isGuestFlow) {
      if (!email) {
        throw new BadRequestException(paymentError.guest_user_resolve_failed);
      }
      resolvedUserId = await this.resolveOrCreateGuestUser({
        email,
        phone,
        name,
        affiliateSessionId,
        language,
      });

      const countRecent = await this.prisma.payment.count({
        where: {
          userId: resolvedUserId,
          createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) },
        },
      });

      if (countRecent >= 5) {
        throw new BadRequestException(paymentError.guest_rate_limited);
      }
    }

    if (!resolvedUserId) {
      throw new BadRequestException(paymentError.guest_user_resolve_failed);
    }

    if (!isAdmin) {
      const pkg = paymentPackages.find((p) => p.credits === resolvedAmount);
      if (!pkg || pkg.price !== price) {
        resolvedAmount = getCreditsFromPrice(price);
      }
    }

    const data: Prisma.PaymentCreateInput = {
      uniqueId,
      user: { connect: { id: resolvedUserId } },
      type,
      amount: resolvedAmount,
      price,
      bankCode,
      content,
      status: EStatusProcess.PENDING,
    };

    const payment = await this.prisma.payment.create({
      data,
      include: { user: { include: { avatar: true } } },
    });

    await this.notificationHelper.notificationPayment({
      userId: payment.userId,
      paymentId: payment.id,
      type: ENotificationType.PAYMENT_CREATED,
    });

    return this.transformPayment(payment);
  }

  async update({
    args,
    currentUser,
    id,
  }: {
    args: IPaymentUpdate;
    currentUser: IUser;
    id: string;
  }): Promise<IPayment> {
    const payment = await this.prisma.payment.findFirst({
      where: { id },
    });

    if (!payment) {
      throw new BadRequestException(paymentError.not_found);
    }

    const { type, amount, price, bankCode } = args;

    const isAdmin = hasPermission(currentUser, [permissions.PAYMENT_UPDATE]);

    if (payment.status !== EStatusProcess.PENDING && !isAdmin) {
      throw new BadRequestException(paymentError.not_pending);
    }

    const where: Prisma.PaymentWhereUniqueInput = { id };

    const data: Prisma.PaymentUpdateInput = {};

    if (type) {
      data.type = type;
    }

    if (bankCode) {
      data.bankCode = bankCode;
    }

    if (isAdmin) {
      if (amount) data.amount = amount;
      if (price) data.price = price;
    }

    const updatedPayment = await this.prisma.payment.update({
      where,
      data,
      include: { user: { include: { avatar: true } } },
    });

    return this.transformPayment(updatedPayment);
  }

  async approve({
    currentUser,
    id,
  }: {
    currentUser: IUser;
    id: string;
  }): Promise<IPayment> {
    const payment = await this.prisma.payment.findFirst({
      where: { id },
      select: {
        id: true,
        status: true,
        bankCode: true,
        user: {
          select: { id: true, credits: true },
        },
        amount: true,
        price: true,
        type: true,
      },
    });

    if (!payment) {
      throw new BadRequestException(paymentError.not_found);
    }

    if (
      payment.status !== EStatusProcess.PENDING &&
      payment.status !== EStatusProcess.PROCESSING
    ) {
      throw new BadRequestException(paymentError.not_pending);
    }

    const isAdmin = hasPermission(currentUser, [permissions.PAYMENT_APPROVE]);

    if (!isAdmin) {
      throw new BadRequestException(permissionError.permission_denied);
    }

    const data: Prisma.PaymentUpdateInput = {
      status: EStatusProcess.COMPLETED,
      doneAt: new Date(),
    };

    // check payment is bank transfer
    if (payment.type === EPaymentType.BANK_TRANSFER) {
      // check bank code is valid
      if (!payment.bankCode) {
        throw new BadRequestException(paymentError.bank_code_required);
      }
    } else {
      data.bankCode = null;
    }

    const where: Prisma.PaymentWhereUniqueInput = { id };

    const updatedPayment = await this.prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        where: { id: payment.user.id },
        data: { credits: { increment: payment.amount } },
      });

      await prisma.transaction.create({
        data: {
          type: ETransactionType.PAYMENT,
          amount: payment.amount,
          newBalance: payment.user.credits + payment.amount,
          status: EStatusProcess.COMPLETED,
          user: { connect: { id: payment.user.id } },
          refId: payment.id,
        },
      });

      // update user level
      await prisma.user.update({
        where: { id: payment.user.id },
        data: { level: EUserLevel.PRO },
      });

      return await prisma.payment.update({
        where,
        data,
        include: { user: true },
      });
    });

    await this.notificationHelper.notificationPayment({
      userId: payment.user.id,
      paymentId: payment.id,
      type: ENotificationType.PAYMENT_APPROVED,
    });

    return this.transformPayment(updatedPayment);
  }

  async reject({
    currentUser,
    id,
    reason,
  }: {
    currentUser: IUser;
    id: string;
    reason?: string;
  }): Promise<IPayment> {
    const payment = await this.prisma.payment.findFirst({
      where: { id },
      include: { user: true },
    });

    if (!payment) {
      throw new BadRequestException(paymentError.not_found);
    }

    if (
      payment.status !== EStatusProcess.PENDING &&
      payment.status !== EStatusProcess.PROCESSING
    ) {
      throw new BadRequestException(paymentError.not_pending);
    }

    const isAdmin = hasPermission(currentUser, [permissions.PAYMENT_REJECT]);

    if (!isAdmin && payment.userId !== currentUser.id) {
      throw new BadRequestException(permissionError.permission_denied);
    }

    const where: Prisma.PaymentWhereUniqueInput = { id };

    const data: Prisma.PaymentUpdateInput = {
      status: EStatusProcess.CANCELED,
      doneAt: new Date(),
    };

    const updatePayment = await this.prisma.payment.update({
      where,
      data,
    });

    if (payment.userId != currentUser.id) {
      await this.notificationHelper.notificationPayment({
        userId: payment.user.id,
        paymentId: payment.id,
        type: ENotificationType.PAYMENT_REJECTED,
        reason,
      });
    }

    return updatePayment as IPayment;
  }

  async reopen({
    currentUser,
    id,
    reason,
  }: {
    currentUser: IUser;
    id: string;
    reason: string;
  }): Promise<IPayment> {
    const payment = await this.prisma.payment.findFirst({
      where: { id },
      select: {
        id: true,
        status: true,
        user: {
          select: { id: true, credits: true },
        },
        amount: true,
        type: true,
      },
    });

    if (!payment) {
      throw new BadRequestException(paymentError.not_found);
    }

    if (
      payment.status !== EStatusProcess.CANCELED &&
      payment.status !== EStatusProcess.COMPLETED
    ) {
      throw new BadRequestException(paymentError.not_pending);
    }

    const isAdmin = hasPermission(currentUser, [permissions.PAYMENT_REOPEN]);

    if (!isAdmin) {
      throw new BadRequestException(permissionError.permission_denied);
    }

    const where: Prisma.PaymentWhereUniqueInput = { id };

    const data: Prisma.PaymentUpdateInput = {
      status: EStatusProcess.PENDING,
    };

    const updatePayment = await this.prisma.$transaction(async (prisma) => {
      if (payment.status === EStatusProcess.COMPLETED) {
        await prisma.user.update({
          where: { id: payment.user.id },
          data: { credits: { decrement: payment.amount } },
        });

        await prisma.transaction.create({
          data: {
            type: ETransactionType.PAYMENT,
            amount: -payment.amount,
            newBalance: payment.user.credits - payment.amount,
            status: EStatusProcess.COMPLETED,
            user: { connect: { id: payment.user.id } },
            refId: id,
          },
        });
      }

      return await prisma.payment.update({
        where,
        data,
      });
    });

    await this.notificationHelper.notificationPayment({
      userId: payment.user.id,
      paymentId: payment.id,
      type: ENotificationType.PAYMENT_REOPENED,
      reason,
    });

    return updatePayment as IPayment;
  }

  async getSummary(
    { userId }: IPaymentFindMany,
    currentUser?: IUser,
  ): Promise<IPaymentSummary> {
    const isAdmin = hasPermission(currentUser, [permissions.PAYMENT_MANAGE]);

    const where: Prisma.PaymentWhereInput = {};

    if (!isAdmin) {
      where.userId = currentUser.id;
    }

    if (userId) {
      where.userId = userId;
    }

    const pending = await this.prisma.payment.count({
      where: { ...where, status: EStatusProcess.PENDING },
    });

    const processing = await this.prisma.payment.count({
      where: { ...where, status: EStatusProcess.PROCESSING },
    });

    const completed = await this.prisma.payment.count({
      where: { ...where, status: EStatusProcess.COMPLETED },
    });

    const canceled = await this.prisma.payment.count({
      where: { ...where, status: EStatusProcess.CANCELED },
    });

    return { pending, processing, completed, canceled };
  }

  transformPayment(
    payment: Prisma.PaymentGetPayload<{ include: { user: true } }>,
  ): IPayment {
    return {
      ...payment,
      user: {
        id: payment.user.id,
        email: payment.user.email,
        fullname: payment.user.fullname,
        username: payment.user.username,
        gender: payment.user.gender,
        phone: payment.user.phone,
        createdAt: payment.user.createdAt,
        updatedAt: payment.user.updatedAt,
      },
      type: payment.type as EPaymentType,
    };
  }

  // Auto cancel payment after 30 days
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async autoCancelPayment() {
    const date = new Date();
    date.setDate(date.getDate() - 30);

    await this.prisma.payment.updateMany({
      where: {
        status: EStatusProcess.PENDING,
        createdAt: { lt: date },
        doneAt: null,
      },
      data: { status: EStatusProcess.CANCELED, doneAt: new Date() },
    });
  }
}

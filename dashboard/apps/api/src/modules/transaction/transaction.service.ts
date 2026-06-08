import { BadRequestException, Injectable } from '@nestjs/common';
import { EStatusProcess, Prisma, Transaction } from '@prisma/client';
import {
  conversionRateCreditToCommission,
  EBalanceType,
  ETransactionType,
  hasPermission,
  IFindManyResponse,
  ITransaction,
  ITransactionConvertCommission,
  ITransactionCreate,
  ITransactionFindMany,
  ITransactionUpdate,
  IUser,
  permissions,
} from '@seven-auto/libs';
import { basicError } from 'src/messages/basics.message';
import { permissionError } from 'src/messages/premission.message';
import { transactionError } from 'src/messages/transaction.message';
import { PrismaService } from 'src/prisma/prisma.service';

import { UserQueryService } from '../user/service/userQuery.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userQueryService: UserQueryService,
  ) {}

  async findMany({
    args,
    currentUser,
  }: {
    args: ITransactionFindMany;
    currentUser: IUser;
  }): Promise<IFindManyResponse<ITransaction>> {
    const {
      take,
      skip,
      balanceType,
      orderBy,
      amount_gte,
      amount_lte,
      createdAt_gte,
      createdAt_lte,
      updatedAt_gte,
      updatedAt_lte,
      status,
      type,
      userId,
    } = args;

    const where: Prisma.TransactionWhereInput = {};

    const isAdmin = hasPermission(currentUser, [
      permissions.TRANSACTION_MANAGE,
    ]);

    if (userId) {
      where.userId = userId;
    }

    if (!isAdmin) {
      where.userId = currentUser.id;
    }

    if (status) {
      where.status = status as EStatusProcess;
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

    if (type) {
      where.type = type;
    }

    if (balanceType) {
      where.balanceType = balanceType;
    }

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        take,
        skip,
        orderBy,
        include: { user: { include: { avatar: true } } },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      items: transactions.map((transaction) =>
        this.parseTransaction(transaction),
      ),
      total,
    };
  }

  async findOne({
    currentUser,
    id,
  }: {
    currentUser: IUser;
    id: string;
  }): Promise<ITransaction> {
    const isAdmin = hasPermission(currentUser, [
      permissions.TRANSACTION_MANAGE,
    ]);

    const where: Prisma.TransactionWhereUniqueInput = { id };

    if (!isAdmin) {
      where.userId = currentUser.id;
    }

    const prismaTransaction = await this.prisma.transaction.findFirst({
      where,
      include: { user: { include: { avatar: true } } },
    });

    if (!prismaTransaction) {
      throw new BadRequestException(transactionError.not_found);
    }

    return this.parseTransaction(prismaTransaction);
  }

  async create({
    args,
    currentUser,
  }: {
    args: ITransactionCreate;
    currentUser: IUser;
  }): Promise<ITransaction> {
    const { userId, amount } = args;

    const isAdmin = hasPermission(currentUser, [
      permissions.TRANSACTION_CREATE,
    ]);

    if (!isAdmin) {
      throw new BadRequestException(permissionError.permission_denied);
    }

    const data: Prisma.TransactionCreateInput = {
      user: { connect: { id: userId } },
      newBalance: 0,
      balanceType: EBalanceType.CREDIT,
      type: ETransactionType.SYSTEM,
      amount,
      status: EStatusProcess.PENDING,
    };

    if (!isAdmin) {
      data.user = { connect: { id: currentUser.id } };
    }

    const prismaTransaction = await this.prisma.transaction.create({
      data,
      include: { user: { include: { avatar: true } } },
    });

    if (!prismaTransaction) {
      throw new BadRequestException(transactionError.not_found);
    }

    return this.parseTransaction(prismaTransaction);
  }

  async update({
    args,
    currentUser,
    id,
  }: {
    args: ITransactionUpdate;
    currentUser: IUser;
    id: string;
  }): Promise<ITransaction> {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id },
    });

    if (!transaction) {
      throw new BadRequestException(transactionError.not_found);
    }

    const { type, amount } = args;

    const isAdmin = hasPermission(currentUser, [
      permissions.TRANSACTION_UPDATE,
    ]);

    if (!isAdmin) {
      throw new BadRequestException(permissionError.permission_denied);
    }

    const where: Prisma.TransactionWhereUniqueInput = { id };

    const data: Prisma.TransactionUpdateInput = {};

    if (type) {
      data.type = type;
    }

    if (amount) {
      data.amount = amount;
    }

    const prismaTransaction = await this.prisma.transaction.update({
      where,
      data,
      include: { user: { include: { avatar: true } } },
    });

    if (!prismaTransaction) {
      throw new BadRequestException(transactionError.not_found);
    }

    return this.parseTransaction(prismaTransaction);
  }

  async approve({
    currentUser,
    id,
  }: {
    currentUser: IUser;
    id: string;
  }): Promise<ITransaction> {
    const transaction = await this.prisma.transaction.findFirst({
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

    if (!transaction) {
      throw new BadRequestException(transactionError.not_found);
    }

    if (
      transaction.status !== EStatusProcess.PENDING &&
      transaction.status !== EStatusProcess.PROCESSING
    ) {
      throw new BadRequestException(transactionError.not_pending);
    }

    const isAdmin = hasPermission(currentUser, [
      permissions.TRANSACTION_UPDATE,
    ]);

    if (!isAdmin) {
      throw new BadRequestException(permissionError.permission_denied);
    }

    const where: Prisma.TransactionWhereUniqueInput = { id };

    const data: Prisma.TransactionUpdateInput = {
      status: EStatusProcess.COMPLETED,
    };

    const updateTransaction = await this.prisma.$transaction(async (prisma) => {
      const updatedUser = await prisma.user.update({
        where: { id: transaction.user.id },
        data: { credits: { increment: transaction.amount } },
      });

      data.newBalance = updatedUser.credits;

      return await prisma.transaction.update({
        where,
        data,
      });
    });

    if (!updateTransaction) {
      throw new BadRequestException(transactionError.not_found);
    }

    return this.parseTransaction(updateTransaction);
  }

  async reject({
    currentUser,
    id,
  }: {
    currentUser: IUser;
    id: string;
  }): Promise<ITransaction> {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id },
    });

    if (!transaction) {
      throw new BadRequestException(transactionError.not_found);
    }

    if (
      transaction.status !== EStatusProcess.PENDING &&
      transaction.status !== EStatusProcess.PROCESSING
    ) {
      throw new BadRequestException(transactionError.not_pending);
    }

    const isAdmin = hasPermission(currentUser, [
      permissions.TRANSACTION_UPDATE,
    ]);

    if (!isAdmin) {
      throw new BadRequestException(permissionError.permission_denied);
    }

    const where: Prisma.TransactionWhereUniqueInput = { id };

    const data: Prisma.TransactionUpdateInput = {
      status: EStatusProcess.CANCELED,
    };

    const prismaTransaction = await this.prisma.transaction.update({
      where,
      data,
    });

    if (!prismaTransaction) {
      throw new BadRequestException(transactionError.not_found);
    }

    return this.parseTransaction(prismaTransaction);
  }

  async convertCommission({
    args,
    currentUser,
  }: {
    args: ITransactionConvertCommission;
    currentUser: IUser;
  }): Promise<boolean> {
    if (!currentUser) {
      throw new BadRequestException(transactionError.not_found);
    }

    const { amount } = args;

    if (!amount) {
      throw new BadRequestException(transactionError.invalid_amount);
    }

    // check user has enough credits
    if (currentUser.commissions < amount || amount <= 0) {
      throw new BadRequestException(basicError.not_enough_commission);
    }

    const receiver = Math.round(amount / conversionRateCreditToCommission);
    if (!receiver || receiver <= 0) {
      throw new BadRequestException(transactionError.invalid_amount);
    }

    // create transaction
    const transaction = await this.prisma.$transaction(async (prisma) => {
      const updatedUser = await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          commissions: { decrement: amount },
          credits: { increment: receiver },
        },
      });

      const data: Prisma.TransactionCreateInput = {
        user: { connect: { id: currentUser.id } },
        newBalance: updatedUser.commissions,
        balanceType: EBalanceType.COMMISSION,
        type: ETransactionType.CONVERT,
        amount: -amount,
        status: EStatusProcess.COMPLETED,
      };

      await prisma.transaction.create({ data });

      return await prisma.transaction.create({
        data: {
          user: { connect: { id: currentUser.id } },
          newBalance: updatedUser.credits,
          balanceType: EBalanceType.CREDIT,
          type: ETransactionType.CONVERT,
          amount: receiver,
          status: EStatusProcess.COMPLETED,
        },
        include: { user: { include: { avatar: true } } },
      });
    });

    return !!transaction;
  }

  parseTransaction(transaction: Partial<Transaction>): ITransaction {
    return {
      id: transaction.id || '',
      ...transaction,
      createdAt: transaction.createdAt || new Date(),
      updatedAt: transaction.updatedAt || new Date(),
      type: transaction.type as ETransactionType,
    };
  }
}

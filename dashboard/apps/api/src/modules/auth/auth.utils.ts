import { BadRequestException } from '@nestjs/common';
import { EUserStatus } from '@prisma/client';
import { IUser } from '@seven-auto/libs';
import { authError } from 'src/messages/auth.message';

export const userCheckIsEnable = (user?: IUser): IUser => {
  if (!user) throw new BadRequestException(`User not found`);
  switch (user.status) {
    // case EUserStatus.PENDING:
    //   throw new BadRequestException(authError.user_does_not_active);
    case EUserStatus.HOLD:
      throw new BadRequestException(authError.user_hold);
    case EUserStatus.BAN:
      throw new BadRequestException(authError.user_ban);
    default:
      break;
  }
  if (user.deleted) throw new BadRequestException(authError.user_deleted);
  delete user.status;
  delete user.deleted;
  return user;
};

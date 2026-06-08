import { Injectable } from '@nestjs/common';
import { EStatus } from '@prisma/client';
import { ESeedData, IUser } from '@seven-auto/libs';
import { hash } from 'bcryptjs';
import { RoleService } from 'src/modules/role/roleService';
import { UserActionService } from 'src/modules/user/service/userAction.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { UserQueryService } from '../user/service/userQuery.service';

@Injectable()
export class SeedDataService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userActionSev: UserActionService,
    private readonly roleService: RoleService,
    private readonly userQueryService: UserQueryService,
  ) {}

  async run(type: ESeedData): Promise<{
    length: number;
    status: boolean;
  }> {
    switch (type) {
      case ESeedData.USER:
        return this.syncUsers();
      case ESeedData.PERMISSION:
        return this.roleService.syncPermissions();
      default:
        return { length: 0, status: false };
    }
  }

  async syncUsers(): Promise<{
    length: number;
    status: boolean;
  }> {
    const prismaUser = await this.prisma.user.findFirst({
      where: { id: '1' },
    });

    if (prismaUser) {
      return {
        length: 1,
        status: true,
      };
    }

    let user: IUser = this.userQueryService.parseUser(prismaUser);

    const password = await hash('Ab!123456', 10);

    if (!user) {
      user = await this.userActionSev.create({
        email: 'admin@gmail.com',
        username: 'superadmin',
        password,
        status: EStatus.ACTIVE,
        isVerified: true,
        fullname: 'Admin',
      });
    }

    const roleAdmin = await this.prisma.role.findFirst({
      where: { name: 'Super Admin' },
    });

    if (roleAdmin) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          id: '1',
          role: { connect: { id: roleAdmin.id } },
        },
      });
    }

    return {
      length: 1,
      status: true,
    };
  }
}

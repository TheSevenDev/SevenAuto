import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IFindManyResponse, IRole, permissions } from '@seven-auto/libs';
import { FindManyDto } from 'src/dto/utils.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { RoleCreateDto, RoleUpdateDto } from './role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string): Promise<IRole> {
    return this.prisma.role.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        permissions: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findMany({
    filter,
    take,
    skip,
  }: FindManyDto): Promise<IFindManyResponse<IRole>> {
    const where: Prisma.RoleWhereInput = {};

    if (filter) where.name = { contains: filter };

    const roles: IRole[] = await this.prisma.role.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        name: true,
        permissions: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const total = await this.prisma.role.count({
      where,
    });
    return { items: roles, total };
  }

  async create({ name }: RoleCreateDto): Promise<IRole> {
    if (!name) throw new BadRequestException(`Name is require`);
    return this.prisma.role.create({
      data: { name },
    });
  }

  async update(id: string, data: RoleUpdateDto): Promise<IRole> {
    return this.prisma.role.update({
      where: { id },
      data: { name: data.name },
    });
  }

  async delete(id: string): Promise<IRole> {
    // check have user
    const role = await this.prisma.role.findUnique({
      where: { id },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        users: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
          },
          take: 1,
        },
      },
    });
    if (!role) throw new BadRequestException(`Role not found`);
    if (role.users && role.users.length > 0)
      throw new BadRequestException(`Role is being used`);

    await this.prisma.role.delete({ where: { id } });
    return role;
  }

  async findManyPermission(): Promise<string[]> {
    return Object.values(permissions).flat();
  }

  async syncPermissions(): Promise<{
    length: number;
    status: boolean;
  }> {
    // Check have role
    let role = await this.prisma.role.findFirst({
      where: { name: 'Super Admin' },
    });

    if (!role) {
      // Create role
      role = await this.prisma.role.create({
        data: { name: 'Super Admin' },
      });
    }

    const permissionsData: string[] = [];

    Object.values(permissions)
      .flat()
      .forEach((item) => {
        permissionsData.push(item);
      });

    // assign all to super admin
    await this.prisma.role.update({
      where: { id: role.id },
      data: {
        permissions: { set: permissionsData },
      },
    });

    // assign admin user to super admin
    await this.prisma.user.update({
      where: { id: '1' },
      data: { role: { connect: { id: role.id } } },
    });

    return { length: 1, status: true };
  }

  async addPermission(id, key): Promise<boolean> {
    // check have user
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new BadRequestException(`Role not found`);
    await this.prisma.role.update({
      where: { id },
      data: { permissions: { push: key } },
    });
    return true;
  }

  async removePermission(id, key): Promise<boolean> {
    // check have user
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new BadRequestException(`Role not found`);
    if (!role.permissions.includes(key))
      throw new BadRequestException(`Permission not found`);
    await this.prisma.role.update({
      where: { id },
      data: {
        permissions: { set: role.permissions.filter((item) => item !== key) },
      },
    });
    return true;
  }
}

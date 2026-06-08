import {
  EUserGender,
  EUserLevel,
  EUserStatus,
  PrismaClient,
  User,
} from '@prisma/client';
import { hash } from 'bcryptjs';

type DummyUser = Omit<
  User,
  | 'createdAt'
  | 'updatedAt'
  | 'avatarId'
  | 'coverId'
  | 'phone'
  | 'roleId'
  | 'country'
  | 'city'
  | 'region'
  | 'zipCode'
  | 'referrerId'
  | 'lastActivity'
  | 'language'
  | 'credits'
  | 'commissions'
  | 'score'
  | 'activityStatus'
  | 'setting'
>;

const dummyUsers: DummyUser[] = [
  {
    id: '1',
    email: 'admin@example.com',
    fullname: 'Admin',
    status: EUserStatus.ACTIVE,
    isVerified: true,
    password: 'Ab!123456',
    username: 'admin',
    address: '',
    about: '',
    content: '',
    deleted: false,
    socials: '',
    gender: EUserGender.MALE,
    level: EUserLevel.PREMIUM,
  },
  {
    id: 'f7e74913-5202-4262-815c-74fa65547e95',
    email: 'user@example.com',
    fullname: 'User',
    status: EUserStatus.ACTIVE,
    isVerified: false,
    password: 'Ab!123456',
    username: 'user',
    address: '',
    about: '',
    content: '',
    deleted: false,
    socials: '',
    gender: EUserGender.MALE,
    level: EUserLevel.BASIC,
  },
  {
    id: '98fac909-7df5-478a-9c0f-e65afe165b93',
    email: 'noverify@example.com',
    fullname: 'No Verify',
    status: EUserStatus.ACTIVE,
    isVerified: false,
    password: 'Ab!123456',
    username: 'noverify',
    address: '',
    about: '',
    content: '',
    deleted: false,
    socials: '',
    gender: EUserGender.MALE,
    level: EUserLevel.BASIC,
  },
];

export const seedUsers = async (prisma: PrismaClient) => {
  let roleId = '';
  const roles = await prisma.role.findMany({
    where: { name: { not: 'Super Admin' } },
  });
  if (!roles.length) {
    const role = await prisma.role.create({
      data: { name: 'User' },
    });
    roleId = role.id;
  } else {
    roleId = roles[0].id;
  }
  const users = await Promise.all(
    dummyUsers.map(async (user) => {
      const password = await hash(user.password, 10);
      return prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          ...user,
          password,
          role: { connect: { id: roleId } },
        },
      });
    }),
  );

  console.log('Users created: ', users.map((user) => user.email).join(', '));
};

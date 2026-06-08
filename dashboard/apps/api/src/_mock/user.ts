import {
  EActivityStatus,
  EUserLevel,
  EUserStatus,
  User,
  UserMeta,
} from '@prisma/client';

export const mockUserPrisma: User = {
  id: '03c7ae41-54df-4e45-b6ff-4ca4f53487aa',
  email: 'test@example.com',
  status: EUserStatus.ACTIVE,
  level: EUserLevel.BASIC,
  lastActivity: new Date(),
  deleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  username: 'testuser',
  fullname: 'Test User',
  password: 'hashedPassword',
  phone: '1234567890',
  country: 'USA',
  address: '123 Main St',
  region: 'CA',
  city: 'New York',
  zipCode: '10001',
  socials: '[{"key":"value"}]',
  about: 'About Test User',
  content: 'Content Test User',
  isVerified: false,
  gender: 'MALE',
  referrerId: '',
  avatarId: '',
  coverId: '',
  roleId: '',
  language: 'en',
  credits: 0,
  commissions: 0,
  score: 0,
  activityStatus: EActivityStatus.ONLINE,
  setting: null,
};

export const mockUserFactory = (
  overrides?: Partial<User & { metas?: UserMeta[] }>,
): User => {
  return {
    ...mockUserPrisma,
    ...overrides,
  };
};

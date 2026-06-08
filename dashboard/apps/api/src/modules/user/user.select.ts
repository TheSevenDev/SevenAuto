import { Prisma } from '@prisma/client';
import { mediaSelect } from 'src/modules/media/media.select';

const UserBasicSelect: Prisma.UserSelect = {
  id: true,
  fullname: true,
  username: true,
  socials: true,
  address: true,
  country: true,
  city: true,
  region: true,
  zipCode: true,
  about: true,
  level: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
  referrerId: true,
  activityStatus: true,
  lastActivity: true,
  score: true,
  credits: true,
  gender: true,
  referrer: {
    select: {
      id: true,
      fullname: true,
      username: true,
    },
  },
  avatar: {
    select: {
      ...mediaSelect.basic,
      createdBy: false,
    },
  },
  cover: {
    select: {
      ...mediaSelect.basic,
      createdBy: false,
    },
  },
  setting: true,
};

const UserAdminSelect: Prisma.UserSelect = {
  ...UserBasicSelect,
  email: true,
  phone: true,
  status: true,
  deleted: true,
  referrerId: true,
  referrer: {
    select: {
      ...UserBasicSelect,
      email: true,
    },
  },
  role: {
    select: {
      id: true,
      name: true,
    },
  },
};

const UserDetailSelect: Prisma.UserSelect = {
  ...UserBasicSelect,
  email: true,
  phone: true,
  status: true,
  deleted: true,
  referrerId: true,
  referrer: {
    select: UserBasicSelect,
  },
  role: {
    select: {
      id: true,
      name: true,
    },
  },
};

const UserFullSelect: Prisma.UserSelect = {
  ...UserDetailSelect,
};

export const userSelect: {
  basic: Prisma.UserSelect;
  detail: Prisma.UserSelect;
  full: Prisma.UserSelect;
  admin: Prisma.UserSelect;
} = {
  basic: UserBasicSelect,
  detail: UserDetailSelect,
  full: UserFullSelect,
  admin: UserAdminSelect,
};

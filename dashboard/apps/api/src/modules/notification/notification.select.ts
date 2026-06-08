import { Prisma } from '@prisma/client';

const NotificationBasicSelect: Prisma.NotificationSelect = {
  id: true,
  title: true,
  content: true,
  extra: true,
  createdAt: true,
  updatedAt: true,
  isGlobal: true,
  type: true,
};

const NotificationDetailSelect: Prisma.NotificationSelect = {
  ...NotificationBasicSelect,
};

const NotificationFullSelect: Prisma.NotificationSelect = {
  ...NotificationDetailSelect,
};

export const notificationSelect: {
  basic: Prisma.NotificationSelect;
  detail: Prisma.NotificationSelect;
  full: Prisma.NotificationSelect;
} = {
  basic: NotificationBasicSelect,
  detail: NotificationDetailSelect,
  full: NotificationFullSelect,
};

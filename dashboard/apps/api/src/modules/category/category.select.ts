import { Prisma } from '@prisma/client';

export const CategoryBasicSelect: Prisma.CategorySelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  title: true,
  sort: true,
  description: true,
  slug: true,
  mediaIcon: true,
  mediaImage: true,
};

export const CategoryDetailSelect: Prisma.CategorySelect = {
  ...CategoryBasicSelect,
  status: true,
  deleted: true,
};

export const CategoryFullSelect: Prisma.CategorySelect = {
  ...CategoryDetailSelect,
  posts: { select: { id: true } },
};

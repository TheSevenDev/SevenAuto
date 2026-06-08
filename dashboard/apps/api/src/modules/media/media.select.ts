import { Prisma } from '@prisma/client';

const MediaBasicSelect: Prisma.MediaSelect = {
  id: true,
  title: true,
  alt: true,
  ext: true,
  type: true,
  source: true,
  width: true,
  height: true,
  size: true,
  hash: true,
  url: true,
  urlLarge: true,
  urlMedium: true,
  urlRaw: true,
  urlSmall: true,
  urlTiny: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
};

const MediaDetailSelect: Prisma.MediaSelect = {
  ...MediaBasicSelect,
};

const MediaFullSelect: Prisma.MediaSelect = {
  ...MediaDetailSelect,
};

export const mediaSelect: {
  basic: Prisma.MediaSelect;
  detail: Prisma.MediaSelect;
  full: Prisma.MediaSelect;
} = {
  basic: MediaBasicSelect,
  detail: MediaDetailSelect,
  full: MediaFullSelect,
};

import { PrismaClient } from '@prisma/client';

export const prismaMock = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  userMeta: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  emailTemplate: {
    findUnique: jest.fn().mockResolvedValue({
      id: 1,
      key: 'test',
      title: 'Test Title',
      content: 'Test Content',
      langs: [
        {
          id: 1,
          emailTemplateId: 1,
          lang: 'vi',
          title: 'Test Title',
          content: 'Test Content',
        },
      ],
    }),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
} as unknown as PrismaClient;

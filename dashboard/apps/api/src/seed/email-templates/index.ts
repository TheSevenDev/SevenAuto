import { ELanguage, PrismaClient } from '@prisma/client';
import { EEmailTemplateKey, IEmailTemplate } from '@seven-auto/libs';

import { authEmailTemplates } from './auth';

type TemplateData = Omit<
  IEmailTemplate,
  'id' | 'createdAt' | 'updatedAt' | 'langs'
> & {
  langs?: { lang: ELanguage; title: string; content: string }[];
};

const emailTemplates: TemplateData[] = [
  {
    key: EEmailTemplateKey.WELCOME,
    variables: ['app_name', 'app_link'],
    name: 'Welcome',
    title: 'Welcome to {{app_name}}',
    content: [
      '<p>Welcome to {{app_name}}. <a href="{{app_link}}">View app</a></p>',
      '<p>Thank you for joining our app.</p>',
    ].join(''),
    langs: [
      {
        lang: ELanguage.en,
        title: 'Welcome to {{app_name}}',
        content: [
          '<p>Welcome to {{app_name}}. <a href="{{app_link}}">View app</a></p>',
          '<p>Thank you for joining our app.</p>',
        ].join(''),
      },
      {
        lang: ELanguage.vi,
        title: 'Chào mừng bạn đến với {{app_name}}',
        content: [
          '<p>Chào mừng bạn đến với {{app_name}}. <a href="{{app_link}}">Xem ứng dụng</a></p>',
          '<p>Cảm ơn bạn đã đăng ký ứng dụng.</p>',
        ].join(''),
      },
    ],
  },
  ...authEmailTemplates,
];

export const seedEmailTemplate = async (prisma: PrismaClient) => {
  await Promise.all(
    emailTemplates.map((template) =>
      prisma.emailTemplate.upsert({
        where: { key: template.key },
        update: {
          variables: JSON.stringify(template.variables),
        },
        create: {
          key: template.key,
          name: template.name,
          title: template.title,
          content: template.content,
          variables: JSON.stringify(template.variables),
          ...(template.langs &&
            template.langs.length > 0 && {
              langs: {
                createMany: {
                  data: template.langs.map((lang) => ({
                    lang: lang.lang,
                    title: lang.title,
                    content: lang.content,
                  })),
                },
              },
            }),
        },
      }),
    ),
  );
  console.log('Email Template Seeded', emailTemplates.length);
};

import { ELanguage } from '@prisma/client';
import { EEmailTemplateKey, IEmailTemplate } from '@seven-auto/libs';

type TemplateData = Omit<
  IEmailTemplate,
  'id' | 'createdAt' | 'updatedAt' | 'langs'
> & {
  langs?: { lang: ELanguage; title: string; content: string }[];
};

export const authEmailTemplates: TemplateData[] = [
  {
    key: EEmailTemplateKey.CONFIRM_REGISTER,
    variables: ['fullname', 'confirm_link'],
    name: 'Confirm Register',
    title: 'Confirm Register',
    content: [
      '<p>Hi {{fullname}},</p>',
      '<p>Please click the link below to confirm your registration:</p>',
      '<p><a href="{{confirm_link}}">Confirm</a></p>',
    ].join(''),
    langs: [
      {
        lang: ELanguage.en,
        title: 'Confirm Register',
        content: [
          '<p>Hi {{fullname}},</p>',
          '<p>Please click the link below to confirm your registration:</p>',
          '<p><a href="{{confirm_link}}">Confirm</a></p>',
        ].join(''),
      },
      {
        lang: ELanguage.vi,
        title: 'Xác nhận đăng ký',
        content: [
          '<p>Chào bạn {{fullname}},</p>',
          '<p>Vui lòng click vào link bên dưới để xác nhận đăng ký:</p>',
          '<p><a href="{{confirm_link}}">Xác nhận</a></p>',
        ].join(''),
      },
    ],
  },
  {
    key: EEmailTemplateKey.FORGOT_PASSWORD,
    variables: ['fullname', 'reset_link'],
    name: 'Forgot Password',
    title: 'Forgot Password',
    content: [
      '<p>Hi {{fullname}},</p>',
      '<p>Please click the link below to reset your password:</p>',
      '<p><a href="{{reset_link}}">Reset</a></p>',
    ].join(''),
    langs: [
      {
        lang: ELanguage.en,
        title: 'Forgot Password',
        content: [
          '<p>Hi {{fullname}},</p>',
          '<p>Please click the link below to reset your password:</p>',
          '<p><a href="{{reset_link}}">Reset</a></p>',
        ].join(''),
      },
      {
        lang: ELanguage.vi,
        title: 'Quên mật khẩu',
        content: [
          '<p>Chào bạn {{fullname}},</p>',
          '<p>Vui lòng click vào link bên dưới để đặt lại mật khẩu:</p>',
          '<p><a href="{{reset_link}}">Đặt lại</a></p>',
        ].join(''),
      },
    ],
  },
  {
    key: EEmailTemplateKey.SEND_REGISTER_CODE,
    variables: ['fullname', 'code'],
    name: 'Send Register Code',
    title: 'Register Code',
    content: [
      '<p>Hi {{fullname}},</p>',
      '<p>Your register code is: {{code}}</p>',
      '<p>Thank you</p>',
    ].join(''),
    langs: [
      {
        lang: ELanguage.en,
        title: 'Register Code',
        content: [
          '<p>Hi {{fullname}},</p>',
          '<p>Your register code is: {{code}}</p>',
          '<p>Thank you</p>',
        ].join(''),
      },
      {
        lang: ELanguage.vi,
        title: 'Mã đăng ký',
        content: [
          '<p>Chào bạn {{fullname}},</p>',
          '<p>Mã đăng ký của bạn là: {{code}}</p>',
          '<p>Cảm ơn bạn</p>',
        ].join(''),
      },
    ],
  },
];

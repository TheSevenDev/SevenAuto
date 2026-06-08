import { VN_PHONE_REGEX } from '@seven-auto/libs';
import * as Yup from 'yup';

// **
// TODO: Refactor this file use translation keys
// **

export type GuestCheckoutValues = {
  name: string;
  email: string;
  phone: string;
};

export const guestCheckoutSchema: Yup.ObjectSchema<GuestCheckoutValues> =
  Yup.object({
    name: Yup.string()
      .trim()
      .max(80, 'Họ tên tối đa 80 ký tự')
      .required('Vui lòng nhập họ tên'),
    email: Yup.string()
      .trim()
      .email('Email không hợp lệ')
      .required('Vui lòng nhập email'),
    phone: Yup.string()
      .trim()
      .matches(VN_PHONE_REGEX, 'Số điện thoại không hợp lệ')
      .required('Vui lòng nhập số điện thoại'),
  });

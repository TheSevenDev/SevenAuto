import { EPaymentType } from '../types';

export const paymentCodePrefix = 'SEVA';
export const PAYMENT_CREDIT_RATE = 1000;

export const paymentPackages = [
  {
    key: 'package1',
    credits: 100,
    price: 99000,
    bonus: 0,
  },
  {
    key: 'package2',
    credits: 510,
    price: 499000,
    bonus: 2,
  },
  {
    key: 'package3',
    credits: 1040,
    price: 999000,
    bonus: 4,
  },
  {
    key: 'package4',
    credits: 2120,
    price: 1999000,
    bonus: 6,
  },
  {
    key: 'package5',
    credits: 5400,
    price: 4999000,
    bonus: 8,
  },
  {
    key: 'package6',
    credits: 11000,
    price: 9999000,
    bonus: 10,
  },
];

export const paymentMethodList = [
  // {
  //   key: EPaymentType.MOMO,
  //   name: 'momo',
  //   icon: 'arcticons:momo',
  //   color: '#a00061',
  //   enable: true,
  // },
  {
    key: EPaymentType.BANK_TRANSFER,
    name: 'bank_transfer',
    icon: 'mdi:bank-transfer',
    color: '#0077c8',
    enable: true,
  },
];

export const paymentBankList = [
  {
    code: 'bidv',
    name: 'BIDV',
    icon: 'bidv',
    accountNumber: 'xxxxxxxxx',
    accountName: 'CÔNG TY TNHH SEVEN AUTO',
    accountBranch: 'Chi nhánh Thành phố Hồ Chí Minh',
    enable: true,
  },
  // {
  //   code: 'acb',
  //   name: 'ACB',
  //   icon: 'acb',
  //   accountNumber: '0123456789',
  //   accountName: 'Nguyen Van B',
  //   accountBranch: 'Chi nhánh Tân Bình',
  //   enable: true,
  // },
  // {
  //   code: 'bidv',
  //   name: 'BIDV',
  //   icon: 'bidv',
  //   accountNumber: '0123456789',
  //   accountName: 'Nguyen Van C',
  //   accountBranch: 'Chi nhánh Tân Bình',
  //   enable: true,
  // },
];

export const paymentMomoInfo = {
  phoneNumber: '0123456789',
  name: 'Nguyen Van D',
};

export const getCreditsFromPrice = (price: number) => {
  const packageAmount = paymentPackages.find((p) => p.price === price);
  if (packageAmount) {
    return packageAmount.credits;
  }
  return Math.floor(price / PAYMENT_CREDIT_RATE);
};

export const getPriceFromCredits = (credits: number) => {
  const packagePrice = paymentPackages.find((p) => p.credits === credits);
  if (packagePrice) {
    return packagePrice.price;
  }
  return credits * PAYMENT_CREDIT_RATE;
};

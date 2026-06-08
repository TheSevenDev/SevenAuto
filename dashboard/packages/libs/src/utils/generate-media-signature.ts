import CryptoJS from 'crypto-js';

export const generateMediaSignature = (key: string, secret: string) =>
  CryptoJS.HmacSHA256(key, secret).toString();

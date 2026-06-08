import CryptoJS from 'crypto-js';
import { MEDIA_SECRET } from 'modules/config-global';

export const generateMediaSignature = (key: string) =>
  CryptoJS.HmacSHA256(key, MEDIA_SECRET?.toString() || '');

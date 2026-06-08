import { ELanguage } from '@seven-auto/libs';
import { enLang as en, viLang as vi } from '@seven-auto/libs';

export const translate = (key: string, lang: ELanguage) => {
  return getNestedObjectValue(lang === ELanguage.EN ? en : vi, key);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNestedObjectValue = (obj: Record<string, any>, path: string) =>
  path.split('.').reduce((acc, part) => acc && acc[part], obj);

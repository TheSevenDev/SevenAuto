'use client';

import { ELanguage } from '@seven-auto/libs';
import { useSettingsContext } from 'modules/components/settings';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback } from 'react';

import { useAuthContext } from '../auth/hooks';
import apiServices from '../services/apiService';
import { allLangs, defaultLang } from './config-lang';
import { setAppLocale } from './locale';

// ----------------------------------------------------------------------

export type TTranslate = ReturnType<typeof useTranslations>;

export function useLocales() {
  const locale = useLocale();

  const currentLang =
    allLangs.find((lang) => lang.value === locale) || defaultLang;

  return {
    allLangs,
    currentLang,
  };
}

// ----------------------------------------------------------------------

export function useTranslate() {
  const t: TTranslate = useTranslations();
  const settings = useSettingsContext();
  const { currentUser } = useAuthContext();

  const onChangeLang = useCallback(
    (newLang: string) => {
      settings.onChangeDirectionByLang(newLang);
      setAppLocale(newLang as ELanguage);
      if (currentUser && currentUser.id) {
        apiServices.user.updateUser({
          id: currentUser.id,
          language: newLang as ELanguage,
        });
      }
    },
    [settings, currentUser],
  );
  return { t, onChangeLang };
}

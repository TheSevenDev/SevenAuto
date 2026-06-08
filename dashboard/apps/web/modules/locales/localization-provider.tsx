'use client';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useEffect } from 'react';

import apiServices from '../services/apiService';
import { useLocales } from './use-locales';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function LocalizationProvider({ children }: Props) {
  const { currentLang } = useLocales();

  useEffect(() => {
    apiServices.mainAxiosInstance.defaults.headers.common['Accept-Language'] =
      currentLang?.value || 'vi';
    // apiServices.affiliateAxiosInstance.defaults.headers.common[
    //   'Accept-Language'
    // ] = currentLang?.value || 'vi';
    window.localStorage.setItem('locale', currentLang?.value || 'vi');
  }, [currentLang]);

  return (
    <MuiLocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={currentLang?.adapterLocale}
    >
      {children}
    </MuiLocalizationProvider>
  );
}

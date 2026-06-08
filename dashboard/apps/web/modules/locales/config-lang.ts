'use client';

// core
import { enUS as enUSCore, viVN as viVNCore } from '@mui/material/locale';
// data-grid
import {
  enUS as enUSDataGrid,
  viVN as viVNDataGrid,
} from '@mui/x-data-grid/locales';
// date-pickers
import {
  enUS as enUSDate,
  viVN as viVNDate,
} from '@mui/x-date-pickers/locales';
import { ELanguage } from '@seven-auto/libs';
import { enUS as enUSAdapter, vi as viVNAdapter } from 'date-fns/locale';
import merge from 'lodash/merge';

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

export const languageIcons = {
  [ELanguage.VI]: 'flagpack:vn',
  [ELanguage.EN]: 'flagpack:gb-nir',
};

export const allLangs = [
  {
    label: 'Vietnamese',
    value: ELanguage.VI,
    systemValue: merge(viVNDate, viVNDataGrid, viVNCore),
    adapterLocale: viVNAdapter,
    icon: languageIcons[ELanguage.VI],
  },
  {
    label: 'English',
    value: ELanguage.EN,
    systemValue: merge(enUSDate, enUSDataGrid, enUSCore),
    adapterLocale: enUSAdapter,
    icon: languageIcons[ELanguage.EN],
  },
];

export const defaultLang = allLangs[0]; // English
export const locales = allLangs.map((lang) => lang.value);

// GET MORE COUNTRY FLAGS
// https://icon-sets.iconify.design/flagpack/
// https://www.dropbox.com/sh/nec1vwswr9lqbh9/AAB9ufC8iccxvtWi3rzZvndLa?dl=0

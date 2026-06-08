import { alpha } from '@mui/material/styles';
import {
  colorsCommon,
  colorsError,
  colorsGrey,
  colorsInfo,
  colorsPrimary,
  colorsSecondary,
  colorsSuccess,
  colorsWarning,
} from '@seven-auto/libs';

// ----------------------------------------------------------------------

interface CustomShadows {
  z1: string;
  z4: string;
  z8: string;
  z12: string;
  z16: string;
  z20: string;
  z24: string;
  //
  primary: string;
  secondary: string;
  info: string;
  success: string;
  warning: string;
  error: string;
  //
  card: string;
  dialog: string;
  dropdown: string;
}

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: CustomShadows;
  }
  interface ThemeOptions {
    customShadows?: CustomShadows;
  }
}

// ----------------------------------------------------------------------

export function customShadows(mode: 'light' | 'dark') {
  const color = mode === 'light' ? colorsGrey[500] : colorsCommon.black;

  const transparent = alpha(color, 0.16);

  return {
    z1: `0 1px 2px 0 ${transparent}`,
    z4: `0 4px 8px 0 ${transparent}`,
    z8: `0 8px 16px 0 ${transparent}`,
    z12: `0 12px 24px -4px ${transparent}`,
    z16: `0 16px 32px -4px ${transparent}`,
    z20: `0 20px 40px -4px ${transparent}`,
    z24: `0 24px 48px 0 ${transparent}`,
    //
    card: `0 0 2px 0 ${alpha(color, 0.2)}, 0 12px 24px -4px ${alpha(
      color,
      0.12,
    )}`,
    dropdown: `0 0 2px 0 ${alpha(color, 0.24)}, -20px 20px 40px -4px ${alpha(
      color,
      0.24,
    )}`,
    dialog: `-40px 40px 80px -8px ${alpha(colorsCommon.black, 0.24)}`,
    //
    primary: `0 8px 16px 0 ${alpha(colorsPrimary.main, 0.24)}`,
    info: `0 8px 16px 0 ${alpha(colorsInfo.main, 0.24)}`,
    secondary: `0 8px 16px 0 ${alpha(colorsSecondary.main, 0.24)}`,
    success: `0 8px 16px 0 ${alpha(colorsSuccess.main, 0.24)}`,
    warning: `0 8px 16px 0 ${alpha(colorsWarning.main, 0.24)}`,
    error: `0 8px 16px 0 ${alpha(colorsError.main, 0.24)}`,
  };
}

import { alpha } from '../utils';

// SETUP COLORS
export const colorsGrey = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

export const colorsPrimary = {
  lighter: '#C8FAD6',
  light: '#5BE49B',
  main: '#00A76F',
  dark: '#007867',
  darker: '#004B50',
  contrastText: '#FFFFFF',
};

export const colorsSecondary = {
  lighter: '#EFD6FF',
  light: '#C684FF',
  main: '#8E33FF',
  dark: '#5119B7',
  darker: '#27097A',
  contrastText: '#FFFFFF',
};

export const colorsInfo = {
  lighter: '#CAFDF5',
  light: '#61F3F3',
  main: '#00B8D9',
  dark: '#006C9C',
  darker: '#003768',
  contrastText: '#FFFFFF',
};

export const colorsSuccess = {
  lighter: '#D3FCD2',
  light: '#77ED8B',
  main: '#22C55E',
  dark: '#118D57',
  darker: '#065E49',
  contrastText: '#ffffff',
};

export const colorsWarning = {
  lighter: '#FFF5CC',
  light: '#FFD666',
  main: '#FFAB00',
  dark: '#B76E00',
  darker: '#7A4100',
  contrastText: colorsGrey[800],
};

export const colorsError = {
  lighter: '#FFE9D5',
  light: '#FFAC82',
  main: '#FF5630',
  dark: '#B71D18',
  darker: '#7A0916',
  contrastText: '#FFFFFF',
};

export const colorsCommon = {
  black: '#000000',
  white: '#FFFFFF',
};

export const colorsCyan = {
  lighter: '#CCF4FE',
  light: '#68CDF9',
  main: '#078DEE',
  dark: '#0351AB',
  darker: '#012972',
  contrastText: '#FFFFFF',
};

export const colorsPurple = {
  lighter: '#EBD6FD',
  light: '#B985F4',
  main: '#7635dc',
  dark: '#431A9E',
  darker: '#200A69',
  contrastText: '#FFFFFF',
};

export const colorsBlue = {
  lighter: '#D1E9FC',
  light: '#76B0F1',
  main: '#2065D1',
  dark: '#103996',
  darker: '#061B64',
  contrastText: '#FFFFFF',
};

export const colorsOrange = {
  lighter: '#FEF4D4',
  light: '#FED680',
  main: '#fda92d',
  dark: '#B66816',
  darker: '#793908',
  contrastText: colorsGrey[800],
};

export const colorsRed = {
  lighter: '#FFE3D5',
  light: '#FFC1AC',
  main: '#FF3030',
  dark: '#B71833',
  darker: '#7A0930',
  contrastText: '#FFFFFF',
};

export const colorsAction = {
  hover: alpha(colorsGrey[500], 0.08),
  selected: alpha(colorsGrey[500], 0.16),
  disabled: alpha(colorsGrey[500], 0.8),
  disabledBackground: alpha(colorsGrey[500], 0.24),
  focus: alpha(colorsGrey[500], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

const colorsBase = {
  primary: colorsPrimary,
  secondary: colorsSecondary,
  info: colorsInfo,
  success: colorsSuccess,
  warning: colorsWarning,
  error: colorsError,
  grey: colorsGrey,
  common: colorsCommon,
  divider: alpha(colorsGrey[500], 0.2),
  action: colorsAction,
};

// ----------------------------------------------------------------------

export function palette(mode: 'light' | 'dark') {
  const light = {
    ...colorsBase,
    mode: 'light',
    text: {
      primary: colorsGrey[800],
      secondary: colorsGrey[600],
      disabled: colorsGrey[500],
    },
    background: {
      paper: '#FFFFFF',
      default: '#FFFFFF',
      neutral: colorsGrey[200],
    },
    action: {
      ...colorsBase.action,
      active: colorsGrey[600],
    },
  };

  const dark = {
    ...colorsBase,
    mode: 'dark',
    text: {
      primary: '#FFFFFF',
      secondary: colorsGrey[500],
      disabled: colorsGrey[600],
    },
    background: {
      paper: colorsGrey[800],
      default: colorsGrey[900],
      neutral: alpha(colorsGrey[500], 0.12),
    },
    action: {
      ...colorsBase.action,
      active: colorsGrey[500],
    },
  };

  return mode === 'light' ? light : dark;
}

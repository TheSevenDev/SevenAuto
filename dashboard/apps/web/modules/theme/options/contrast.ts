import { colorsGrey } from '@seven-auto/libs';

import { customShadows } from '../custom-shadows';

// ----------------------------------------------------------------------

export function createContrast(
  contrast: 'default' | 'bold',
  mode: 'light' | 'dark',
) {
  const theme = {
    ...(contrast === 'bold' &&
      mode === 'light' && {
        palette: {
          background: {
            default: colorsGrey[200],
          },
        },
      }),
  };

  const components = {
    ...(contrast === 'bold' && {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: customShadows(mode).z1,
          },
        },
      },
    }),
  };

  return {
    ...theme,
    components,
  };
}

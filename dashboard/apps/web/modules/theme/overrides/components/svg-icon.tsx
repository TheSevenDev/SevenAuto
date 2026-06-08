import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function svgIcon(theme: Theme) {
  return {
    MuiSvgIcon: {
      styleOverrides: {
        fontSizeLarge: {
          width: 32,
          height: 32,
          fontSize: 'inherit',
        },
      },
    },
  };
}

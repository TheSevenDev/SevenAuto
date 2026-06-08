import { alpha, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function cssBaseline(theme: Theme) {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
        },
        body: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
        },
        '#root, #__next': {
          width: '100%',
          height: '100%',
        },
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
            '&::-webkit-inner-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
          },
        },
        img: {
          maxWidth: '100%',
          display: 'inline-block',
          verticalAlign: 'bottom',
        },
        '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
          backgroundColor: theme.palette.background.paper,
          width: 8,
        },
        '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
          borderRadius: 8,
          backgroundColor: alpha(theme.palette.grey[600], 0.48),
          minHeight: 24,
          // border: `3px solid transparent`,
        },
        '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus':
          {
            backgroundColor: alpha(theme.palette.grey[600], 0.48),
          },
        '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active':
          {
            backgroundColor: alpha(theme.palette.grey[600], 0.48),
          },
        '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
          {
            backgroundColor: alpha(theme.palette.grey[600], 0.48),
          },
        '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
          backgroundColor: theme.palette.background.paper,
        },
      },
    },
  };
}

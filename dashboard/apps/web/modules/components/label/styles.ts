import Box from '@mui/material/Box';
import { alpha, styled, useTheme } from '@mui/material/styles';

import { LabelColor, LabelVariant } from './types';

// ----------------------------------------------------------------------

export const StyledLabel = styled(Box)(({
  ownerState,
}: {
  ownerState: {
    color: LabelColor;
    variant: LabelVariant;
  };
}) => {
  const currentTheme = useTheme();
  const lightMode = currentTheme.palette.mode === 'light';

  const filledVariant = ownerState.variant === 'filled';

  const outlinedVariant = ownerState.variant === 'outlined';

  const softVariant = ownerState.variant === 'soft';

  const defaultStyle = {
    ...(ownerState.color === 'default' && {
      // FILLED
      ...(filledVariant && {
        color: lightMode
          ? currentTheme.palette.common.white
          : currentTheme.palette.grey[800],
        backgroundColor: currentTheme.palette.text.primary,
      }),
      // OUTLINED
      ...(outlinedVariant && {
        backgroundColor: 'transparent',
        color: currentTheme.palette.text.primary,
        border: `2px solid ${currentTheme.palette.text.primary}`,
      }),
      // SOFT
      ...(softVariant && {
        color: currentTheme.palette.text.secondary,
        backgroundColor: alpha(currentTheme.palette.grey[500], 0.16),
      }),
    }),
  };

  const colorStyle = {
    ...(ownerState.color !== 'default' && {
      // FILLED
      ...(filledVariant && {
        color: currentTheme.palette[ownerState.color].contrastText,
        backgroundColor: currentTheme.palette[ownerState.color].main,
      }),
      // OUTLINED
      ...(outlinedVariant && {
        backgroundColor: 'transparent',
        color: currentTheme.palette[ownerState.color].main,
        border: `2px solid ${currentTheme.palette[ownerState.color].main}`,
      }),
      // SOFT
      ...(softVariant && {
        color:
          currentTheme.palette[ownerState.color][lightMode ? 'dark' : 'light'],
        backgroundColor: alpha(
          currentTheme.palette[ownerState.color].main,
          0.16,
        ),
      }),
    }),
  };

  return {
    height: 24,
    minWidth: 24,
    lineHeight: 0,
    borderRadius: 6,
    cursor: 'default',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    justifyContent: 'center',
    textTransform: 'capitalize',
    padding: currentTheme.spacing(0, 0.75),
    fontSize: currentTheme.typography.pxToRem(12),
    fontWeight: currentTheme.typography.fontWeightBold,
    transition: currentTheme.transitions.create('all', {
      duration: currentTheme.transitions.duration.shorter,
    }),
    ...defaultStyle,
    ...colorStyle,
  };
});

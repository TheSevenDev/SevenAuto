import { alpha } from '@mui/material/styles';
import {
  colorsBlue,
  colorsCyan,
  colorsOrange,
  colorsPrimary,
  colorsPurple,
  colorsRed,
} from '@seven-auto/libs';

// ----------------------------------------------------------------------

type PresetType = 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red';

export function createPresets(preset: PresetType) {
  const primaryColor = getPrimary(preset);

  const theme = {
    palette: {
      primary: primaryColor,
    },
    customShadows: {
      primary: `0 8px 16px 0 ${alpha(`${primaryColor?.main}`, 0.24)}`,
    },
  };

  return {
    ...theme,
  };
}

// ----------------------------------------------------------------------

export const presetOptions = [
  { name: 'default', value: colorsPrimary.main },
  { name: 'cyan', value: colorsCyan.main },
  { name: 'purple', value: colorsPurple.main },
  { name: 'blue', value: colorsBlue.main },
  { name: 'orange', value: colorsOrange.main },
  { name: 'red', value: colorsRed.main },
];

export function getPrimary(preset: PresetType) {
  return {
    default: colorsPrimary,
    cyan: colorsCyan,
    purple: colorsPurple,
    blue: colorsBlue,
    orange: colorsOrange,
    red: colorsRed,
  }[preset];
}

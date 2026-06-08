import { alpha, Stack, SxProps, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { bgGradient } from 'modules/theme/css';
import { ColorSchema } from 'modules/theme/palette';

interface AlertBoxProps {
  title: string;
  icon?: React.ReactNode;
  color?: ColorSchema;
  sx?: SxProps;
  actions?: React.ReactNode;
}

export default function AlertBox({
  title,
  icon,
  sx,
  color = 'primary',
  actions,
  ...other
}: AlertBoxProps) {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: alpha(theme.palette[color].light, 0.2),
          endColor: alpha(theme.palette[color].main, 0.2),
        }),
        p: 3,
        borderRadius: 2,
        textAlign: 'center',
        color: `${color}.darker`,
        backgroundColor: 'common.white',
        alignItems: 'start',
        flexDirection: 'row',
        gap: 2,
        ...sx,
      }}
    >
      {icon && icon}
      <Stack
        direction="column"
        spacing={2}
        sx={{
          alignItems: 'center',
        }}
        {...other}
      >
        <Typography variant="h6">{title}</Typography>
        {actions && actions}
      </Stack>
    </Stack>
  );
}

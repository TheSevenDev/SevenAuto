import ListItemText from '@mui/material/ListItemText';
import Stack, { StackProps } from '@mui/material/Stack';
import Iconify from 'modules/components/iconify';
import { ColorSchema } from 'modules/theme/palette';

// ----------------------------------------------------------------------

interface Props extends StackProps {
  icon: string;
  title: string;
  total: string;
  color?: ColorSchema;
}

export default function BalanceCard({
  title,
  total,
  icon,
  color = 'primary',
  sx,
  ...other
}: Props) {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        p: 3,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        color: 'common.white',
        bgcolor: `${color}.dark`,
        ...sx,
      }}
      {...other}
    >
      <ListItemText
        sx={{ ml: 3 }}
        primary={total}
        secondary={title}
        slotProps={{
          primary: {
            variant: 'h3',
            component: 'span',
          },
          secondary: {
            color: 'inherit',
            component: 'span',
            sx: { opacity: 0.64 },
            variant: 'subtitle2',
          },
        }}
      />
      <Iconify
        icon={icon}
        sx={{
          width: 112,
          right: 16,
          height: 112,
          opacity: 0.5,
          position: 'absolute',
        }}
      />
    </Stack>
  );
}

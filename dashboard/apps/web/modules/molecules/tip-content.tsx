import { Box, SxProps, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Iconify from 'modules/components/iconify';
import { ICONS_NAME } from 'modules/const/icons';

interface IProps {
  content: string;
  hasBox?: boolean;
  icon?: string;
  sx?: SxProps;
}

const TipContent = ({
  content,
  icon = ICONS_NAME.tip,
  hasBox = false,
  sx,
}: IProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 0.5,
        color: 'text.secondary',
        p: 0.5,
        borderRadius: '4px',
        ...(hasBox && {
          border: '1px dashed',
          borderColor: 'divider',
        }),
        ...sx,
      }}
    >
      <Iconify
        icon={icon}
        width={12}
        height={12}
        color={theme.palette.warning.main}
      />
      <Typography variant="caption">{content}</Typography>
    </Box>
  );
};

export default TipContent;

import { SxProps, Theme } from '@mui/material/styles';
import { Options } from 'react-markdown';

// ----------------------------------------------------------------------

export interface MarkdownProps extends Options {
  sx?: SxProps<Theme>;
  useStyles?: boolean;
  hasCounter?: boolean;
}

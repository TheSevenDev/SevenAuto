import { styled } from '@mui/material/styles';
import { contentStyle } from 'modules/theme/content';

// ----------------------------------------------------------------------

const StyledMarkdown = styled('div', {
  shouldForwardProp: (prop) => prop !== 'hasCounter',
})<{ hasCounter?: boolean }>(({ theme, hasCounter }) => ({
  ...contentStyle({ theme, hasCounter }),
}));

export default StyledMarkdown;

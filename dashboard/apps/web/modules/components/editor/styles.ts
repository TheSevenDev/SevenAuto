import Box from '@mui/material/Box';
import { alpha, styled, Theme } from '@mui/material/styles';
import { contentStyle } from 'modules/theme/content';

// ----------------------------------------------------------------------

const ButtonStyle = ({ theme }: { theme: Theme }) => ({
  borderRadius: 4,
  color: theme.palette.text.primary,
  '&:hover': {
    background: 'transparent',
    color: theme.palette.primary.main,
  },
  '&.is-active': {
    background: theme.palette.action.selected,
    color: theme.palette.primary.main,
  },
  '&:disabled': {
    color: theme.palette.action.disabled,
  },
});

export const StyledEditor = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasCounter',
})<{ hasCounter?: boolean }>(({ theme, hasCounter }) => ({
  overflowY: 'auto',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
  ...theme.typography.body2,
  minHeight: 160,
  maxHeight: 640,
  fontFamily: theme.typography.fontFamily,
  '& .ProseMirror': {
    minHeight: 120,
    padding: theme.spacing(2),
    backgroundColor: alpha(theme.palette.grey[500], 0.08),
    '&:focus': {
      outline: 'none',
    },
    '&.prose': {
      '& .ProseMirror-selectednode': {
        '& img': {
          outline: `3px solid ${theme.palette.primary.main}`,
        },
      },
      ...contentStyle({ theme, hasCounter }),
    },
  },
  '& .is-empty': {
    minHeight: '1.5rem',
    '&:before': {
      content: 'attr(data-placeholder)',
      float: 'left',
      color: theme.palette.text.disabled,
      pointerEvents: 'none',
      height: 0,
    },
  },
  '& .ProseMirror-trailingBreak': {
    margin: 0,
    padding: 0,
    marginTop: '0 !important',
    minHeight: '1.5rem',
  },
  '.editor-toolbar': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
    padding: theme.spacing(0.5),
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
    backgroundColor: theme.palette.background.paper,
  },
  '& .bubble-menu': {
    border: `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
    borderRadius: theme.shape.borderRadius,
    shadow: theme.shadows[20],
    backgroundColor: theme.palette.background.paper,
    '& .menu-button': {
      ...ButtonStyle({ theme }),
    },
    '& .editor-toolbar': {
      borderBottom: 'none',
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

// const isRTL = theme.direction === 'rtl';
export const StyledEditorToolbar = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 9,
  '& .menu-button': {
    ...ButtonStyle({ theme }),
  },
}));

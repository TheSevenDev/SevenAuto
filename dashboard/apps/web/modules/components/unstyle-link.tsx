// @mui
import { styled } from '@mui/material/styles';
import Link from 'next/link';

// ----------------------------------------------------------------------

const UnstyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none',
  '&:active': {
    color: theme.palette.text.primary,
  },
  '&:visited': {
    color: theme.palette.text.primary,
  },
  '&:hover': {
    color: theme.palette.text.secondary,
  },
}));

export default UnstyledLink;

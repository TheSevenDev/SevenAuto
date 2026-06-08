import Box, { BoxProps } from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import { useGlobalContext } from 'modules/context/global/use-global-context';
import { RouterLink } from 'modules/routes/components';
import { forwardRef, Ref } from 'react';

// ----------------------------------------------------------------------

const DEFAULT_LOGO_SRC = '/images/logo.svg';

function resolveLogoSrc(siteLogo?: string | null) {
  const trimmed = siteLogo?.trim();
  return trimmed || DEFAULT_LOGO_SRC;
}

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const theme = useTheme();
    const { siteInfo } = useGlobalContext();
    const logoSrc = resolveLogoSrc(siteInfo?.siteLogo);

    const logo = (
      <Box
        component="img"
        ref={ref}
        src={logoSrc}
        sx={{
          width: 40,
          height: 40,
          cursor: 'pointer',
          fill: theme.palette.primary.main,
          ...sx,
        }}
        {...other}
      />
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link
        ref={ref as Ref<HTMLAnchorElement>}
        component={RouterLink}
        href="/"
        sx={{ display: 'contents' }}
        {...other}
      >
        {logo}
      </Link>
    );
  },
);
Logo.displayName = 'Logo';
export default Logo;

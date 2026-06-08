import { Box } from '@mui/material';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import { TypographyProps } from '@mui/material/Typography';
import { useGlobalContext } from 'modules/context/global/use-global-context';
import { RouterLink } from 'modules/routes/components';
import { forwardRef, Ref } from 'react';

// ----------------------------------------------------------------------

export interface SiteNameProps extends TypographyProps {
  disabledLink?: boolean;
}

const SiteName = forwardRef<HTMLParagraphElement, SiteNameProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const theme = useTheme();
    const { siteInfo } = useGlobalContext();

    const siteName = siteInfo?.siteTextLogo ? (
      <Box
        component="img"
        ref={ref}
        src={siteInfo?.siteTextLogo || ''}
        sx={{
          height: 34,
          cursor: 'pointer',
          fill: theme.palette.primary.main,
          ...sx,
        }}
        {...other}
      />
    ) : null;

    if (siteInfo?.siteLogo && !siteInfo?.siteTextLogo) return null;

    if (disabledLink) {
      return siteName;
    }

    return (
      <Link
        ref={ref as Ref<HTMLAnchorElement>}
        component={RouterLink}
        href="/"
        sx={{ display: 'contents' }}
        {...other}
      >
        {siteName}
      </Link>
    );
  },
);
SiteName.displayName = 'SiteName';
export default SiteName;

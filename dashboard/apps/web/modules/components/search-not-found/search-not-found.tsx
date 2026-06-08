import Paper, { PaperProps } from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTranslate } from 'modules/locales';

// ----------------------------------------------------------------------

interface Props extends PaperProps {
  query?: string;
}

export default function SearchNotFound({ query, sx, ...other }: Props) {
  const { t } = useTranslate();
  return query ? (
    <Paper
      sx={{
        bgcolor: 'unset',
        textAlign: 'center',
        ...sx,
      }}
      {...other}
    >
      <Typography variant="h6" gutterBottom>
        {t('notFound.label')}
      </Typography>

      <Typography variant="body2">
        {t('notFound.no_results_found_for')} &nbsp;
        <strong>&quot;{query}&quot;</strong>.
        <br /> {t('notFound.try_checking_for_typos_or_using_complete_words')}
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2" sx={sx}>
      {t('notFound.enter_keywords')}
    </Typography>
  );
}

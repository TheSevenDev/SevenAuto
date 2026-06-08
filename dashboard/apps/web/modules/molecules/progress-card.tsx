import ListItemText from '@mui/material/ListItemText';
import Stack, { StackProps } from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { ApexOptions } from 'apexcharts';
import Chart, { useChart } from 'modules/components/chart';
import Iconify from 'modules/components/iconify';
import { ColorSchema } from 'modules/theme/palette';
import { fNumber } from 'modules/utils/format-number';

// ----------------------------------------------------------------------

interface Props extends StackProps {
  icon: string;
  title: string;
  total: number;
  color?: ColorSchema;
  chart?: {
    color?: string[];
    series: number;
    options?: ApexOptions;
  };
}

export default function ProgressCard({
  title,
  total,
  icon,
  color = 'primary',
  chart,
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
      {chart && (
        <ProgressCardChart
          series={chart?.series}
          options={chart?.options || {}}
          color={color}
        />
      )}
      <ListItemText
        sx={{ ml: 3 }}
        primary={fNumber(total)}
        secondary={title}
        slotProps={{
          primary: {
            variant: chart ? 'h4' : 'h3',
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
          right: -32,
          height: 112,
          opacity: 0.08,
          position: 'absolute',
        }}
      />
    </Stack>
  );
}

const ProgressCardChart = ({
  series,
  options,
  color,
}: {
  series: number;
  options: ApexOptions;
  color: ColorSchema;
}) => {
  const theme = useTheme();

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    legend: {
      show: false,
    },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: theme.palette[color].light, opacity: 1 },
          { offset: 100, color: theme.palette[color].main, opacity: 1 },
        ],
      },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '60%',
        },
        track: {
          margin: 0,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: 6,
            color: theme.palette.common.white,
            fontSize: theme.typography.subtitle2.fontSize as string,
          },
        },
      },
    },
    ...options,
  });

  return (
    <Chart
      dir="ltr"
      type="radialBar"
      series={[series]}
      options={chartOptions}
      width={86}
      height={86}
    />
  );
};

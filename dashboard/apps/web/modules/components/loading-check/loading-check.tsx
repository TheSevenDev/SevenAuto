import { styled } from '@mui/material/styles';
import parse from 'html-react-parser';
import React from 'react';

interface LoadingCheckProps {
  isLoading: boolean;
  status?: 'success' | 'error' | 'warning';
  width?: number;
  height?: number;
}

interface StyledSvgProps {
  width: number;
  height: number;
}

const StyledSvg = styled('svg')<StyledSvgProps>(({ width, height, theme }) => ({
  width,
  height,
  '& #status': {
    stroke: theme.palette.success.main,
    strokeWidth: width / 12 > 10 ? 10 : width / 12,
    transition: 'all 1s',
  },
  '& #circle': {
    stroke: theme.palette.success.main,
    strokeWidth: width / 12 > 10 ? 10 : width / 12,
    transformOrigin: '50px 50px 0',
    transition: 'all 1s',
    strokeDasharray: 5400,
  },
  '&.progress': {
    '& #status': {
      opacity: 0,
    },
    '& #circle': {
      stroke: theme.palette.grey[500],
      strokeDasharray: 314,
      strokeDashoffset: 1000,
      animation: 'spin 3s linear infinite',
    },
  },
  '&.success': {
    '& #status': {
      strokeDasharray: 1000,
      strokeDashoffset: 1000,
      stroke: theme.palette.success.main,
      animation: 'draw 8s ease-out forwards',
    },
    '& #circle': {
      strokeDashoffset: 66,
      stroke: theme.palette.success.main,
    },
  },
  '&.error': {
    '& #status': {
      strokeDasharray: 1000,
      strokeDashoffset: 1000,
      stroke: theme.palette.error.main,
      animation: 'draw 8s ease-out forwards',
    },
    '& #circle': {
      strokeDashoffset: 66,
      stroke: theme.palette.error.main,
    },
  },
  '&.warning': {
    '& #status': {
      strokeDasharray: 1000,
      strokeDashoffset: 1000,
      stroke: theme.palette.warning.main,
      animation: 'draw 8s ease-out forwards',
    },
    '& #circle': {
      strokeDashoffset: 66,
      stroke: theme.palette.warning.main,
    },
  },
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(0deg)',
      strokeDashoffset: 66,
    },
    '50%': {
      transform: 'rotate(540deg)',
      strokeDashoffset: 314,
    },
    '100%': {
      transform: 'rotate(1080deg)',
      strokeDashoffset: 66,
    },
  },
  '@keyframes draw': {
    to: {
      strokeDashoffset: 0,
    },
  },
}));

const LoadingCheck = ({
  isLoading,
  status = 'success',
  width = 200,
  height = 200,
}: LoadingCheckProps) => {
  let className = 'loading-check';
  let path = '';

  switch (status) {
    case 'success':
      path =
        '<polyline id="status" points="25,55 45,70 75,33" fill="transparent" />';
      className = 'loading-check success';
      break;
    case 'error':
      path =
        '<line id="status" x1="25" y1="25" x2="75" y2="75" fill="transparent"></line>\n<line id="status" x1="25" y1="75" x2="75" y2="25" fill="transparent"></line>';
      className = 'loading-check error';
      break;
    case 'warning':
      path =
        '<line id="status" x1="50" y1="20" x2="50" y2="65" fill="transparent"></line>\n<line id="status" x1="50" y1="72" x2="50" y2="80" fill="transparent"></line>';
      className = 'loading-check warning';
      break;
    default:
      className = 'loading-check';
      break;
  }

  return (
    <StyledSvg
      width={width}
      height={height}
      className={`loading-check ${isLoading ? 'progress' : className}`}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 100 100"
      xmlSpace="preserve"
    >
      <circle id="circle" cx="50" cy="50" r="44" fill="transparent" />
      {parse(path)}
    </StyledSvg>
  );
};

export default LoadingCheck;

import { SxProps, Theme } from '@mui/material';
import React from 'react';

import Markdown from '../markdown/markdown';
import { replaceAllAssetUrlsBack } from './utils';

interface IProps {
  content: string;
  useStyles?: boolean;
  hasCounter?: boolean;
  //
  sx?: SxProps<Theme>;
}

export default function ContentView({
  content,
  useStyles = true,
  sx,
  hasCounter = true,
}: IProps) {
  const contentView = replaceAllAssetUrlsBack(content);
  return (
    <Markdown useStyles={useStyles} sx={sx} hasCounter={hasCounter}>
      {contentView}
    </Markdown>
  );
}

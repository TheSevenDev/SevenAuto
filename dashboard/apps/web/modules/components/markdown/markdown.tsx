import 'modules/utils/highlight';

import Link from '@mui/material/Link';
import { RouterLink } from 'modules/routes/components';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
// markdown plugins
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import Image from '../image';
import StyledMarkdown from './styles';
import { MarkdownProps } from './types';

// ----------------------------------------------------------------------

export default function Markdown({
  useStyles = true,
  sx,
  hasCounter = false,
  ...other
}: MarkdownProps) {
  if (!useStyles) {
    return (
      <ReactMarkdown
        rehypePlugins={[
          rehypeRaw,
          rehypeHighlight,
          [remarkGfm, { singleTilde: false }],
        ]}
        components={components}
        {...other}
      />
    );
  }

  return (
    <StyledMarkdown sx={sx} hasCounter={hasCounter}>
      <ReactMarkdown
        rehypePlugins={[
          rehypeRaw,
          rehypeHighlight,
          [remarkGfm, { singleTilde: false }],
        ]}
        components={components}
        {...other}
      />
    </StyledMarkdown>
  );
}

// ----------------------------------------------------------------------

const components = {
  img: ({ ...props }) => (
    <Image alt={props.alt} sx={{ borderRadius: 2 }} {...props} />
  ),
  a: ({ ...props }) => {
    const isHttp = props.href.includes('http');

    return isHttp ? (
      <Link target="_blank" rel="noopener" {...props} />
    ) : (
      <Link component={RouterLink} href={props.href} {...props}>
        {props.children}
      </Link>
    );
  },
};

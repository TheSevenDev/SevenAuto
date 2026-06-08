'use client';

import CompactLayout from 'modules/layouts/compact';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <CompactLayout>{children}</CompactLayout>;
}

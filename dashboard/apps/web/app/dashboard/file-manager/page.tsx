import { ELanguage } from '@seven-auto/libs';
import { FileManagerView } from 'modules/sections/file-manager/view';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function FileManagerPage() {
  return <FileManagerView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Dashboard: File Manager',
    },
    [ELanguage.VI]: {
      title: 'Dashboard: Quản lý tệp',
    },
  };
  return metadata[locale as ELanguage];
}

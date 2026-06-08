import { ELanguage } from '@seven-auto/libs';
import { UserTransactionView } from 'modules/sections/account/view';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
// ----------------------------------------------------------------------

export default function UserTransactionPage() {
  return <UserTransactionView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Dashboard: Transaction',
    },
    [ELanguage.VI]: {
      title: 'Bảng điều khiển: Giao dịch',
    },
  };
  return metadata[locale as ELanguage];
}

import { ELanguage } from '@seven-auto/libs';
import { UserOrderView } from 'modules/sections/account/view';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
// ----------------------------------------------------------------------

export default function UserOrderPage() {
  return <UserOrderView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Dashboard: Order',
    },
    [ELanguage.VI]: {
      title: 'Dashboard: Đơn hàng',
    },
  };
  return metadata[locale as ELanguage];
}

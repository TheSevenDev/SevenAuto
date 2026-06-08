import { ELanguage } from '@seven-auto/libs';
import { FaqsView } from 'modules/sections/faqs/view';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function FaqsPage() {
  return <FaqsView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'FAQ - Frequently Asked Questions - Seven Auto',
      description:
        'Find answers to common questions about Seven Auto features, pricing, and services.',
    },
    [ELanguage.VI]: {
      title: 'Câu hỏi thường gặp - FAQ - Seven Auto',
      description:
        'Tìm câu trả lời cho các câu hỏi thường gặp về tính năng, giá cả và dịch vụ của Seven Auto.',
    },
  };
  return metadata[locale as ELanguage];
}

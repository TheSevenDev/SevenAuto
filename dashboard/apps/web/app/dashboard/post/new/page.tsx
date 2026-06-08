import { ELanguage } from '@seven-auto/libs';
import { PostCreateView } from 'modules/sections/blog/view';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function PostCreatePage() {
  return <PostCreateView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Dashboard: Create a new post',
    },
    [ELanguage.VI]: {
      title: 'Bảng điều khiển: Tạo bài viết mới',
    },
  };
  return metadata[locale as ELanguage];
}

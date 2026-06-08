import { ELanguage } from '@seven-auto/libs';
import { PostListView } from 'modules/sections/blog/view';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function PostListPage() {
  return <PostListView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Dashboard: Post Management',
      description: 'Manage your blog posts, articles, and content.',
    },
    [ELanguage.VI]: {
      title: 'Bảng điều khiển: Quản lý bài viết',
      description: 'Quản lý các bài viết blog của bạn.',
    },
  };
  return metadata[locale as ELanguage];
}

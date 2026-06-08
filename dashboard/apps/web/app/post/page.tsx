import { ELanguage } from '@seven-auto/libs';
import { PostListHomeView } from 'modules/sections/blog/view';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default function PostListHomePage() {
  return <PostListHomeView />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'Post List - FitnessBase',
    },
    [ELanguage.VI]: {
      title: 'Danh sách bài viết - FitnessBase',
    },
  };
  return metadata[locale as ELanguage];
}

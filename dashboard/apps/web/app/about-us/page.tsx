import { ELanguage } from '@seven-auto/libs';
import { AboutView } from 'modules/sections/about/view';
import apiServices from 'modules/services/apiService';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

// ----------------------------------------------------------------------

export default async function AboutPage() {
  const post = await apiServices.post.getPostBySlug('about-us');

  return <AboutView post={post} />;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const metadata: Record<ELanguage, Metadata> = {
    [ELanguage.EN]: {
      title: 'About us - SevenAuto',
      description: 'About us',
    },
    [ELanguage.VI]: {
      title: 'Về chúng tôi - SevenAuto',
      description: 'Về chúng tôi',
    },
  };
  return metadata[locale as ELanguage];
}

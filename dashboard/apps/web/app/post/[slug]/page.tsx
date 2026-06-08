import { PostDetailsHomeView } from 'modules/sections/blog/view';
import apiServices from 'modules/services/apiService';
import { ESocialType, getSocialImages } from 'modules/utils/social-image';
import { notFound } from 'next/navigation';

// ----------------------------------------------------------------------

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostDetailsHomePage({ params }: PageProps) {
  const { slug } = await params;

  const post = await apiServices.post.getPostBySlug(slug);

  if (!post) return notFound();

  return <PostDetailsHomeView post={post} />;
}

export async function generateMetadata(props: PageProps) {
  const { slug } = await props.params;
  const post = await apiServices.post.getPostBySlug(slug);
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const socialImages = getSocialImages({
    type: ESocialType.POST,
    id: post.id,
  });

  const { title, description } = post;

  return {
    title,
    description,
    openGraph: {
      title,
      type: 'article',
      description,
      images: [{ url: socialImages.facebook }],
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
      images: [{ url: socialImages.twitter }],
    },
  };
}

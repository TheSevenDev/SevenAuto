import { PostEditView } from 'modules/sections/blog/view';
import apiServices from 'modules/services/apiService';
import { getMetadataPost } from 'modules/utils/metadata';
import { Metadata } from 'next';

// ----------------------------------------------------------------------

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostEditPage({ params }: PageProps) {
  const { slug } = await params;

  return <PostEditView slug={slug} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await apiServices.post.getPostBySlug(slug);
  const metadata: Metadata = getMetadataPost(post);
  return metadata;
}

import { EmailTemplateEditView } from 'modules/sections/email/view';

// ----------------------------------------------------------------------

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EmailTemplateEditPage({ params }: PageProps) {
  const { id } = await params;

  return <EmailTemplateEditView id={id} />;
}

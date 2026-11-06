import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { FindDoulaView } from './_components/find-doula-view';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('findDoula');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    // Same page as /for-families/find-a-doula (canvas FindDoula).
    alternates: { canonical: '/for-families/find-a-doula' },
    openGraph: { title: t('metaTitle'), description: t('metaDescription') },
  };
}

export default function ForFamiliesPage() {
  return <FindDoulaView path="/for-families" />;
}

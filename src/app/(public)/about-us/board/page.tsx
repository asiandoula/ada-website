import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BoardView } from './_components/board-view';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('board');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: '/about-us/board' },
    openGraph: { title: t('metaTitle'), description: t('metaDescription') },
  };
}

export default function BoardOfDirectorsPage() {
  return <BoardView path="/about-us/board" />;
}

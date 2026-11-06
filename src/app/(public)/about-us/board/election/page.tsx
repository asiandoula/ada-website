import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BoardView } from '../_components/board-view';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('board');
  return {
    title: t('electionMetaTitle'),
    description: t('electionMetaDescription'),
    // The election content now lives on the board page (canvas Board).
    alternates: { canonical: '/about-us/board' },
    openGraph: { title: t('electionMetaTitle'), description: t('electionMetaDescription') },
  };
}

export default function BoardElectionPage() {
  return <BoardView path="/about-us/board/election" />;
}

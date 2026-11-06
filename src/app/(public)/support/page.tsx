import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { HelpContact } from './_kit/help-contact';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('support.meta');
  return {
    title: t('helpTitle'),
    description: t('helpDescription'),
    alternates: { canonical: '/support' },
    openGraph: {
      title: `${t('helpTitle')} | Asian Doula Alliance`,
      description: t('helpDescription'),
      images: [{ url: '/images/hero.webp', width: 1200, height: 630 }],
    },
  };
}

export default function SupportPage() {
  return <HelpContact variant="help" />;
}

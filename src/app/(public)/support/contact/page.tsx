import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { HelpContact } from '../_kit/help-contact';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('support.meta');
  return {
    title: t('contactTitle'),
    description: t('contactDescription'),
    // Same page body as /support, with the message form first.
    alternates: { canonical: '/support' },
    openGraph: {
      title: `${t('contactTitle')} | Asian Doula Alliance`,
      description: t('contactDescription'),
      images: [{ url: '/images/hero.webp', width: 1200, height: 630 }],
    },
  };
}

export default function ContactPage() {
  return <HelpContact variant="contact" />;
}

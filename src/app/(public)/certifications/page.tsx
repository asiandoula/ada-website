import { Metadata } from 'next';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: 'Certifications | Asian Doula Alliance',
  description:
    'Three certification tracks to advance your career in maternal and newborn care — Postpartum Doula, Birth Doula, and IBCLC Exam Prep.',
};

// Each track uses a static set of keys — the `keyPrefix` is a literal so the
// i18n guard can statically verify each lookup. Do NOT derive keys from titles
// via string manipulation; that silently breaks when JSON uses different case.
const tracks = [
  {
    keyPrefix: 'trackPostpartumDoula',
    badge: 'Now Enrolling',
    badgeClass: 'bg-green-50 text-green-700',
    href: '/certifications/postpartum-doula',
    cardBorder: 'border-ada-purple/20',
    opacity: '',
    hasFacts: true,
  },
  {
    keyPrefix: 'trackBirthDoula',
    badge: 'Coming Soon',
    badgeClass: 'bg-ada-purple/10 text-ada-purple',
    href: '/certifications/birth-doula',
    cardBorder: 'border-gray-200',
    opacity: 'opacity-90',
    hasFacts: false,
  },
  {
    keyPrefix: 'trackIbclcExamPrep',
    badge: 'Coming Soon',
    badgeClass: 'bg-ada-purple/10 text-ada-purple',
    href: '/certifications/ibclc',
    cardBorder: 'border-gray-200',
    opacity: 'opacity-90',
    hasFacts: false,
  },
] as const;

const sharedLinks = [
  { labelKey: 'sharedLinkRenewCertification', href: '/for-doulas/renew' },
  { labelKey: 'sharedLinkCodeOfConduct', href: '/for-doulas/code-of-conduct' },
  { labelKey: 'sharedLinkVerifyADoula', href: '/verify' },
] as const;

export default function CertificationsPage() {
  const t = useTranslations('certifications');

  return (
    <>
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            {t('certificationsTitle')}
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            {t('heroChooseYourPath')}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            {t('heroDescription')}
          </p>
        </div>
      </section>

      {/* Three Track Cards */}
      <section className="bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {tracks.map((track) => {
              // Static key lookups — one branch per track. The guard script
              // verifies each literal key against messages/en.json at build time.
              let title: string;
              let description: string;
              let facts: string | null;
              let linkText: string;
              switch (track.keyPrefix) {
                case 'trackPostpartumDoula':
                  title = t('trackPostpartumDoulaTitle');
                  description = t('trackPostpartumDoulaDescription');
                  facts = track.hasFacts ? t('trackPostpartumDoulaFacts') : null;
                  linkText = t('trackPostpartumDoulaLinkText');
                  break;
                case 'trackBirthDoula':
                  title = t('trackBirthDoulaTitle');
                  description = t('trackBirthDoulaDescription');
                  facts = null;
                  linkText = t('trackBirthDoulaLinkText');
                  break;
                case 'trackIbclcExamPrep':
                  title = t('trackIbclcExamPrepTitle');
                  description = t('trackIbclcExamPrepDescription');
                  facts = null;
                  linkText = t('trackIbclcExamPrepLinkText');
                  break;
              }
              return (
                <div
                  key={track.keyPrefix}
                  className={`bg-white border-2 ${track.cardBorder} rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300 ${track.opacity}`}
                >
                  <span
                    className={`inline-block ${track.badgeClass} text-xs px-2.5 py-0.5 rounded-full font-medium mb-4`}
                  >
                    {track.badge}
                  </span>
                  <h2 className="font-dm-serif text-2xl text-ada-navy">{title}</h2>
                  <p className="mt-3 text-ada-navy/60 text-sm leading-relaxed">
                    {description}
                  </p>
                  {facts && (
                    <p className="mt-4 text-xs text-ada-navy/40 font-outfit">
                      {facts}
                    </p>
                  )}
                  <Link
                    href={track.href}
                    className="mt-6 inline-flex items-center rounded-full bg-ada-purple text-white px-4 py-2.5 text-sm font-medium hover:bg-ada-purple-hover transition-colors"
                  >
                    {linkText}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shared Resources */}
      <section className="bg-ada-off-white py-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-2xl md:text-3xl text-ada-navy mb-8">
            {t('sharedResourcesTitle')}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            {sharedLinks.map((link) => {
              let label: string;
              switch (link.labelKey) {
                case 'sharedLinkRenewCertification':
                  label = t('sharedLinkRenewCertification');
                  break;
                case 'sharedLinkCodeOfConduct':
                  label = t('sharedLinkCodeOfConduct');
                  break;
                case 'sharedLinkVerifyADoula':
                  label = t('sharedLinkVerifyADoula');
                  break;
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-ada-navy/70 hover:text-ada-purple text-sm font-outfit transition-colors"
                >
                  {label} &rarr;
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

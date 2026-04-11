import { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: 'Scholarship Program',
  description:
    'ADA Scholarship Program — making doula certification accessible to aspiring caregivers from all backgrounds through financial assistance.',
  openGraph: {
    title: 'Scholarship Program | Asian Doula Alliance',
    description:
      'ADA Scholarship Program — making doula certification accessible to aspiring caregivers from all backgrounds through financial assistance.',
    images: [{ url: '/images/hero.webp', width: 1200, height: 630 }],
  },
};

export default function ScholarshipPage() {
  const t = useTranslations('scholarship');

  const eligibility = [
    t('eligibilityItem1'),
    t('eligibilityItem2'),
    t('eligibilityItem3'),
    t('eligibilityItem4'),
  ];

  const glanceItems = [
    t('glanceItem1'),
    t('glanceItem2'),
    t('glanceItem3'),
    t('glanceItem4'),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Programs', path: '/programs' },
              { name: 'Scholarship', path: '/programs/scholarship' },
            ])
          ),
        }}
      />
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            {t('heroTitle')}
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            {t('heroDescription')}
          </p>
        </div>
      </section>

      {/* About the Scholarship */}
      <section className="py-20 bg-ada-cream">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-3">
              <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                {t('removingBarriersTitle')}
              </h2>
              <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed">
                {t('removingBarriersDescription')}
              </p>
              <p className="mt-4 text-lg text-ada-navy/70 leading-relaxed">
                {t('scholarshipCoverage')}
              </p>
              <p className="mt-4 text-lg text-ada-navy/70 leading-relaxed">
                {t('priorityCandidates')}
              </p>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-ada-lavender rounded-2xl p-8">
                <h3 className="font-dm-serif text-xl text-ada-navy">
                  {t('atAGlanceTitle')}
                </h3>
                <ul className="mt-6 space-y-4">
                  {glanceItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-ada-navy/70"
                    >
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-ada-purple shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy text-center">
            {t('eligibilityTitle')}
          </h2>
          <div className="mt-14 max-w-3xl mx-auto space-y-8">
            {eligibility.map((item, index) => (
              <div key={index} className="flex items-start gap-6">
                <span className="font-dm-serif text-3xl text-ada-purple shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-lg text-ada-navy/70 leading-relaxed pt-1">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-20 bg-ada-cream">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
            {t('howToApplyTitle')}
          </h2>
          <p className="mt-8 text-lg text-ada-navy/70 leading-relaxed">
            {t('howToApplyDescription')}
          </p>
          <ul className="mt-8 space-y-3 text-lg text-ada-navy/70 text-left max-w-md mx-auto">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-ada-purple shrink-0" />
              <span>{t('applicationItem1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-ada-purple shrink-0" />
              <span>{t('applicationItem2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-ada-purple shrink-0" />
              <span>{t('applicationItem3')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-ada-purple shrink-0" />
              <span>{t('applicationItem4')}</span>
            </li>
          </ul>
          <p className="mt-8 text-ada-navy/70 leading-relaxed">
            {t('applicationReview')}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-ada-navy">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-white">
            {t('ctaTitle')}
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:contact@asiandoula.org"
              className="inline-flex items-center px-4 py-2.5 text-sm bg-ada-purple text-white font-medium rounded-full hover:bg-ada-purple-hover transition-colors"
            >
              {t('applyNow')}
            </a>
            <Link
              href="/certifications/postpartum-doula/training"
              className="inline-flex items-center px-4 py-2.5 text-sm border-2 border-white text-white font-medium rounded-full hover:bg-white hover:text-ada-navy transition-colors"
            >
              {t('findTrainingPrograms')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

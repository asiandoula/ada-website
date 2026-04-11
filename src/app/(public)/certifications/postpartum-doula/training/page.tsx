import { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { ContactForm } from '@/components/public/contact-form';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Find a Doula Training | Asian Doula Alliance',
  description:
    'Find ADA-approved doula training programs. Learn what to look for in a quality training program.',
};

export default async function FindADoulaTrainingPage() {
  const t = await getTranslations('certTraining');

  const lookForItems = [
    {
      title: t('adaApprovedCurriculum'),
      description:
        t('adaApprovedCurriculumDescription'),
    },
    {
      title: t('multilingualSupport'),
      description:
        t('multilingualSupportDescription'),
    },
    {
      title: t('handsOnPractice'),
      description:
        t('handsOnPracticeDescription'),
    },
    {
      title: t('culturalCompetencyTraining'),
      description:
        t('culturalCompetencyTrainingDescription'),
    },
    {
      title: t('experiencedInstructors'),
      description:
        t('experiencedInstructorsDescription'),
    },
  ];

  const trainingProviders = [
    {
      name: 'Cooings Doula Training Program',
      location: 'Irvine, CA',
      languages: ['English', 'Chinese'],
      duration: '4-5 days intensive',
      description:
        t('trainingProviderDescription'),
      address: '7515 Irvine Center Drive, #110, Irvine, CA 92618',
    },
  ];

  const sidebarLinks = [
    { label: t('stepsToCertification'), href: '/certifications/postpartum-doula/steps' },
    { label: t('examDetails'), href: '/certifications/postpartum-doula/exam' },
    { label: t('renewRecertification'), href: '/for-doulas/renew' },
    { label: t('codeOfConduct'), href: '/for-doulas/code-of-conduct' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: t('certifications'), path: '/certifications' },
              { name: t('postpartumDoula'), path: '/certifications/postpartum-doula' },
              { name: t('findATraining'), path: '/certifications/postpartum-doula/training' },
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
            {t('heroHeading')}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            {t('heroDescription')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Main content column */}
            <div className="lg:w-4/5 space-y-16">
              {/* What to Look For */}
              <div>
                <h2 className="font-dm-serif text-3xl text-ada-navy mb-8">
                  {t('whatToLookFor')}
                </h2>
                <div className="space-y-6">
                  {lookForItems.map((item) => (
                    <div key={item.title}>
                      <h3 className="font-outfit font-semibold text-ada-navy">{item.title}</h3>
                      <p className="mt-2 text-ada-navy/60 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ADA-Approved Providers */}
              <div>
                <h2 className="font-dm-serif text-3xl text-ada-navy mb-8">
                  {t('adaApprovedProviders')}
                </h2>
                <div className="space-y-6">
                  {trainingProviders.map((provider) => (
                    <div
                      key={provider.name}
                      className="bg-ada-off-white rounded-2xl p-8"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                        <div>
                          <h3 className="font-outfit text-lg font-semibold text-ada-navy">
                            {provider.name}
                          </h3>
                          <p className="text-ada-navy/60 text-sm">{provider.location}</p>
                        </div>
                        <span className="inline-flex items-center text-ada-purple bg-ada-purple/10 text-xs px-2.5 py-0.5 rounded-full font-medium shrink-0">
                          {t('adaApproved')}
                        </span>
                      </div>
                      <p className="text-ada-navy/60 text-sm mb-4 leading-relaxed">
                        {provider.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-ada-navy/60">
                        <span>
                          <strong className="text-ada-navy">{t('duration')}</strong> {provider.duration}
                        </span>
                        <span>
                          <strong className="text-ada-navy">{t('languages')}</strong>{' '}
                          {provider.languages.join(', ')}
                        </span>
                      </div>
                      <p className="text-sm text-ada-navy/60 mt-2">
                        <strong className="text-ada-navy">{t('address')}</strong> {provider.address}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Become a Provider CTA */}
              <div className="bg-ada-off-white rounded-2xl p-10 text-center">
                <h2 className="font-dm-serif text-2xl md:text-3xl text-ada-navy">
                  {t('becomeProviderCta')}
                </h2>
                <p className="mt-3 text-ada-navy/60 leading-relaxed max-w-xl mx-auto">
                  {t('becomeProviderDescription')}
                </p>
                <a
                  href="mailto:contact@asiandoula.org"
                  className="mt-6 inline-flex items-center rounded-full bg-ada-purple text-white px-4 py-2.5 text-sm font-medium hover:bg-ada-purple-hover transition-colors"
                >
                  {t('contactAda')}
                </a>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/5">
              <div className="lg:sticky lg:top-32">
                <span className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-navy/40">
                  {t('heroTitle')}
                </span>
                <nav className="mt-4 flex flex-col">
                  {sidebarLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block py-1.5 text-sm text-ada-navy/60 hover:text-ada-purple transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactForm />
    </>
  );
}

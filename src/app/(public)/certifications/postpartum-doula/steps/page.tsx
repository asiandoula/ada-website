import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { Steps } from '@/components/public/steps';
import { Accordion } from '@/components/public/accordion';
import { ContactForm } from '@/components/public/contact-form';
import { SidebarNav } from '@/components/public/sidebar-nav';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Steps to Certification | Asian Doula Alliance',
  description:
    'Learn how to become a certified postpartum doula through ADA. Complete training, pass the exam, and earn your certification.',
};

const sidebarLinks = [
  { label: 'Find a Training', href: '/certifications/postpartum-doula/training' },
  { label: 'Exam Details', href: '/certifications/postpartum-doula/exam' },
  { label: 'Renew / Recertification', href: '/for-doulas/renew' },
  { label: 'Code of Conduct', href: '/for-doulas/code-of-conduct' },
];

const glanceItems = [
  { label: 'Exam Fee', value: '$625' },
  { label: 'Exam Format', value: 'Written (60 min) + Practical (30 min)' },
  { label: 'Languages', value: 'English, Chinese, Japanese, Korean' },
  { label: 'Certificate Validity', value: '1 year' },
];

const certBenefits = [
  'Official ADA certification certificate with unique exam ID',
  'Listing in the ADA Certified Doula Registry (publicly verifiable)',
  'Recognition by major insurance providers (Medi-Cal, Kaiser, Cigna, IEHP, Carrot Fertility, Progyny)',
  'Access to continuing education resources',
  'Membership in the ADA professional community',
  'Right to use the "ADA Certified" designation',
];

export default async function StepsToCertificationPage() {
  const t = await getTranslations('certSteps');

  const certSteps = [
    {
      number: '1',
      title: t('step1Title'),
      description: t('step1Description'),
    },
    {
      number: '2',
      title: t('step2Title'),
      description: t('step2Description'),
    },
    {
      number: '3',
      title: t('step3Title'),
      description: t('step3Description'),
    },
  ];

  const faqItems = [
    { question: t('faq1Q'), answer: t('faq1A') },
    { question: t('faq2Q'), answer: t('faq2A') },
    { question: t('faq3Q'), answer: t('faq3A') },
    { question: t('faq4Q'), answer: t('faq4A') },
    { question: t('faq5Q'), answer: t('faq5A') },
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
              { name: t('stepsToCertification'), path: '/certifications/postpartum-doula/steps' },
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
            {t('stepsToCertification')}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            {t('threeStepsDescription')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="lg:flex lg:gap-12">
            {/* Sidebar */}
            <aside className="lg:w-1/5 mb-10 lg:mb-0">
              <div className="lg:sticky lg:top-32">
                <span className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-navy/40 mb-4 block">
                  {t('heroTitle')}
                </span>
                <SidebarNav items={sidebarLinks} />
              </div>
            </aside>

            {/* Main column */}
            <div className="lg:w-4/5 space-y-16">
              {/* a. Heading + intro */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                  {t('yourPathToCertification')}
                </h2>
                <p className="mt-4 text-ada-navy/60 leading-relaxed max-w-3xl">
                  {t('certificationCommitment')}
                </p>
              </div>

              {/* b. Steps accordion */}
              <div>
                <Steps steps={certSteps} />
              </div>

              {/* c. At a Glance */}
              <div className="bg-ada-off-white rounded-2xl p-6">
                <h3 className="font-dm-serif text-xl text-ada-navy mb-5">
                  {t('atAGlance')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {glanceItems.map((item) => (
                    <div key={item.label}>
                      <span className="text-xs text-ada-navy/40 uppercase tracking-wider font-outfit block mb-1">
                        {item.label}
                      </span>
                      <span className="font-outfit font-semibold text-ada-navy">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* d. What's Included */}
              <div>
                <h3 className="font-dm-serif text-2xl text-ada-navy mb-6">
                  {t('whatsIncludedInCertification')}
                </h3>
                <ul className="space-y-3">
                  {certBenefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-3 text-ada-navy/70 text-sm leading-relaxed"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-ada-purple shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* e. FAQ */}
              <div>
                <h3 className="font-dm-serif text-2xl text-ada-navy mb-6">
                  {t('frequentlyAskedQuestions')}
                </h3>
                <Accordion items={faqItems} />
              </div>

              {/* f. CTA block */}
              <div className="bg-ada-off-white rounded-2xl p-10 text-center">
                <h3 className="font-dm-serif text-2xl text-ada-navy">
                  {t('readyToGetStarted')}
                </h3>
                <p className="mt-3 text-ada-navy/60 leading-relaxed">
                  {t('findTrainingProgramDescription')}
                </p>
                <Link
                  href="/certifications/postpartum-doula/training"
                  className="mt-6 inline-flex items-center rounded-full bg-ada-purple text-white px-4 py-2.5 text-sm font-medium hover:bg-ada-purple-hover transition-colors"
                >
                  {t('findTrainingProgram')} &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactForm />
    </>
  );
}

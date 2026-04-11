import { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/public/contact-form';
import { SidebarNav } from '@/components/public/sidebar-nav';
import { courseJsonLd, breadcrumbJsonLd } from '@/lib/json-ld';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Postpartum Doula Certification | Asian Doula Alliance',
  description:
    'The gold standard in culturally integrated postpartum care — recognized by 6 major insurance providers. Learn about ADA Postpartum Doula Certification.',
};

const sidebarLinks = [
  { label: 'sidebarStepsToCertification', href: '/certifications/postpartum-doula/steps' },
  { label: 'sidebarFindATraining', href: '/certifications/postpartum-doula/training' },
  { label: 'sidebarExamDetails', href: '/certifications/postpartum-doula/exam' },
];

const sidebarExtraLinks = [
  { label: 'sidebarRenew', href: '/for-doulas/renew' },
  { label: 'sidebarCodeOfConduct', href: '/for-doulas/code-of-conduct' },
];

const learningItems = [
  'Evidence-based postpartum recovery support',
  'Newborn care (feeding, bathing, sleep safety)',
  'Breastfeeding fundamentals and support techniques',
  'Cultural competency across Asian traditions',
  'Family dynamics and communication',
  'Professional ethics and boundaries',
];

const insurancePartners = [
  'Medi-Cal',
  'Kaiser',
  'Cigna',
  'IEHP',
  'Carrot Fertility',
  'Progyny',
];

export default async function PostpartumDoulaPage() {
  const t = await getTranslations('certPostpartum');
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: t('sidebarStepsToCertification'), path: '/certifications' },
              { name: 'Postpartum Doula', path: '/certifications/postpartum-doula' },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            courseJsonLd({
              name: 'ADA Postpartum Doula Certification',
              description: t('heroDescription'),
            })
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
            {t('heroSubtitle')}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            {t('heroDescription')}
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
                  {t('sidebarStepsToCertification')}
                </span>
                <SidebarNav items={sidebarLinks} />
                <div className="my-4 border-t border-gray-200" />
                <nav className="flex flex-col">
                  {sidebarExtraLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block py-1.5 text-sm text-ada-navy/60 hover:text-ada-purple transition-colors"
                    >
                      {t(link.label)}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main column */}
            <div className="lg:w-4/5 space-y-16">
              {/* a. Intro */}
              <div>
                <p className="text-ada-navy/60 leading-relaxed max-w-3xl text-lg">
                  {t('introDescription')}
                </p>
              </div>

              {/* b. At a Glance */}
              <div className="bg-ada-off-white rounded-2xl p-8">
                <h3 className="font-dm-serif text-xl text-ada-navy mb-6">{t('atAGlanceTitle')}</h3>
                <div className="grid grid-cols-3 gap-y-8 gap-x-6">
                  <div className="border-l-2 border-ada-purple/20 pl-4">
                    <span className="text-xs text-ada-navy/40 uppercase tracking-wider font-outfit block mb-1">{t('examFeeLabel')}</span>
                    <span className="font-outfit font-semibold text-ada-navy">{t('examFeeValue')}</span>
                  </div>
                  <div className="border-l-2 border-ada-purple/20 pl-4">
                    <span className="text-xs text-ada-navy/40 uppercase tracking-wider font-outfit block mb-1">{t('retakeFeeLabel')}</span>
                    <span className="font-outfit font-semibold text-ada-navy">{t('retakeFeeValue')}</span>
                  </div>
                  <div className="border-l-2 border-ada-purple/20 pl-4">
                    <span className="text-xs text-ada-navy/40 uppercase tracking-wider font-outfit block mb-1">{t('renewalFeeLabel')}</span>
                    <span className="font-outfit font-semibold text-ada-navy">{t('renewalFeeValue')}</span>
                  </div>
                  <div className="border-l-2 border-ada-purple/20 pl-4">
                    <span className="text-xs text-ada-navy/40 uppercase tracking-wider font-outfit block mb-1">{t('examFormatLabel')}</span>
                    <span className="font-outfit font-semibold text-ada-navy">{t('examFormatValue')}</span>
                  </div>
                  <div className="border-l-2 border-ada-purple/20 pl-4">
                    <span className="text-xs text-ada-navy/40 uppercase tracking-wider font-outfit block mb-1">{t('languagesLabel')}</span>
                    <span className="font-outfit font-semibold text-ada-navy">{t('languagesValue')}</span>
                  </div>
                  <div className="border-l-2 border-ada-purple/20 pl-4">
                    <span className="text-xs text-ada-navy/40 uppercase tracking-wider font-outfit block mb-1">{t('certificateLabel')}</span>
                    <span className="font-outfit font-semibold text-ada-navy">{t('certificateValue')}</span>
                  </div>
                </div>
              </div>

              {/* c. What You'll Learn */}
              <div>
                <h3 className="font-dm-serif text-2xl text-ada-navy mb-6">
                  {t('whatYoullLearnTitle')}
                </h3>
                <ul className="space-y-3">
                  {learningItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-ada-navy/70 text-sm leading-relaxed"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-ada-purple shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* d. Insurance Recognition */}
              <div>
                <h3 className="font-dm-serif text-2xl text-ada-navy mb-4">
                  {t('insuranceRecognitionTitle')}
                </h3>
                <p className="text-ada-navy/60 leading-relaxed mb-4">
                  {t('insuranceRecognitionDescription')}
                </p>
                <ul className="space-y-2">
                  {insurancePartners.map((partner) => (
                    <li
                      key={partner}
                      className="flex items-start gap-3 text-ada-navy/70 text-sm leading-relaxed"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-ada-purple shrink-0" />
                      {partner}
                    </li>
                  ))}
                </ul>
              </div>

              {/* e. 3 Steps */}
              <div>
                <h3 className="font-dm-serif text-2xl text-ada-navy mb-6">
                  {t('stepsToCertificationTitle')}
                </h3>
                <ol className="space-y-4">
                  <li className="flex items-start gap-4">
                    <span className="font-dm-serif text-2xl text-ada-purple shrink-0">1.</span>
                    <span className="text-ada-navy/70 leading-relaxed pt-1">
                      {t('step1')}
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="font-dm-serif text-2xl text-ada-purple shrink-0">2.</span>
                    <span className="text-ada-navy/70 leading-relaxed pt-1">
                      {t('step2')}
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="font-dm-serif text-2xl text-ada-purple shrink-0">3.</span>
                    <span className="text-ada-navy/70 leading-relaxed pt-1">
                      {t('step3')}
                    </span>
                  </li>
                </ol>
                <Link
                  href="/certifications/postpartum-doula/steps"
                  className="mt-4 inline-block text-sm text-ada-purple hover:text-ada-purple-hover transition-colors"
                >
                  {t('seeDetailedSteps')}
                </Link>
              </div>

              {/* f. CTA */}
              <div className="bg-ada-off-white rounded-2xl p-10 text-center">
                <h3 className="font-dm-serif text-2xl text-ada-navy">{t('ctaTitle')}</h3>
                <p className="mt-3 text-ada-navy/60 leading-relaxed">
                  {t('ctaDescription')}
                </p>
                <Link
                  href="/certifications/postpartum-doula/training"
                  className="mt-6 inline-flex items-center rounded-full bg-ada-purple text-white px-4 py-2.5 text-sm font-medium hover:bg-ada-purple-hover transition-colors"
                >
                  {t('ctaButton')}
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

import { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { ContactForm } from '@/components/public/contact-form';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Code of Conduct | Asian Doula Alliance',
  description:
    'ADA Code of Conduct for certified doulas. Professional standards, client care principles, and ethical guidelines.',
};

export default async function CodeOfConductPage() {
  const t = await getTranslations('codeOfConduct');

  const professionalStandards = [
    {
      title: t('professionalStandardsTitle'),
      description: t('maintainProfessionalCompetency'),
    },
    {
      title: t('practiceWithinYourScope'),
      description: t('practiceWithinYourScopeDescription'),
    },
    {
      title: t('maintainCertifications'),
      description: t('maintainCertificationsDescription'),
    },
    {
      title: t('professionalCommunication'),
      description: t('professionalCommunicationDescription'),
    },
  ];

  const clientCarePrinciples = [
    {
      title: t('clientCenteredCare'),
      description: t('clientCenteredCareDescription'),
    },
    {
      title: t('informedConsent'),
      description: t('informedConsentDescription'),
    },
    {
      title: t('confidentiality'),
      description: t('confidentialityDescription'),
    },
    {
      title: t('nonDiscrimination'),
      description: t('nonDiscriminationDescription'),
    },
    {
      title: t('culturalSensitivity'),
      description: t('culturalSensitivityDescription'),
    },
  ];

  const ethicalGuidelines = [
    {
      title: t('integrityAndHonesty'),
      description: t('integrityAndHonestyDescription'),
    },
    {
      title: t('conflictOfInterest'),
      description: t('conflictOfInterestDescription'),
    },
    {
      title: t('professionalBoundaries'),
      description: t('professionalBoundariesDescription'),
    },
    {
      title: t('reportingObligations'),
      description: t('reportingObligationsDescription'),
    },
    {
      title: t('accountability'),
      description: t('accountabilityDescription'),
    },
  ];

  const sidebarLinks = [
    { label: t('postpartumDoula'), href: '/certifications/postpartum-doula' },
    { label: t('birthDoula'), href: '/certifications/birth-doula' },
    { label: t('ibclcPrep'), href: '/certifications/ibclc' },
    { label: t('renewRecertification'), href: '/for-doulas/renew' },
  ];

  return (
    <> 
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: t('forDoulas'), path: '/for-doulas' },
              { name: t('codeOfConduct'), path: '/for-doulas/code-of-conduct' },
            ])
          ),
        }}
      />
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            {t('forDoulas')}
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            {t('heroTitle')}
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
              {/* Intro */}
              <p className="text-ada-navy/70 text-lg leading-relaxed">
                {t('introText')}
              </p>

              {/* Professional Standards */}
              <div>
                <h2 className="font-dm-serif text-3xl text-ada-navy mb-8">
                  {t('professionalStandardsTitle')}
                </h2>
                <div className="space-y-8">
                  {professionalStandards.map((item) => (
                    <div key={item.title}>
                      <h3 className="font-outfit font-semibold text-ada-navy">{item.title}</h3>
                      <p className="mt-2 text-ada-navy/60 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Care Principles */}
              <div>
                <h2 className="font-dm-serif text-3xl text-ada-navy mb-8">
                  {t('clientCarePrinciplesTitle')}
                </h2>
                <div className="space-y-8">
                  {clientCarePrinciples.map((item) => (
                    <div key={item.title}>
                      <h3 className="font-outfit font-semibold text-ada-navy">{item.title}</h3>
                      <p className="mt-2 text-ada-navy/60 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ethical Guidelines */}
              <div>
                <h2 className="font-dm-serif text-3xl text-ada-navy mb-8">
                  {t('ethicalGuidelinesTitle')}
                </h2>
                <div className="space-y-8">
                  {ethicalGuidelines.map((item) => (
                    <div key={item.title}>
                      <h3 className="font-outfit font-semibold text-ada-navy">{item.title}</h3>
                      <p className="mt-2 text-ada-navy/60 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enforcement */}
              <blockquote className="border-l-[5px] border-ada-purple bg-ada-off-white p-6 pl-8 rounded-r-lg">
                <h3 className="font-outfit font-semibold text-ada-navy mb-2">{t('enforcementTitle')}</h3>
                <p className="text-ada-navy/60 leading-relaxed">
                  {t('enforcementDescription')}
                </p>
              </blockquote>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/5">
              <div className="sticky top-32">
                <span className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-navy/40">
                  {t('forDoulas')}
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

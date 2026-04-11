import { Metadata } from 'next';
import Link from 'next/link';
import { Accordion } from '@/components/public/accordion';
import { ContactForm } from '@/components/public/contact-form';
import { courseJsonLd, breadcrumbJsonLd } from '@/lib/json-ld';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Birth Doula Certification (Coming Soon) | Asian Doula Alliance',
  description:
    'ADA is developing a Birth Doula Certification program — culturally integrated training and certification for labor and delivery support. Sign up to be notified when enrollment opens.',
};

export default async function BirthDoulaCertificationPage() {
  const t = await getTranslations('certBirth');

  const certDetails = [
    { label: t('format'), value: t('writtenPracticalExam') },
    { label: t('languages'), value: t('englishChineseJapaneseKorean') },
    { label: t('validity'), value: t('oneYear') },
    { label: t('prerequisites'), value: t('noPriorExperience') },
  ];

  const trainingTopics = [
    t('stagesOfLabor'),
    t('comfortMeasures'),
    t('breathingTechniques'),
    t('partnerFamilyInvolvement'),
    t('culturalBirthingTraditions'),
    t('immediatePostpartumSupport'),
    t('communicationWithMedicalTeams'),
    t('emergencyAwareness'),
  ];

  const faqItems = [
    {
      question: t('whenWillProgramLaunch'),
      answer:
        t('curriculumDevelopment'),
    },
    {
      question: t('availableInMultipleLanguages'),
      answer:
        t('yesMultipleLanguages'),
    },
    {
      question: t('needToBePostpartumDoula'),
      answer:
        t('noIndependentTrack'),
    },
    {
      question: t('howMuchWillItCost'),
      answer:
        t('pricingNotFinalized'),
    },
  ];

  const sidebarLinks = [
    { label: t('postpartumDoula'), href: '/certifications/postpartum-doula' },
    { label: t('ibclcExamPrep'), href: '/certifications/ibclc' },
  ];

  return (
    <>  
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: t('certifications'), path: '/certifications' },
              { name: t('birthDoula'), path: '/certifications/birth-doula' },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            courseJsonLd({
              name: t('adaBirthDoulaCertification'),
              description: t('culturallyIntegratedTraining'),
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
            {t('heroTitle')}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>
          <span className="bg-ada-purple/10 text-ada-purple text-sm font-medium px-4 py-1.5 rounded-full inline-block mt-4">
            {t('comingSoon')}
          </span>
        </div>
      </section>

      {/* Main Content + Sidebar */}
      <section className="bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-16">
            {/* Main Content */}
            <div className="lg:w-4/5 space-y-16">
              {/* What is a Birth Doula? */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-6">
                  {t('whatIsBirthDoula')}
                </h2>
                <p className="text-ada-navy/60 leading-relaxed">
                  {t('birthDoulaDescription')}
                </p>
                <p className="text-ada-navy/60 leading-relaxed mt-4">
                  {t('adaBirthDoulaCertification')}
                </p>
              </div>

              {/* What the Training Will Cover */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-8">
                  {t('whatTrainingWillCover')}
                </h2>
                <ul className="space-y-3">
                  {trainingTopics.map((topic) => (
                    <li key={topic} className="flex items-start gap-3 text-ada-navy/60">
                      <span className="text-ada-purple mt-0.5">&#x2022;</span>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Planned Certification Details */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-8">
                  {t('plannedCertificationDetails')}
                </h2>
                <div className="bg-ada-off-white rounded-2xl p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {certDetails.map((detail) => (
                      <div key={detail.label}>
                        <p className="text-sm text-ada-navy/60 mb-1">{detail.label}</p>
                        <p className="font-outfit font-semibold text-ada-navy">
                          {detail.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* How It Differs from Postpartum Doula */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-8">
                  {t('howItDiffersFromPostpartumDoula')}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-ada-off-white rounded-xl p-6">
                    <h3 className="font-outfit font-semibold text-ada-navy mb-3">
                      {t('birthDoula')}
                    </h3>
                    <ul className="space-y-2 text-ada-navy/60 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        {t('supportsDuringLabor')}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        {t('presentInHospital')}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        {t('focusComfortAdvocacy')}
                      </li>
                    </ul>
                  </div>
                  <div className="bg-ada-off-white rounded-xl p-6">
                    <h3 className="font-outfit font-semibold text-ada-navy mb-3">
                      {t('postpartumDoula')}
                    </h3>
                    <ul className="space-y-2 text-ada-navy/60 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        {t('supportsAfterDelivery')}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        {t('presentInFamilyHome')}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        {t('focusRecovery')}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Get Notified */}
              <div className="bg-ada-purple/5 border border-ada-purple/20 rounded-2xl p-8 text-center">
                <h2 className="font-dm-serif text-2xl md:text-3xl text-ada-navy mb-3">
                  {t('beTheFirstToKnow')}
                </h2>
                <p className="text-ada-navy/60 mb-6">
                  {t('signUpForUpdates')}
                </p>
                <a
                  href="mailto:contact@asiandoula.org?subject=Birth%20Doula%20Certification%20-%20Interest"
                  className="inline-block font-outfit font-medium text-white bg-ada-purple hover:bg-ada-purple-hover px-8 py-3 rounded-full transition-colors"
                >
                  {t('notifyMeWhenAvailable')} &rarr;
                </a>
              </div>

              {/* FAQ */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-8">
                  {t('frequentlyAskedQuestions')}
                </h2>
                <Accordion items={faqItems} />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/5">
              <div className="lg:sticky lg:top-32">
                <p className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-purple mb-4">
                  {t('certifications')}
                </p>
                <nav className="space-y-2">
                  {sidebarLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block font-outfit text-sm text-ada-navy/60 hover:text-ada-navy transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-200 my-3" />
                  <Link
                    href="/certifications"
                    className="block font-outfit text-sm text-ada-navy/60 hover:text-ada-navy transition-colors"
                  >
                    {t('allCertifications')}
                  </Link>
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

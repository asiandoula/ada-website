import { Metadata } from 'next';
import Link from 'next/link';
import { Accordion } from '@/components/public/accordion';
import { ContactForm } from '@/components/public/contact-form';
import { courseJsonLd, breadcrumbJsonLd } from '@/lib/json-ld';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'IBCLC Exam Prep (Coming Soon) | Asian Doula Alliance',
  description:
    'ADA is developing a multilingual IBCLC Exam Prep course — lactation-specific education hours to prepare for the International Board Certified Lactation Consultant exam.',
};

export default async function IBCLCExamPrepPage() {
  const t = await getTranslations('certIbclc');

  const whyAdaItems = [
    {
      title: t('multilingualInstruction'),
      description: t('multilingualInstructionDescription'),
    },
    {
      title: t('culturallyIntegratedContent'),
      description: t('culturallyIntegratedContentDescription'),
    },
    {
      title: t('examFocusedCurriculum'),
      description: t('examFocusedCurriculumDescription'),
    },
    {
      title: t('flexibleLearning'),
      description: t('flexibleLearningDescription'),
    },
  ];

  const courseTopics = [
    t('breastAnatomyAndPhysiology'),
    t('infantOralAnatomyAndSucklingMechanics'),
    t('breastfeedingManagementAcrossTheFirstYear'),
    t('commonChallengesLowSupplyEngorgementMastitisTongueTie'),
    t('pharmacologyAndBreastfeedingCompatibility'),
    t('specialCircumstancesPretermInfantsMultiplesNICU'),
    t('culturalConsiderationsInLactationSupport'),
    t('ibclcExamStrategiesAndPracticeQuestions'),
  ];

  const faqItems = [
    {
      question: t('whatIsIbclcQuestion'),
      answer: t('ibclcDescription'),
    },
    {
      question: t('doesAdaIssueIbclcCredential'),
      answer: t('doesAdaIssueIbclcCredentialAnswer'),
    },
    {
      question: t('doINeedToBeAdaCertifiedDoula'),
      answer: t('doINeedToBeAdaCertifiedDoulaAnswer'),
    },
    {
      question: t('whenWillTheCourseLaunch'),
      answer: t('whenWillTheCourseLaunchAnswer'),
    },
    {
      question: t('howMuchWillItCost'),
      answer: t('howMuchWillItCostAnswer'),
    },
  ];

  const sidebarLinks = [
    { label: t('postpartumDoula'), href: '/certifications/postpartum-doula' },
    { label: t('birthDoula'), href: '/certifications/birth-doula' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: t('certifications'), path: '/certifications' },
              { name: t('ibclcExamPrep'), path: '/certifications/ibclc' },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            courseJsonLd({
              name: t('adaIbclcExamPrep'),
              description: t('multilingualIbclcExamPreparationWithCulturallyIntegratedLactationEducation'),
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
              {/* What is IBCLC? */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-6">
                  {t('whatIsIbclc')}
                </h2>
                <p className="text-ada-navy/60 leading-relaxed">
                  {t('ibclcDescription')}
                </p>
                <p className="text-ada-navy/60 leading-relaxed mt-4">
                  {t('ibclcCourseDescription')}
                </p>
              </div>

              {/* Why ADA's IBCLC Prep? */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-8">
                  {t('whyAdaIbclcPrep')}
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {whyAdaItems.map((item) => (
                    <div key={item.title}>
                      <h3 className="font-outfit font-semibold text-ada-navy mb-2">
                        {item.title}
                      </h3>
                      <p className="text-ada-navy/60 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* IBCLC Requirements Overview */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-8">
                  {t('examRequirementsOverview')}
                </h2>
                <div className="border-l-4 border-ada-purple pl-6 py-2">
                  <p className="text-ada-navy/60 leading-relaxed">
                    {t('examRequirementsDescription')}
                  </p>
                </div>
              </div>

              {/* Course Content Preview */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-8">
                  {t('courseContentPreview')}
                </h2>
                <ul className="space-y-3">
                  {courseTopics.map((topic) => (
                    <li key={topic} className="flex items-start gap-3 text-ada-navy/60">
                      <span className="text-ada-purple mt-0.5">&#x2022;</span>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Get Notified */}
              <div className="bg-ada-purple/5 border border-ada-purple/20 rounded-2xl p-8 text-center">
                <h2 className="font-dm-serif text-2xl md:text-3xl text-ada-navy mb-3">
                  {t('beTheFirstToKnow')}
                </h2>
                <p className="text-ada-navy/60 mb-6">
                  {t('getNotifiedDescription')}
                </p>
                <a
                  href="mailto:contact@asiandoula.org?subject=IBCLC%20Exam%20Prep%20-%20Interest"
                  className="inline-block font-outfit font-medium text-white bg-ada-purple hover:bg-ada-purple-hover px-8 py-3 rounded-full transition-colors"
                >
                  {t('notifyMe')}
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

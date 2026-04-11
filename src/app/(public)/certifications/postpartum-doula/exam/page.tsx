import { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { Accordion } from '@/components/public/accordion';
import { ContactForm } from '@/components/public/contact-form';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: 'Exam Details | Asian Doula Alliance',
  description:
    'Learn about the ADA certification exam format, fees, languages, and frequently asked questions.',
};

export default function ExamDetailsPage() {
  const t = useTranslations('certExam');

  const examDetails = [
    { label: t('examFee'), value: t('examFeeValue') },
    { label: t('certificateValidity'), value: t('certificateValidityValue') },
    { label: t('retakeFee'), value: t('retakeFeeValue') },
    { label: t('examIdFormat'), value: t('examIdFormatValue') },
    { label: t('languages'), value: t('languagesValue') },
  ];

  const faqItems = [
    {
      question: t('faqWrittenExam'),
      answer: t('faqWrittenExamAnswer'),
    },
    {
      question: t('faqPracticalExam'),
      answer: t('faqPracticalExamAnswer'),
    },
    {
      question: t('faqNativeLanguage'),
      answer: t('faqNativeLanguageAnswer'),
    },
    {
      question: t('faqFailExam'),
      answer: t('faqFailExamAnswer'),
    },
    {
      question: t('faqRegisterExam'),
      answer: t('faqRegisterExamAnswer'),
    },
    {
      question: t('faqExamLocation'),
      answer: t('faqExamLocationAnswer'),
    },
    {
      question: t('faqCertificationTime'),
      answer: t('faqCertificationTimeAnswer'),
    },
  ];

  const sidebarLinks = [
    { label: t('stepsToCertification'), href: '/certifications/postpartum-doula/steps' },
    { label: 'Find a Training', href: '/certifications/postpartum-doula/training' },
    { label: 'Renew / Recertification', href: '/for-doulas/renew' },
    { label: 'Code of Conduct', href: '/for-doulas/code-of-conduct' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Certifications', path: '/certifications' },
              { name: 'Postpartum Doula', path: '/certifications/postpartum-doula' },
              { name: t('examDetailsTitle'), path: '/certifications/postpartum-doula/exam' },
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
            {t('examDetailsTitle')}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            {t('examOverviewDescription')}
          </p>
        </div>
      </section>

      {/* Main Content + Sidebar */}
      <section className="bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-16">
            {/* Main Content */}
            <div className="lg:w-4/5 space-y-16">
              {/* Exam Overview */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-6">
                  {t('examOverviewTitle')}
                </h2>
                <p className="text-ada-navy/60 leading-relaxed">
                  {t('examOverviewDescription')}
                </p>
              </div>

              {/* Exam Details Grid */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-8">
                  {t('examDetailsTitle')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {examDetails.map((detail) => (
                    <div
                      key={detail.label}
                      className="bg-ada-off-white rounded-xl p-5"
                    >
                      <p className="text-sm text-ada-navy/60 mb-1">{detail.label}</p>
                      <p className="font-outfit font-semibold text-ada-navy">
                        {detail.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* What to Expect */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-8">
                  {t('whatToExpectTitle')}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-ada-off-white rounded-xl">
                    <h3 className="font-outfit font-semibold text-ada-navy mb-3">
                      {t('writtenExam')}
                    </h3>
                    <ul className="space-y-2 text-ada-navy/60 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        {t('examDuration')}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        {t('examFormat')}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        {t('examContent')}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        {t('examLanguages')}
                      </li>
                    </ul>
                  </div>
                  <div className="p-6 bg-ada-off-white rounded-xl">
                    <h3 className="font-outfit font-semibold text-ada-navy mb-3">
                      {t('practicalExam')}
                    </h3>
                    <ul className="space-y-2 text-ada-navy/60 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        {t('practicalExamDuration')}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        {t('practicalExamSkills')}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        {t('practicalExamAssessor')}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        {t('practicalExamEvaluation')}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-8">
                  {t('frequentlyAskedQuestionsTitle')}
                </h2>
                <Accordion items={faqItems} />
              </div>

              {/* CTA */}
              <div className="bg-ada-off-white rounded-xl p-8 text-center">
                <p className="font-outfit text-lg text-ada-navy mb-4">
                  {t('readyToTakeExam')}
                </p>
                <Link
                  href="/certifications/postpartum-doula/steps"
                  className="inline-block font-outfit font-medium text-white bg-ada-purple hover:bg-ada-purple-hover px-8 py-3 rounded-full transition-colors"
                >
                  {t('stepsToCertification')}
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/5">
              <div className="lg:sticky lg:top-32">
                <p className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-purple mb-4">
                  {t('heroTitle')}
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

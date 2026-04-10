import { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { Accordion } from '@/components/public/accordion';
import { ContactForm } from '@/components/public/contact-form';

export const metadata: Metadata = {
  title: 'Exam Details | Asian Doula Alliance',
  description:
    'Learn about the ADA certification exam format, fees, languages, and frequently asked questions.',
};

const examDetails = [
  { label: 'Written Exam', value: '60 minutes' },
  { label: 'Practical Exam', value: '30 minutes (one-on-one)' },
  { label: 'Exam Fee', value: '$625' },
  { label: 'Languages', value: 'English, Chinese, Japanese, Korean' },
  { label: 'Certificate Validity', value: '1 year' },
  { label: 'Retake Fee', value: '$325' },
  { label: 'Exam ID Format', value: 'YY-NNNNN (e.g., 25-80301)' },
];

const faqItems = [
  {
    question: 'What does the written exam cover?',
    answer:
      'The written exam covers postpartum care fundamentals, newborn care, breastfeeding support, cultural competency, safety protocols, and client communication. Questions are a mix of multiple choice and short answer, designed to assess your knowledge of evidence-based postpartum care practices.',
  },
  {
    question: 'What happens during the practical exam?',
    answer:
      'The practical exam is a 30-minute one-on-one evaluation with a certified examiner. You will demonstrate hands-on skills including newborn handling, swaddling, bathing techniques, postpartum recovery support, and your ability to communicate effectively with families from diverse cultural backgrounds.',
  },
  {
    question: 'Can I take the exam in my native language?',
    answer:
      'Yes. ADA offers the certification exam in English, Chinese (Mandarin), Japanese, and Korean. Please specify your preferred language when registering for the exam. All exam materials, including instructions and questions, will be provided in your chosen language.',
  },
  {
    question: 'What if I fail the exam?',
    answer:
      'If you do not pass on your first attempt, you may retake the exam for a fee of $325. You must wait at least 30 days before retaking the exam. We recommend reviewing the areas identified for improvement and consulting with your training program before reattempting.',
  },
  {
    question: 'How do I register for the exam?',
    answer:
      'After completing an ADA-approved training program, your training provider will guide you through the exam registration process. You can also contact ADA directly at contact@asiandoula.org or call (714) 202-6501 to register.',
  },
  {
    question: 'Where is the exam held?',
    answer:
      'Exams are administered at the ADA training center located at 7515 Irvine Center Drive, #110, Irvine, CA 92618. Additional exam locations may be available depending on demand. Contact us for the latest schedule.',
  },
  {
    question: 'How long does it take to receive my certification?',
    answer:
      'Results are typically communicated within 2 weeks of your exam date. Once you pass, your ADA certification and exam ID will be issued and you can begin practicing as a certified doula.',
  },
];

const sidebarLinks = [
  { label: 'Steps to Certification', href: '/certifications/postpartum-doula/steps' },
  { label: 'Find a Training', href: '/certifications/postpartum-doula/training' },
  { label: 'Renew / Recertification', href: '/for-doulas/renew' },
  { label: 'Code of Conduct', href: '/for-doulas/code-of-conduct' },
];

export default function ExamDetailsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Certifications', path: '/certifications' },
              { name: 'Postpartum Doula', path: '/certifications/postpartum-doula' },
              { name: 'Exam Details', path: '/certifications/postpartum-doula/exam' },
            ])
          ),
        }}
      />
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            Postpartum Doula Certification
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            Exam Details
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about the ADA Certification Examination.
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
                  Exam Overview
                </h2>
                <p className="text-ada-navy/60 leading-relaxed">
                  The ADA Certification Examination evaluates your readiness to provide
                  professional postpartum doula care. The exam consists of a written portion
                  and a practical evaluation, both designed to assess your knowledge of
                  evidence-based practices and hands-on competency. Candidates who pass
                  receive an ADA certification valid for one year.
                </p>
              </div>

              {/* Exam Details Grid */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-8">
                  Exam Details
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
                  What to Expect
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-ada-off-white rounded-xl">
                    <h3 className="font-outfit font-semibold text-ada-navy mb-3">
                      Written Exam
                    </h3>
                    <ul className="space-y-2 text-ada-navy/60 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        60-minute timed examination
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        Multiple choice and short answer questions
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        Covers postpartum care, newborn care, and cultural competency
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        Available in 4 languages
                      </li>
                    </ul>
                  </div>
                  <div className="p-6 bg-ada-off-white rounded-xl">
                    <h3 className="font-outfit font-semibold text-ada-navy mb-3">
                      Practical Exam
                    </h3>
                    <ul className="space-y-2 text-ada-navy/60 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        30-minute one-on-one evaluation
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        Hands-on demonstration of doula skills
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        Assessed by a certified ADA examiner
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        Evaluates practical competency and communication
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-8">
                  Frequently Asked Questions
                </h2>
                <Accordion items={faqItems} />
              </div>

              {/* CTA */}
              <div className="bg-ada-off-white rounded-xl p-8 text-center">
                <p className="font-outfit text-lg text-ada-navy mb-4">
                  Ready to take the exam? Start with Step 1.
                </p>
                <Link
                  href="/certifications/postpartum-doula/steps"
                  className="inline-block font-outfit font-medium text-white bg-ada-purple hover:bg-ada-purple-hover px-8 py-3 rounded-full transition-colors"
                >
                  Steps to Certification
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/5">
              <div className="lg:sticky lg:top-32">
                <p className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-purple mb-4">
                  Postpartum Doula Certification
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

import { Metadata } from 'next';
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

const certSteps = [
  {
    number: '1',
    title: 'Enroll in an ADA-Approved Training Program',
    description:
      'Find and enroll in an ADA-approved postpartum doula training program. Our approved programs cover essential skills including newborn care, postpartum recovery support, breastfeeding basics, cultural competency, and family dynamics. Training programs are available in multiple languages including English, Chinese, Japanese, and Korean.',
  },
  {
    number: '2',
    title: 'Complete the Training',
    description:
      'Successfully complete all required coursework and hands-on training hours. Training typically includes classroom instruction, practical demonstrations, and supervised practice sessions. You will learn evidence-based techniques for supporting new families during the critical postpartum period.',
  },
  {
    number: '3',
    title: 'Pass the Certification Examination',
    description:
      'Register for and pass the ADA Certification Examination. The exam consists of a 60-minute written test and a 30-minute practical evaluation conducted one-on-one with an examiner. The exam fee is $625 and is available in English, Chinese, Japanese, and Korean. Upon passing, you will receive your ADA certification, valid for 3 years.',
  },
];

const faqItems = [
  {
    question: 'How long does the certification process take?',
    answer:
      'From enrollment to certification, most doulas complete the process in 2-4 weeks. Training programs typically run 4-5 days of intensive instruction, followed by the certification exam.',
  },
  {
    question: 'Do I need prior experience?',
    answer:
      'No prior doula experience is required. ADA-approved training programs are designed to take you from beginner to exam-ready. However, a genuine passion for supporting new families is essential.',
  },
  {
    question: "What if I don't speak English?",
    answer:
      'ADA offers training and exams in English, Chinese (Mandarin), Japanese, and Korean. You can complete the entire certification process in your preferred language.',
  },
  {
    question: 'How much does it cost in total?',
    answer:
      'The exam fee is $625. Training program fees vary by provider \u2014 contact your chosen program for pricing. Some scholarship funding may be available.',
  },
  {
    question: 'What happens after I pass?',
    answer:
      "You'll receive your ADA certification (valid for 3 years), a unique exam ID, and immediate listing in our verified doula registry. Insurance providers can verify your certification through our system.",
  },
];

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
  { label: 'Certificate Validity', value: '3 years' },
];

const certBenefits = [
  'Official ADA certification certificate with unique exam ID',
  'Listing in the ADA Certified Doula Registry (publicly verifiable)',
  'Recognition by major insurance providers (Medi-Cal, Kaiser, Cigna, IEHP, Carrot Fertility, Progyny)',
  'Access to continuing education resources',
  'Membership in the ADA professional community',
  'Right to use the "ADA Certified" designation',
];

export default function StepsToCertificationPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            Postpartum Doula Certification
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            Steps to Certification
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            Three steps to becoming an ADA-certified postpartum doula.
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
                  Postpartum Doula Certification
                </span>
                <SidebarNav items={sidebarLinks} />
              </div>
            </aside>

            {/* Main column */}
            <div className="lg:w-4/5 space-y-16">
              {/* a. Heading + intro */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                  Your Path to Certification
                </h2>
                <p className="mt-4 text-ada-navy/60 leading-relaxed max-w-3xl">
                  The ADA certification demonstrates your commitment to providing
                  culturally sensitive, evidence-based postpartum care. Here&apos;s how
                  to earn your credential.
                </p>
              </div>

              {/* b. Steps accordion */}
              <div>
                <Steps steps={certSteps} />
              </div>

              {/* c. At a Glance */}
              <div className="bg-ada-off-white rounded-2xl p-6">
                <h3 className="font-dm-serif text-xl text-ada-navy mb-5">
                  At a Glance
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
                  What&apos;s Included in ADA Certification
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
                  Frequently Asked Questions
                </h3>
                <Accordion items={faqItems} />
              </div>

              {/* f. CTA block */}
              <div className="bg-ada-off-white rounded-2xl p-10 text-center">
                <h3 className="font-dm-serif text-2xl text-ada-navy">
                  Ready to Get Started?
                </h3>
                <p className="mt-3 text-ada-navy/60 leading-relaxed">
                  Find an ADA-approved training program and begin your journey.
                </p>
                <Link
                  href="/certifications/postpartum-doula/training"
                  className="mt-6 inline-flex items-center rounded-full bg-ada-purple text-white px-4 py-2.5 text-sm font-medium hover:bg-ada-purple-hover transition-colors"
                >
                  Find a Training Program &rarr;
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

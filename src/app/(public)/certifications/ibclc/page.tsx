import { Metadata } from 'next';
import Link from 'next/link';
import { Accordion } from '@/components/public/accordion';
import { ContactForm } from '@/components/public/contact-form';
import { courseJsonLd, breadcrumbJsonLd } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'IBCLC Exam Prep (Coming Soon) | Asian Doula Alliance',
  description:
    'ADA is developing a multilingual IBCLC Exam Prep course — lactation-specific education hours to prepare for the International Board Certified Lactation Consultant exam.',
};

const whyAdaItems = [
  {
    title: 'Multilingual Instruction',
    description:
      'Study in English, Chinese, Japanese, or Korean. No other IBCLC prep program offers this breadth of language support.',
  },
  {
    title: 'Culturally Integrated Content',
    description:
      'Our curriculum addresses breastfeeding beliefs, practices, and challenges specific to Asian cultures — from traditional confinement diet impacts on milk supply to family dynamics around breastfeeding decisions.',
  },
  {
    title: 'Exam-Focused Curriculum',
    description:
      'Covers all IBLCE content areas including anatomy, physiology, pharmacology, pathology, and clinical skills — structured specifically to prepare you for the IBCLC exam.',
  },
  {
    title: 'Flexible Learning',
    description:
      'Designed for working doulas and healthcare professionals. Combines self-paced study with live instruction sessions.',
  },
];

const courseTopics = [
  'Breast anatomy and physiology of lactation',
  'Infant oral anatomy and suckling mechanics',
  'Breastfeeding management across the first year',
  'Common challenges: low supply, engorgement, mastitis, tongue-tie',
  'Pharmacology and breastfeeding compatibility',
  'Special circumstances: preterm infants, multiples, NICU',
  'Cultural considerations in lactation support',
  'IBCLC exam strategies and practice questions',
];

const faqItems = [
  {
    question: 'What is IBCLC?',
    answer:
      'IBCLC stands for International Board Certified Lactation Consultant. It is the highest internationally recognized credential for professionals who provide breastfeeding and lactation care.',
  },
  {
    question: 'Does ADA issue the IBCLC credential?',
    answer:
      'No. The IBCLC credential is issued by IBLCE (International Board of Lactation Consultant Examiners). ADA provides the exam preparation course that covers the lactation-specific education hours required to sit for the IBCLC exam.',
  },
  {
    question: 'Do I need to be an ADA-certified doula first?',
    answer:
      'No. The IBCLC Exam Prep course is open to anyone who meets IBLCE\u2019s eligibility requirements, including nurses, midwives, and other healthcare professionals.',
  },
  {
    question: 'When will the course launch?',
    answer:
      'We\u2019re currently developing the curriculum. Sign up for notifications to be the first to know when enrollment opens.',
  },
  {
    question: 'How much will it cost?',
    answer:
      'Course pricing has not been finalized. We\u2019ll share details when enrollment opens.',
  },
];

const sidebarLinks = [
  { label: 'Postpartum Doula', href: '/certifications/postpartum-doula' },
  { label: 'Birth Doula', href: '/certifications/birth-doula' },
];

export default function IBCLCExamPrepPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Certifications', path: '/certifications' },
              { name: 'IBCLC Exam Prep', path: '/certifications/ibclc' },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            courseJsonLd({
              name: 'ADA IBCLC Exam Prep',
              description: 'Multilingual IBCLC exam preparation with culturally integrated lactation education.',
            })
          ),
        }}
      />
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            IBCLC Exam Prep
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            IBCLC Exam Prep
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            Multilingual preparation for the International Board Certified Lactation
            Consultant exam.
          </p>
          <span className="bg-ada-purple/10 text-ada-purple text-sm font-medium px-4 py-1.5 rounded-full inline-block mt-4">
            Coming Soon
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
                  What is IBCLC?
                </h2>
                <p className="text-ada-navy/60 leading-relaxed">
                  The International Board Certified Lactation Consultant (IBCLC) is the gold
                  standard credential for lactation care professionals worldwide. Issued by the
                  International Board of Lactation Consultant Examiners (IBLCE), it requires
                  specialized education, clinical experience, and passing a rigorous exam.
                </p>
                <p className="text-ada-navy/60 leading-relaxed mt-4">
                  ADA&apos;s IBCLC Exam Prep course provides the lactation-specific education
                  hours required by IBLCE — taught in multiple languages with a focus on
                  breastfeeding practices and challenges unique to Asian families.
                </p>
              </div>

              {/* Why ADA's IBCLC Prep? */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-8">
                  Why ADA&apos;s IBCLC Prep?
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
                  IBCLC Requirements Overview
                </h2>
                <div className="border-l-4 border-ada-purple pl-6 py-2">
                  <p className="text-ada-navy/60 leading-relaxed">
                    To sit for the IBCLC exam, candidates must complete: (1) health science
                    education prerequisites, (2) lactation-specific education hours (which
                    ADA&apos;s course fulfills), and (3) supervised clinical practice hours.
                    Visit{' '}
                    <a
                      href="https://iblce.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ada-purple hover:underline"
                    >
                      iblce.org
                    </a>{' '}
                    for complete eligibility requirements.
                  </p>
                </div>
              </div>

              {/* Course Content Preview */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-8">
                  Course Content Preview
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
                  Be the First to Know
                </h2>
                <p className="text-ada-navy/60 mb-6">
                  Sign up to receive updates when the IBCLC Exam Prep course launches.
                </p>
                <a
                  href="mailto:contact@asiandoula.org?subject=IBCLC%20Exam%20Prep%20-%20Interest"
                  className="inline-block font-outfit font-medium text-white bg-ada-purple hover:bg-ada-purple-hover px-8 py-3 rounded-full transition-colors"
                >
                  Notify Me When Available &rarr;
                </a>
              </div>

              {/* FAQ */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-8">
                  Frequently Asked Questions
                </h2>
                <Accordion items={faqItems} />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/5">
              <div className="lg:sticky lg:top-32">
                <p className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-purple mb-4">
                  Certifications
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
                    All Certifications
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

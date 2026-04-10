import { Metadata } from 'next';
import Link from 'next/link';
import { Accordion } from '@/components/public/accordion';
import { ContactForm } from '@/components/public/contact-form';
import { courseJsonLd } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Birth Doula Certification (Coming Soon) | Asian Doula Alliance',
  description:
    'ADA is developing a Birth Doula Certification program — culturally integrated training and certification for labor and delivery support. Sign up to be notified when enrollment opens.',
};

const certDetails = [
  { label: 'Format', value: 'Written + Practical exam (details TBD)' },
  { label: 'Languages', value: 'English, Chinese, Japanese, Korean' },
  { label: 'Validity', value: '1 year (anticipated)' },
  { label: 'Prerequisites', value: 'No prior experience required' },
];

const trainingTopics = [
  'Stages of labor and normal birth progression',
  'Comfort measures and pain management support',
  'Breathing techniques and relaxation methods',
  'Partner and family involvement during labor',
  'Cultural birthing traditions across Asian communities',
  'Immediate postpartum and newborn bonding support',
  'Communication with medical teams',
  'Emergency awareness and scope of practice',
];

const faqItems = [
  {
    question: 'When will the Birth Doula program launch?',
    answer:
      'We\u2019re currently developing the curriculum and certification standards. Sign up for notifications to be the first to know when enrollment opens.',
  },
  {
    question: 'Will it be available in multiple languages?',
    answer:
      'Yes. Like our Postpartum Doula program, Birth Doula training and exams will be offered in English, Chinese, Japanese, and Korean.',
  },
  {
    question: 'Do I need to be a Postpartum Doula first?',
    answer:
      'No. The Birth Doula Certification is an independent track. However, holding both certifications can broaden your practice and appeal to more families.',
  },
  {
    question: 'How much will it cost?',
    answer:
      'Pricing has not been finalized. We expect it to follow a similar structure to our Postpartum Doula exam fee ($625).',
  },
];

const sidebarLinks = [
  { label: 'Postpartum Doula', href: '/certifications/postpartum-doula' },
  { label: 'IBCLC Exam Prep', href: '/certifications/ibclc' },
];

export default function BirthDoulaCertificationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            courseJsonLd({
              name: 'ADA Birth Doula Certification',
              description: 'Culturally integrated training and certification for labor and delivery support.',
            })
          ),
        }}
      />
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            Birth Doula Certification
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            Birth Doula
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            Supporting families through labor and delivery — coming soon to ADA.
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
              {/* What is a Birth Doula? */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-6">
                  What is a Birth Doula?
                </h2>
                <p className="text-ada-navy/60 leading-relaxed">
                  A birth doula provides continuous physical, emotional, and informational
                  support to families during labor and delivery. Unlike postpartum doulas who
                  focus on recovery after birth, birth doulas are present throughout the
                  birthing process — from early labor through delivery and the immediate
                  postpartum period.
                </p>
                <p className="text-ada-navy/60 leading-relaxed mt-4">
                  ADA&apos;s Birth Doula Certification will bring the same culturally
                  integrated approach that defines our postpartum program: blending traditional
                  Asian birthing practices with modern evidence-based care, delivered in the
                  family&apos;s preferred language.
                </p>
              </div>

              {/* What the Training Will Cover */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-8">
                  What the Training Will Cover
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
                  Planned Certification Details
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
                  How It Differs from Postpartum Doula
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-ada-off-white rounded-xl p-6">
                    <h3 className="font-outfit font-semibold text-ada-navy mb-3">
                      Birth Doula
                    </h3>
                    <ul className="space-y-2 text-ada-navy/60 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        Supports during labor &amp; delivery
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        Present in hospital / birth center
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        Focus: comfort, advocacy, emotional support during birth
                      </li>
                    </ul>
                  </div>
                  <div className="bg-ada-off-white rounded-xl p-6">
                    <h3 className="font-outfit font-semibold text-ada-navy mb-3">
                      Postpartum Doula
                    </h3>
                    <ul className="space-y-2 text-ada-navy/60 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        Supports after delivery
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        Present in family&apos;s home
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ada-purple mt-0.5">&#x2022;</span>
                        Focus: recovery, newborn care, family adjustment
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Get Notified */}
              <div className="bg-ada-purple/5 border border-ada-purple/20 rounded-2xl p-8 text-center">
                <h2 className="font-dm-serif text-2xl md:text-3xl text-ada-navy mb-3">
                  Be the First to Know
                </h2>
                <p className="text-ada-navy/60 mb-6">
                  Sign up to receive updates when Birth Doula enrollment opens.
                </p>
                <a
                  href="mailto:contact@asiandoula.org?subject=Birth%20Doula%20Certification%20-%20Interest"
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

import { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { ContactForm } from '@/components/public/contact-form';

export const metadata: Metadata = {
  title: 'Code of Conduct | Asian Doula Alliance',
  description:
    'ADA Code of Conduct for certified doulas. Professional standards, client care principles, and ethical guidelines.',
};

const professionalStandards = [
  {
    title: 'Maintain Professional Competency',
    description:
      'Continuously update your knowledge and skills through ongoing education and training. Stay current with evidence-based practices in postpartum care, newborn care, and breastfeeding support.',
  },
  {
    title: 'Practice Within Your Scope',
    description:
      'Provide care within the defined scope of a postpartum doula. Do not offer medical advice, diagnoses, or treatments. Refer clients to appropriate healthcare providers when medical concerns arise.',
  },
  {
    title: 'Maintain Certifications',
    description:
      'Keep your ADA certification current by meeting all renewal requirements. Display your credentials honestly and accurately. Do not misrepresent your qualifications or experience.',
  },
  {
    title: 'Professional Communication',
    description:
      'Communicate clearly, respectfully, and professionally with clients, families, healthcare providers, and fellow doulas. Respond to inquiries in a timely manner.',
  },
];

const clientCarePrinciples = [
  {
    title: 'Client-Centered Care',
    description:
      'Prioritize the needs, preferences, and well-being of the client and their family above all else. Tailor your care to each family\'s unique cultural background, values, and circumstances.',
  },
  {
    title: 'Informed Consent',
    description:
      'Ensure clients understand the services you provide, including the scope and limitations of doula care. Obtain clear consent before providing any care or support services.',
  },
  {
    title: 'Confidentiality',
    description:
      'Protect client privacy at all times. Do not share personal, medical, or family information without explicit consent. Maintain secure records and dispose of sensitive information appropriately.',
  },
  {
    title: 'Non-Discrimination',
    description:
      'Provide equitable care to all clients regardless of race, ethnicity, religion, language, sexual orientation, gender identity, socioeconomic status, or any other characteristic.',
  },
  {
    title: 'Cultural Sensitivity',
    description:
      'Respect and honor the cultural traditions, practices, and beliefs of each family you serve. Seek to understand and accommodate cultural preferences in postpartum and newborn care.',
  },
];

const ethicalGuidelines = [
  {
    title: 'Integrity and Honesty',
    description:
      'Be truthful in all professional interactions. Do not engage in deceptive practices, false advertising, or misrepresentation of your services, qualifications, or outcomes.',
  },
  {
    title: 'Conflict of Interest',
    description:
      'Avoid situations where personal interests may conflict with client welfare. Disclose any potential conflicts of interest to clients and the organization. Do not accept gifts or compensation that could influence your professional judgment.',
  },
  {
    title: 'Professional Boundaries',
    description:
      'Maintain clear professional boundaries with clients and their families. Recognize when a situation exceeds your scope of practice and make appropriate referrals.',
  },
  {
    title: 'Reporting Obligations',
    description:
      'Report any concerns about child safety or abuse according to local laws and regulations. Report any violations of this Code of Conduct to the Asian Doula Alliance.',
  },
  {
    title: 'Accountability',
    description:
      'Take responsibility for your actions and decisions. If mistakes occur, address them honestly and work to resolve any issues promptly. Cooperate fully with any ADA review or investigation.',
  },
];

const sidebarLinks = [
  { label: 'Postpartum Doula', href: '/certifications/postpartum-doula' },
  { label: 'Birth Doula', href: '/certifications/birth-doula' },
  { label: 'IBCLC Prep', href: '/certifications/ibclc' },
  { label: 'Renew & Recertification', href: '/for-doulas/renew' },
];

export default function CodeOfConductPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'For Doulas', path: '/for-doulas' },
              { name: 'Code of Conduct', path: '/for-doulas/code-of-conduct' },
            ])
          ),
        }}
      />
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            For Doulas
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            Code of Conduct
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            Professional and ethical standards for ADA-certified doulas.
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
                As an ADA-certified doula, you are expected to uphold the highest standards of
                professional and ethical conduct. This Code of Conduct outlines the principles that
                guide our certified doulas in providing exceptional, culturally sensitive care.
              </p>

              {/* Professional Standards */}
              <div>
                <h2 className="font-dm-serif text-3xl text-ada-navy mb-8">
                  Professional Standards
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
                  Client Care Principles
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
                  Ethical Guidelines
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
                <h3 className="font-outfit font-semibold text-ada-navy mb-2">Enforcement</h3>
                <p className="text-ada-navy/60 leading-relaxed">
                  Violations of this Code of Conduct may result in disciplinary action, including
                  suspension or revocation of ADA certification. If you become aware of a potential
                  violation, please report it to the Asian Doula Alliance at{' '}
                  <a
                    href="mailto:contact@asiandoula.org"
                    className="text-ada-purple hover:underline"
                  >
                    contact@asiandoula.org
                  </a>
                  . All reports will be reviewed confidentially.
                </p>
              </blockquote>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/5">
              <div className="sticky top-32">
                <span className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-navy/40">
                  For Doulas
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

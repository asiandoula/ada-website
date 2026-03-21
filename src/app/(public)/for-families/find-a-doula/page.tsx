import { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/public/contact-form';

export const metadata: Metadata = {
  title: 'Find a Doula | Asian Doula Alliance',
  description:
    'Connect with an ADA-certified postpartum doula who speaks your language and understands your cultural needs.',
  openGraph: {
    title: 'Find a Doula | Asian Doula Alliance',
    description:
      'Connect with an ADA-certified postpartum doula who speaks your language and understands your cultural needs.',
  },
};

const sidebarLinks = [
  { label: 'How We Train', href: '/for-families/how-we-train' },
  { label: 'Verify a Doula', href: '/verify' },
  { label: 'FAQ', href: '/support/faq' },
];

const matchSteps = [
  {
    number: '01',
    title: 'Tell us about your needs',
    description:
      'Contact ADA with your due date, location, language preference, and any specific cultural practices you\u2019d like supported.',
  },
  {
    number: '02',
    title: 'We match you with a doula',
    description:
      'Based on your needs, we recommend certified doulas in your area who speak your language and understand your traditions.',
  },
  {
    number: '03',
    title: 'Meet and choose',
    description:
      'Interview your matched doulas to find the right fit for your family.',
  },
];

const languages = ['English', 'Mandarin', 'Cantonese', 'Japanese', 'Korean'];

const serviceAreas = [
  'Los Angeles',
  'Bay Area',
  'San Diego',
  'Seattle',
  'New York City',
  'Chicago',
  'and growing',
];

export default function FindADoulaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            For Families
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            Find a Doula
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            Connect with a certified postpartum doula who speaks your language.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Main Column */}
            <div className="lg:w-4/5 space-y-16">
              {/* Intro */}
              <p className="text-lg text-ada-navy/70 leading-relaxed">
                ADA-certified doulas serve families across the United States,
                with the largest communities in California, the Pacific
                Northwest, and the New York metro area. All our doulas are
                trained in culturally integrated care and can support you in your
                preferred language.
              </p>

              {/* How to Get Matched */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                  How to Get Matched
                </h2>
                <div className="mt-8 space-y-8">
                  {matchSteps.map((step) => (
                    <div key={step.number}>
                      <span className="font-dm-serif text-3xl text-ada-purple/40">
                        {step.number}
                      </span>
                      <h3 className="mt-2 font-dm-serif text-xl text-ada-navy">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-ada-navy/70 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages Supported */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                  Languages Supported
                </h2>
                <div className="mt-6 flex flex-wrap gap-3">
                  {languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-4 py-2 bg-[#fafafa] rounded-full text-ada-navy/70 text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Service Areas */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                  Service Areas
                </h2>
                <ul className="mt-6 space-y-3">
                  {serviceAreas.map((area) => (
                    <li
                      key={area}
                      className="flex items-start gap-3 text-ada-navy/70 leading-relaxed"
                    >
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-ada-purple shrink-0" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Block */}
              <div className="bg-[#fafafa] rounded-2xl p-10 text-center">
                <h2 className="font-dm-serif text-2xl md:text-3xl text-ada-navy">
                  Ready to Find Your Doula?
                </h2>
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <Link
                    href="/support/contact"
                    className="inline-flex items-center px-4 py-2.5 text-sm bg-ada-purple text-white font-medium rounded-full hover:bg-ada-purple-hover transition-colors"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/verify"
                    className="inline-flex items-center px-4 py-2.5 text-sm border-2 border-ada-purple text-ada-purple font-medium rounded-full hover:bg-ada-purple hover:text-white transition-colors"
                  >
                    Verify a Doula
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/5">
              <div className="lg:sticky lg:top-32">
                <p className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                  For Families
                </p>
                <nav className="mt-4 space-y-3">
                  {sidebarLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-ada-navy/60 hover:text-ada-purple transition-colors text-sm"
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

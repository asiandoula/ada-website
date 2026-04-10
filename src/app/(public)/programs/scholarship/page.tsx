import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Scholarship Program',
  description:
    'ADA Scholarship Program — making doula certification accessible to aspiring caregivers from all backgrounds through financial assistance.',
  openGraph: {
    title: 'Scholarship Program | Asian Doula Alliance',
    description:
      'ADA Scholarship Program — making doula certification accessible to aspiring caregivers from all backgrounds through financial assistance.',
    images: [{ url: '/images/hero.webp', width: 1200, height: 630 }],
  },
};

const eligibility = [
  'Enrolled in or accepted to an ADA-approved training program',
  'Demonstrate financial need',
  'Commitment to serving Asian communities post-certification',
  'Multilingual ability preferred but not required',
];

const glanceItems = [
  'Covers training + exam fees',
  'Rolling applications',
  'Priority: underserved communities',
  'Multilingual speakers encouraged',
];

export default function ScholarshipPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            Scholarship
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            ADA Scholarship Program
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            Making doula certification accessible to aspiring caregivers from
            all backgrounds.
          </p>
        </div>
      </section>

      {/* About the Scholarship */}
      <section className="py-20 bg-ada-cream">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-3">
              <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                Removing barriers to certification
              </h2>
              <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed">
                ADA believes financial barriers should not prevent passionate
                individuals from becoming certified doulas. Our scholarship
                program exists to ensure that talent and dedication — not
                financial circumstances — determine who can pursue this
                meaningful career.
              </p>
              <p className="mt-4 text-lg text-ada-navy/70 leading-relaxed">
                Scholarships cover partial or full training and exam fees,
                removing the most significant obstacle for many aspiring doulas.
              </p>
              <p className="mt-4 text-lg text-ada-navy/70 leading-relaxed">
                Priority is given to candidates from underserved communities,
                multilingual speakers, and first-generation caregivers who bring
                unique perspectives and language skills to the families they
                serve.
              </p>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-ada-lavender rounded-2xl p-8">
                <h3 className="font-dm-serif text-xl text-ada-navy">
                  At a Glance
                </h3>
                <ul className="mt-6 space-y-4">
                  {glanceItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-ada-navy/70"
                    >
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-ada-purple shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy text-center">
            Eligibility
          </h2>
          <div className="mt-14 max-w-3xl mx-auto space-y-8">
            {eligibility.map((item, index) => (
              <div key={index} className="flex items-start gap-6">
                <span className="font-dm-serif text-3xl text-ada-purple shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-lg text-ada-navy/70 leading-relaxed pt-1">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-20 bg-ada-cream">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
            How to Apply
          </h2>
          <p className="mt-8 text-lg text-ada-navy/70 leading-relaxed">
            Contact ADA at{' '}
            <a
              href="mailto:contact@asiandoula.org"
              className="text-ada-purple hover:text-ada-purple-hover transition-colors underline"
            >
              contact@asiandoula.org
            </a>{' '}
            with the following:
          </p>
          <ul className="mt-8 space-y-3 text-lg text-ada-navy/70 text-left max-w-md mx-auto">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-ada-purple shrink-0" />
              <span>Your name and background</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-ada-purple shrink-0" />
              <span>Training program you are enrolled in or applying to</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-ada-purple shrink-0" />
              <span>A brief statement of purpose</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-ada-purple shrink-0" />
              <span>Any relevant experience</span>
            </li>
          </ul>
          <p className="mt-8 text-ada-navy/70 leading-relaxed">
            Applications are reviewed on a rolling basis.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-ada-navy">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-white">
            Take the Next Step
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:contact@asiandoula.org"
              className="inline-flex items-center px-4 py-2.5 text-sm bg-ada-purple text-white font-medium rounded-full hover:bg-ada-purple-hover transition-colors"
            >
              Apply Now
            </a>
            <Link
              href="/certifications/postpartum-doula/training"
              className="inline-flex items-center px-4 py-2.5 text-sm border-2 border-white text-white font-medium rounded-full hover:bg-white hover:text-ada-navy transition-colors"
            >
              Find Training Programs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

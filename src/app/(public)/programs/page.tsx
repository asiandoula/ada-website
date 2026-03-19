import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Programs',
  description:
    'Explore ADA programs — doula training, scholarship opportunities, and partnership pathways for aspiring and certified doulas.',
  openGraph: {
    title: 'Programs | Asian Doula Alliance',
    description:
      'Explore ADA programs — doula training, scholarship opportunities, and partnership pathways for aspiring and certified doulas.',
    images: [{ url: '/images/hero.jpg', width: 1200, height: 630 }],
  },
};

const programs = [
  {
    number: '01',
    title: 'Training Programs',
    description:
      'ADA-approved postpartum doula training programs combining cultural integration with evidence-based practice.',
    href: '/become-a-doula/find-a-doula-training',
  },
  {
    number: '02',
    title: 'Scholarship Program',
    description:
      'Financial assistance for aspiring doulas from underserved communities.',
    href: '/programs/scholarship',
  },
  {
    number: '03',
    title: 'Partner With Us',
    description:
      'Become an ADA-approved training provider or community partner.',
    href: '/support/contact',
  },
];

export default function ProgramsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ada-navy pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple-hover">
            Programs
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-white">
            Our Programs
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Training, scholarship, and partnership opportunities for aspiring
            and certified doulas.
          </p>
        </div>
      </section>

      {/* Program Cards */}
      <section className="py-24 md:py-32 bg-ada-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program) => (
              <Link
                key={program.number}
                href={program.href}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <span className="font-dm-serif text-3xl text-ada-purple">
                  {program.number}
                </span>
                <h3 className="mt-4 font-dm-serif text-xl text-ada-navy">
                  {program.title}
                </h3>
                <p className="mt-3 text-ada-navy/70 leading-relaxed">
                  {program.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statement */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
            Our Impact
          </h2>
          <p className="mt-8 text-lg md:text-xl text-ada-navy/70 leading-relaxed">
            Since 2017, ADA has certified over 164 doulas in 5 languages,
            partnered with 6 major insurance providers, and helped make
            culturally competent postpartum care accessible to families across
            the United States.
          </p>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-24 md:py-32 bg-ada-navy">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-white">
            Interested in partnering with ADA?
          </h2>
          <div className="mt-8">
            <Link
              href="/support/contact"
              className="inline-flex items-center px-8 py-3 bg-ada-purple text-white font-medium rounded-full hover:bg-ada-purple-hover transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

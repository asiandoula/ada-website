import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'For Families | Asian Doula Alliance',
  description:
    'Find a certified doula, verify credentials, and learn about ADA training standards. Culturally competent postpartum care for your family.',
  openGraph: {
    title: 'For Families | Asian Doula Alliance',
    description:
      'Find a certified doula, verify credentials, and learn about ADA training standards. Culturally competent postpartum care for your family.',
  },
};

const cards = [
  {
    title: 'Verify a Doula',
    description: "Confirm your doula's ADA certification status instantly.",
    href: '/verify',
  },
  {
    title: 'How We Train',
    description:
      'Learn about our rigorous, culturally integrated training program.',
    href: '/for-families/how-we-train',
  },
  {
    title: 'Find a Doula',
    description:
      'Connect with a certified ADA doula through our partner network.',
    href: '/for-families/find-a-doula',
  },
];

const reasons = [
  {
    number: '01',
    title: 'Cultural Integration',
    description:
      'Eastern and Western practices woven into every aspect of training.',
  },
  {
    number: '02',
    title: 'Multilingual Support',
    description: 'Care in English, Chinese, Japanese, and Korean.',
  },
  {
    number: '03',
    title: 'Insurance Accepted',
    description: 'Kaiser, Medi-Cal, Cigna, Carrot Fertility, and Blue Shield.',
  },
  {
    number: '04',
    title: 'Rigorous Certification',
    description:
      'Written and practical exam with three-year certification cycle.',
  },
];

export default function ForFamiliesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ada-navy pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple-hover">
            For Families
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-white">
            Culturally Competent Care for Your Family
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Whether you&apos;re looking for a certified doula, want to verify
            credentials, or learn about our training standards — we&apos;re here
            to help.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="py-24 md:py-32 bg-ada-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-dm-serif text-2xl text-ada-navy">
                  {card.title}
                </h3>
                <p className="mt-3 text-ada-navy/70 leading-relaxed">
                  {card.description}
                </p>
                <span className="mt-6 inline-block text-ada-purple font-medium">
                  Learn more &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy text-center">
            Why Choose an ADA-Certified Doula
          </h2>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
            {reasons.map((item) => (
              <div key={item.number}>
                <span className="font-dm-serif text-3xl text-ada-purple/40">
                  {item.number}
                </span>
                <h3 className="mt-2 font-dm-serif text-xl text-ada-navy">
                  {item.title}
                </h3>
                <p className="mt-2 text-ada-navy/70 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ada-navy py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-white">
            Ready to find your doula?
          </h2>
          <Link
            href="/for-families/find-a-doula"
            className="mt-8 inline-flex items-center px-8 py-4 bg-ada-purple text-white font-medium rounded-full hover:bg-ada-purple-hover transition-colors"
          >
            Find a Doula
          </Link>
        </div>
      </section>
    </>
  );
}

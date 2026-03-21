import { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/public/contact-form';

export const metadata: Metadata = {
  title: 'For Families | Asian Doula Alliance',
  description:
    'Find trusted, culturally competent postpartum care for your family. Verify credentials, learn about training standards, and connect with ADA-certified doulas.',
  openGraph: {
    title: 'For Families | Asian Doula Alliance',
    description:
      'Find trusted, culturally competent postpartum care for your family. Verify credentials, learn about training standards, and connect with ADA-certified doulas.',
  },
};

const cards = [
  {
    title: 'How We Train Our Doulas',
    description:
      'Learn about ADA\u2019s rigorous training and certification process \u2014 so you know exactly what our doulas bring to your home.',
    href: '/for-families/how-we-train',
    linkText: 'Learn More',
  },
  {
    title: 'Find a Doula',
    description:
      'Connect with an ADA-certified postpartum doula who speaks your language and understands your cultural needs.',
    href: '/for-families/find-a-doula',
    linkText: 'Find a Doula',
  },
  {
    title: 'Verify a Doula',
    description:
      'Check if your doula holds a current ADA certification using their name or certification number.',
    href: '/verify',
    linkText: 'Verify Now',
  },
];

export default function ForFamiliesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            For Families
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            For Families
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            Find trusted, culturally competent postpartum care for your family.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Intro */}
          <p className="text-lg text-ada-navy/70 leading-relaxed max-w-3xl">
            Whether you&apos;re expecting your first child or welcoming another,
            having a certified doula by your side makes all the difference.
            ADA-certified doulas are trained in both evidence-based care and the
            cultural traditions your family values.
          </p>

          {/* Entry Cards */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div
                key={card.href}
                className="bg-[#fafafa] rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="font-dm-serif text-xl text-ada-navy">
                  {card.title}
                </h3>
                <p className="mt-3 text-ada-navy/60 leading-relaxed">
                  {card.description}
                </p>
                <Link
                  href={card.href}
                  className="mt-6 inline-block text-ada-purple font-medium text-sm"
                >
                  {card.linkText} &rarr;
                </Link>
              </div>
            ))}
          </div>

          {/* Insurance Section */}
          <div className="mt-20">
            <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
              Insurance Coverage
            </h2>
            <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed max-w-3xl">
              Many ADA-certified doula services are covered by insurance. Our
              certified doulas are recognized by: Medi-Cal, Kaiser, Cigna, IEHP,
              Carrot Fertility, and Progyny. Contact your insurance provider to
              verify your specific coverage.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactForm />
    </>
  );
}

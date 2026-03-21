import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Support',
  description:
    'Find answers, get in touch, or explore resources from the Asian Doula Alliance.',
  openGraph: {
    title: 'Support | Asian Doula Alliance',
    description:
      'Find answers, get in touch, or explore resources from the Asian Doula Alliance.',
    images: [{ url: '/images/hero.jpg', width: 1200, height: 630 }],
  },
};

const cards = [
  {
    title: 'Frequently Asked Questions',
    description:
      'Find answers to common questions about certification, training, exams, and doula services.',
    href: '/support/faq',
  },
  {
    title: 'Contact Us',
    description:
      'Reach out to our team. We respond within 1-2 business days.',
    href: '/support/contact',
  },
  {
    title: 'Articles',
    description:
      'Read the latest news, guides, and stories from the ADA community.',
    href: '/articles',
  },
];

export default function SupportPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            Support
          </span>
          <h1 className="mt-3 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            How Can We Help?
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            Find answers, get in touch, or explore our resources.
          </p>
        </div>
      </section>

      {/* Entry Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="bg-[#fafafa] rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <h2 className="font-dm-serif text-xl text-ada-navy">
                  {card.title}
                </h2>
                <p className="mt-3 font-outfit text-sm text-ada-navy/60 leading-relaxed">
                  {card.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 font-outfit text-sm font-medium text-ada-purple">
                  Learn more{' '}
                  <span className="group-hover:translate-x-1 transition-transform">
                    &rarr;
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="bg-[#fafafa] py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
            <div className="text-center">
              <p className="text-xs font-outfit uppercase tracking-wider text-ada-navy/40">
                Phone
              </p>
              <a
                href="tel:+17142026501"
                className="mt-1 block font-outfit text-ada-navy hover:text-ada-purple transition-colors"
              >
                (714) 202-6501
              </a>
            </div>
            <div className="text-center">
              <p className="text-xs font-outfit uppercase tracking-wider text-ada-navy/40">
                Email
              </p>
              <a
                href="mailto:contact@asiandoula.org"
                className="mt-1 block font-outfit text-ada-navy hover:text-ada-purple transition-colors"
              >
                contact@asiandoula.org
              </a>
            </div>
            <div className="text-center">
              <p className="text-xs font-outfit uppercase tracking-wider text-ada-navy/40">
                Hours
              </p>
              <p className="mt-1 font-outfit text-ada-navy">
                Mon&ndash;Fri 10AM&ndash;5PM PST
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

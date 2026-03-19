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
    title: 'FAQ',
    description:
      'Find answers to common questions about certification, training, and more.',
    href: '/support/faq',
  },
  {
    title: 'Contact Us',
    description: 'Reach out to our team directly.',
    href: '/support/contact',
  },
  {
    title: 'Articles',
    description: 'Read the latest from the ADA community.',
    href: '/articles',
  },
];

export default function SupportPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ada-navy pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple-hover">
            Support
          </span>
          <h1 className="mt-3 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-white">
            How Can We Help?
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Find answers, get in touch, or explore our resources.
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
                <h2 className="font-dm-serif text-2xl text-ada-navy">
                  {card.title}
                </h2>
                <p className="mt-3 font-outfit text-ada-navy/60 leading-relaxed">
                  {card.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Contact Info */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
            Quick Contact Info
          </h2>
          <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 font-outfit text-ada-navy/70">
            <div>
              <p className="font-semibold text-ada-navy">Phone</p>
              <p className="mt-1">(714) 202-6501</p>
            </div>
            <div>
              <p className="font-semibold text-ada-navy">Email</p>
              <p className="mt-1">contact@asiandoula.org</p>
            </div>
            <div>
              <p className="font-semibold text-ada-navy">Hours</p>
              <p className="mt-1">Mon–Fri 10AM–5PM PST</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

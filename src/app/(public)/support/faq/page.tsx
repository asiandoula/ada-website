import { Metadata } from 'next';
import { FAQContent } from './faq-content';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about ADA certification, training, and doula services.',
  openGraph: {
    title: 'FAQ | Asian Doula Alliance',
    description:
      'Frequently asked questions about ADA certification, training, and doula services.',
    images: [{ url: '/images/hero.jpg', width: 1200, height: 630 }],
  },
};

export default function FAQPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ada-navy pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple-hover">
            FAQ
          </span>
          <h1 className="mt-3 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-white">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about ADA certification, training, and
            services.
          </p>
        </div>
      </section>

      <FAQContent />

      {/* Bottom CTA */}
      <section className="py-24 md:py-32 bg-ada-cream">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
            Still have questions?
          </h2>
          <p className="mt-4 font-outfit text-ada-navy/60 text-lg leading-relaxed">
            Our team is here to help. Reach out and we&apos;ll get back to you
            as soon as possible.
          </p>
          <a
            href="/support/contact"
            className="mt-8 inline-block rounded-full bg-ada-purple px-8 py-3 font-outfit font-medium text-white hover:bg-ada-purple-hover transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
    </>
  );
}

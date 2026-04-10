import { Metadata } from 'next';
import { ContactForm } from '@/components/public/contact-form';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the Asian Doula Alliance. We\'d love to hear from you.',
  openGraph: {
    title: 'Contact Us | Asian Doula Alliance',
    description:
      'Get in touch with the Asian Doula Alliance. We\'d love to hear from you.',
    images: [{ url: '/images/hero.webp', width: 1200, height: 630 }],
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            Support
          </span>
          <h1 className="mt-3 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            Contact Us
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            We&apos;d love to hear from you. We respond within 1-2 business
            days.
          </p>
        </div>
      </section>

      <ContactForm />
    </>
  );
}

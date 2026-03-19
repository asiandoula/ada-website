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
    images: [{ url: '/images/hero.jpg', width: 1200, height: 630 }],
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ada-navy pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple-hover">
            Contact
          </span>
          <h1 className="mt-3 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-white">
            Get in Touch
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <ContactForm />
    </>
  );
}

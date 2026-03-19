import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about the Asian Doula Alliance — a 501(c)(3) non-profit setting the standard in culturally integrated postpartum doula care and certification.',
  openGraph: {
    title: 'About Us | Asian Doula Alliance',
    description:
      'Learn about the Asian Doula Alliance — a 501(c)(3) non-profit setting the standard in culturally integrated postpartum doula care and certification.',
    images: [{ url: '/images/hero.jpg', width: 1200, height: 630 }],
  },
};

export default function AboutUsPage() {
  return (
    <>
      {/* Hero banner */}
      <section className="bg-ada-navy pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple-hover">
            About
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-white">
            About Us
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            The Asian Doula Alliance is a 501(c)(3) non-profit organization
            setting the standard in culturally integrated postpartum care.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                Who We Are
              </h2>
              <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed">
                Founded with a deep commitment to maternal health equity, the Asian Doula
                Alliance was created to address the growing need for culturally competent
                postpartum care within Asian communities across the United States.
              </p>
              <p className="mt-4 text-lg text-ada-navy/70 leading-relaxed">
                We recognized that new mothers from Asian backgrounds often navigate
                postpartum recovery between two worlds — traditional practices passed down
                through generations and modern Western medical recommendations. Our
                certification program uniquely bridges these approaches, training doulas who
                can honor cultural traditions while providing evidence-based support.
              </p>
              <p className="mt-4 text-lg text-ada-navy/70 leading-relaxed">
                Today, ADA is the leading certification body for culturally integrated
                postpartum doula care, with over 164 certified professionals serving
                families in their preferred language and cultural context.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl bg-ada-cream overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-ada-navy/20 font-outfit text-sm">
                Image placeholder
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
            Our Story
          </h2>
          <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed">
            The Asian Doula Alliance began when a group of experienced doulas and
            maternal health advocates noticed a critical gap: families seeking
            postpartum care that respected their cultural practices had few options.
            Existing certification programs, while valuable, did not address the
            specific needs of Asian communities — from zuo yuezi (sitting the month)
            traditions to multilingual communication needs.
          </p>
          <p className="mt-4 text-lg text-ada-navy/70 leading-relaxed">
            What started as a small training initiative in Irvine, California has
            grown into a nationally recognized certification program with doulas
            serving families across major metropolitan areas including Los Angeles,
            the Bay Area, Seattle, New York City, and Chicago.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/about-us/history"
              className="inline-flex items-center px-6 py-3 bg-ada-purple text-white font-medium rounded-full hover:bg-ada-purple-hover transition-colors"
            >
              View Our History
            </Link>
            <Link
              href="/about-us/mission-value"
              className="inline-flex items-center px-6 py-3 border-2 border-ada-purple text-ada-purple font-medium rounded-full hover:bg-ada-purple hover:text-white transition-colors"
            >
              Mission &amp; Values
            </Link>
          </div>
        </div>
      </section>

      {/* Team section hidden until real team data is available
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
              Our Team
            </h2>
            <p className="mt-4 text-lg text-ada-navy/70 max-w-2xl mx-auto">
              Dedicated professionals committed to advancing culturally competent
              postpartum care across the nation.
            </p>
          </div>
        </div>
      </section>
      */}
    </>
  );
}

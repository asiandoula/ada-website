import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ContactForm } from '@/components/public/contact-form';

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

const values = [
  {
    title: 'History',
    href: '/about-us/history',
    description:
      'Providing honest and empathetic care to every family, fostering a foundation of respect and reliability.',
  },
  {
    title: 'Mission & Values',
    href: '/about-us/mission-value',
    description:
      'Committed to the highest standards through comprehensive training and culturally attuned support.',
  },
  {
    title: 'Board of Directors',
    href: '/about-us/board',
    description:
      'The volunteers who guide ADA\'s mission, set strategic direction, and ensure accountability.',
  },
  {
    title: 'Partners & More',
    href: null,
    description:
      'Harmonizing traditional Asian practices with modern care to serve families globally.',
  },
];

export default function AboutUsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            About
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            What is ADA?
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            The Asian Doula Alliance (ADA) (亚洲月嫂联盟) is a 501(c)(3) non-profit
            organization dedicated to supporting and advancing the education of Asian
            doulas.
          </p>
          <div className="mt-8">
            <Link
              href="/certifications/postpartum-doula/steps"
              className="inline-flex items-center px-4 py-2.5 text-sm bg-ada-purple text-white font-medium rounded-full hover:bg-ada-purple-hover transition-colors"
            >
              Get Certified
            </Link>
          </div>
        </div>
      </section>

      {/* Why ADA Matters */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col items-start gap-4 mb-10">
            <span className="text-sm font-medium text-ada-purple bg-ada-purple/10 rounded-full px-3 py-1">
              Why ADA
            </span>
            <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
              Why ADA Matters
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Left - text card */}
            <div className="bg-[#FAF9F7] rounded-2xl p-8 flex flex-col justify-center">
              <p className="text-lg text-ada-navy/80 italic leading-relaxed">
                &ldquo;The Chinese Doula Incident In Bay Area&rdquo; &mdash; a doula was
                caught on camera allegedly abusing a 2-day-old infant.
              </p>
              <p className="mt-4 text-sm text-ada-navy/50">
                Source: Bay Area local news reports
              </p>
            </div>

            {/* Right - YouTube thumbnail */}
            <a
              href="https://www.youtube.com/watch?v=J8BAE_e3APw"
              target="_blank"
              rel="noopener noreferrer"
              className="relative block aspect-video rounded-2xl overflow-hidden bg-ada-navy/10 group"
            >
              <img
                src={`https://img.youtube.com/vi/J8BAE_e3APw/maxresdefault.jpg`}
                alt="Why ADA Matters - Video"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-ada-purple/90 flex items-center justify-center group-hover:bg-ada-purple transition-colors">
                  <svg
                    className="w-7 h-7 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </a>
          </div>

          <p className="text-lg text-ada-navy/70 leading-relaxed max-w-4xl">
            The Asian postpartum community has faced troubling challenges, including
            severe breaches of trust such as &ldquo;The Chinese Doula Incident In Bay
            Area&rdquo;, where a doula was caught on camera allegedly abusing a 2-day-old
            infant, underscores the critical need for rigorous standards and professional
            oversight in postpartum care. These events have left families vulnerable and
            distrustful.
          </p>
        </div>
      </section>

      {/* How ADA Can Help */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left - image */}
            <div className="relative w-full max-w-[454px] mx-auto lg:mx-0">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <Image
                  src="/images/about-ada-help.jpg"
                  alt="How ADA Can Help"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 454px"
                />
              </div>
            </div>

            {/* Right - content */}
            <div className="flex flex-col justify-center">
              <span className="text-sm font-medium text-ada-purple bg-ada-purple/10 rounded-full px-3 py-1 w-fit">
                How ADA
              </span>
              <h2 className="mt-4 font-dm-serif text-3xl md:text-4xl text-ada-navy">
                How ADA Can Help
              </h2>
              <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed">
                ADA was founded to respond to such urgent needs by introducing structured
                training, stringent certification, and a robust ethical framework. Our
                certification process involves rigorous screening, continuous education,
                and clear accountability standards, ensuring doulas uphold the highest
                professional and ethical conduct.
              </p>
              <div className="mt-8">
                <Link
                  href="/about-us/mission-value"
                  className="inline-flex items-center px-4 py-2.5 text-sm bg-ada-purple text-white font-medium rounded-full hover:bg-ada-purple-hover transition-colors"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats row */}
              <div className="mt-10 flex flex-wrap gap-8">
                <div>
                  <p className="font-dm-serif text-2xl text-ada-navy">164+</p>
                  <p className="text-sm text-ada-navy/60 mt-1">Doulas Trained</p>
                </div>
                <div>
                  <p className="font-dm-serif text-2xl text-ada-navy">50+</p>
                  <p className="text-sm text-ada-navy/60 mt-1">Workshops &amp; Seminars</p>
                </div>
                <div>
                  <p className="font-dm-serif text-2xl text-ada-navy">$2M+</p>
                  <p className="text-sm text-ada-navy/60 mt-1">Scholarships Secured</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-ada-cream">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
              Our Values
            </h2>
            <p className="mt-4 text-lg text-ada-navy/70 max-w-2xl mx-auto">
              Compassion, professionalism, dedication, and cultural understanding define
              our care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const inner = (
                <div
                  key={value.title}
                  className="bg-white rounded-2xl p-8 min-h-[395px] flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <h3 className="font-dm-serif text-xl text-ada-navy">
                      {value.title}
                    </h3>
                    <p className="mt-4 text-ada-navy/70 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                  {value.href && (
                    <span className="text-sm font-medium text-ada-purple mt-6 inline-flex items-center gap-1">
                      Learn more
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  )}
                </div>
              );

              return value.href ? (
                <Link key={value.title} href={value.href} className="block">
                  {inner}
                </Link>
              ) : (
                <div key={value.title}>{inner}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactForm />
    </>
  );
}

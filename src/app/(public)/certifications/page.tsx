import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Certifications | Asian Doula Alliance',
  description:
    'Three certification tracks to advance your career in maternal and newborn care — Postpartum Doula, Birth Doula, and IBCLC Exam Prep.',
};

const tracks = [
  {
    badge: 'Now Enrolling',
    badgeClass: 'bg-green-50 text-green-700',
    title: 'Postpartum Doula',
    description:
      'The gold standard in culturally integrated postpartum care certification. Exams in 5 languages, recognized by 6 insurance partners.',
    facts: '$625 exam fee · 3-year validity · 164+ certified',
    href: '/certifications/postpartum-doula',
    linkText: 'Learn More →',
    cardBorder: 'border-ada-purple/20',
    opacity: '',
  },
  {
    badge: 'Coming Soon',
    badgeClass: 'bg-ada-purple/10 text-ada-purple',
    title: 'Birth Doula',
    description:
      'Support families through labor and delivery with culturally integrated training and ADA certification.',
    facts: '',
    href: '/certifications/birth-doula',
    linkText: 'Get Notified →',
    cardBorder: 'border-gray-200',
    opacity: 'opacity-90',
  },
  {
    badge: 'Coming Soon',
    badgeClass: 'bg-ada-purple/10 text-ada-purple',
    title: 'IBCLC Exam Prep',
    description:
      'Multilingual preparation course for the International Board Certified Lactation Consultant exam.',
    facts: '',
    href: '/certifications/ibclc',
    linkText: 'Get Notified →',
    cardBorder: 'border-gray-200',
    opacity: 'opacity-90',
  },
];

const sharedLinks = [
  { label: 'Renew Certification', href: '/for-doulas/renew' },
  { label: 'Code of Conduct', href: '/for-doulas/code-of-conduct' },
  { label: 'Verify a Doula', href: '/verify' },
];

export default function CertificationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            Certifications
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            Choose Your Path
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            Three certification tracks to advance your career in maternal and newborn care.
          </p>
        </div>
      </section>

      {/* Three Track Cards */}
      <section className="bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {tracks.map((track) => (
              <div
                key={track.title}
                className={`bg-white border-2 ${track.cardBorder} rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300 ${track.opacity}`}
              >
                <span
                  className={`inline-block ${track.badgeClass} text-xs px-2.5 py-0.5 rounded-full font-medium mb-4`}
                >
                  {track.badge}
                </span>
                <h2 className="font-dm-serif text-2xl text-ada-navy">{track.title}</h2>
                <p className="mt-3 text-ada-navy/60 text-sm leading-relaxed">
                  {track.description}
                </p>
                {track.facts && (
                  <p className="mt-4 text-xs text-ada-navy/40 font-outfit">{track.facts}</p>
                )}
                <Link
                  href={track.href}
                  className="mt-6 inline-flex items-center rounded-full bg-ada-purple text-white px-4 py-2.5 text-sm font-medium hover:bg-ada-purple-hover transition-colors"
                >
                  {track.linkText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shared Resources */}
      <section className="bg-[#fafafa] py-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-2xl md:text-3xl text-ada-navy mb-8">
            For All Certified Doulas
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            {sharedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-ada-navy/70 hover:text-ada-purple text-sm font-outfit transition-colors"
              >
                {link.label} &rarr;
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

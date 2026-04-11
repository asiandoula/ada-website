import { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/public/contact-form';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Programs',
  description:
    'Certification tracks, training programs, and scholarships for aspiring doulas and lactation professionals.',
  openGraph: {
    title: 'Programs | Asian Doula Alliance',
    description:
      'Certification tracks, training programs, and scholarships for aspiring doulas and lactation professionals.',
    images: [{ url: '/images/hero.webp', width: 1200, height: 630 }],
  },
};

export default async function ProgramsPage() {
  const t = await getTranslations('programs');

  const certificationTracks = [
    {
      badge: 'Now Enrolling',
      badgeStyle: 'bg-green-50 text-green-700',
      title: t('postpartumDoulaCertificationTitle'),
      description: t('postpartumDoulaCertificationDescription'),
      facts: '$625 exam fee · 3-year validity',
      link: { label: t('learnMore'), href: '/certifications/postpartum-doula' },
      cardBorder: 'border-2 border-ada-purple/20',
    },
    {
      badge: 'Coming Soon',
      badgeStyle: 'bg-ada-purple/10 text-ada-purple',
      title: t('birthDoulaCertificationTitle'),
      description: t('birthDoulaCertificationDescription'),
      facts: null,
      link: { label: t('getNotified'), href: '/certifications/birth-doula' },
      cardBorder: 'border-gray-200',
    },
    {
      badge: 'Coming Soon',
      badgeStyle: 'bg-ada-purple/10 text-ada-purple',
      title: t('ibclcExamPrepTitle'),
      description: t('ibclcExamPrepDescription'),
      facts: null,
      link: { label: t('getNotified'), href: '/certifications/ibclc' },
      cardBorder: 'border-gray-200',
    },
  ];

  const additionalPrograms = [
    {
      title: t('scholarshipProgramTitle'),
      description: t('scholarshipProgramDescription'),
      link: { label: t('learnMore'), href: '/programs/scholarship' },
    },
    {
      title: t('findATrainingTitle'),
      description: t('findATrainingDescription'),
      link: { label: t('browsePrograms'), href: '/certifications/postpartum-doula/training' },
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            {t('heroTitle')}
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            {t('heroDescription')}
          </p>
        </div>
      </section>

      {/* Certification Tracks */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
              {t('certificationTracksTitle')}
            </h2>
            <p className="mt-4 text-lg text-ada-navy/60">
              {t('certificationTracksDescription')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certificationTracks.map((track) => (
              <div
                key={track.title}
                className={`bg-white border ${track.cardBorder} rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300 flex flex-col`}
              >
                <span
                  className={`${track.badgeStyle} text-xs font-medium px-2.5 py-0.5 rounded-full self-start`}
                >
                  {track.badge}
                </span>
                <h3 className="mt-4 font-dm-serif text-xl text-ada-navy">
                  {track.title}
                </h3>
                <p className="mt-3 text-ada-navy/70 leading-relaxed flex-1">
                  {track.description}
                </p>
                {track.facts && (
                  <p className="mt-4 text-sm text-ada-navy/60 font-outfit">
                    {track.facts}
                  </p>
                )}
                <Link
                  href={track.link.href}
                  className="mt-6 inline-flex items-center text-sm font-medium text-ada-purple hover:text-ada-purple-hover transition-colors"
                >
                  {track.link.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Programs */}
      <section className="py-20 bg-ada-off-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
              {t('additionalProgramsTitle')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {additionalPrograms.map((program) => (
              <div
                key={program.title}
                className="bg-white rounded-2xl p-8 hover:shadow-md transition-shadow"
              >
                <h3 className="font-dm-serif text-xl text-ada-navy">
                  {program.title}
                </h3>
                <p className="mt-3 text-ada-navy/70 leading-relaxed">
                  {program.description}
                </p>
                <Link
                  href={program.link.href}
                  className="mt-6 inline-flex items-center text-sm font-medium text-ada-purple hover:text-ada-purple-hover transition-colors"
                >
                  {program.link.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactForm />
    </>
  );
}

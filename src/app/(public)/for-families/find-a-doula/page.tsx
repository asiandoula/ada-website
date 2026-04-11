import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { ContactForm } from '@/components/public/contact-form';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Find a Doula | Asian Doula Alliance',
  description:
    'Connect with an ADA-certified postpartum doula who speaks your language and understands your cultural needs.',
  openGraph: {
    title: 'Find a Doula | Asian Doula Alliance',
    description:
      'Connect with an ADA-certified postpartum doula who speaks your language and understands your cultural needs.',
  },
};

export default async function FindADoulaPage() {
  const t = await getTranslations('findDoula');

  const sidebarLinks = [
    { label: t('howWeTrain'), href: '/for-families/how-we-train' },
    { label: t('verifyADoula'), href: '/verify' },
    { label: t('faq'), href: '/support/faq' },
  ];

  const languages = [
    'English',
    'Mandarin',
    'Cantonese',
    'Japanese',
    'Korean',
  ];

  const serviceAreas = [
    'Los Angeles',
    'Bay Area',
    'San Diego',
    'Seattle',
    'New York City',
    'Chicago',
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: t('forFamilies'), path: '/for-families' },
              { name: t('findADoula'), path: '/for-families/find-a-doula' },
            ])
          ),
        }}
      />
      {/* Hero — light, per inner page pattern */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-24 left-[8%] w-16 h-16 rounded-full border-[3px] border-ada-green/30 rotate-[-20deg] hidden lg:block" />
        <div className="absolute bottom-12 right-[12%] w-12 h-12 bg-ada-pink-light rounded-lg rotate-[35deg] hidden lg:block" />
        <div className="absolute top-36 right-[6%] w-8 h-8 bg-ada-blue/20 rotate-[60deg] hidden lg:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />

        <div className="relative max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            {t('forFamilies')}
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            {t('heroDescription')}
          </p>
        </div>
      </section>

      {/* Main Content + Sidebar */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Main Column */}
            <div className="lg:w-4/5 space-y-20">

              {/* Pathway 1: Partner — warm editorial card */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                  {t('trustedPartnerTitle')}
                </h2>
                <p className="mt-4 text-ada-navy/60 leading-relaxed max-w-2xl">
                  {t('trustedPartnerDescription')}
                </p>

                <div className="mt-10 bg-ada-lavender rounded-3xl overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 relative">
                      <Image
                        src="/images/families/cooings-partner.webp"
                        alt="Cooings doula providing postpartum care to a new mother"
                        width={1200}
                        height={857}
                        className="w-full h-full object-cover object-[5%_center] min-h-[240px]"
                      />
                    </div>
                    <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-center">
                      <p className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-purple/60 mb-2">
                        {t('featuredPartnerLabel')}
                      </p>
                      <h3 className="font-dm-serif text-2xl text-ada-navy">
                        {t('partnerName')}
                      </h3>
                      <p className="mt-3 text-sm text-ada-navy/60 leading-relaxed">
                        {t('partnerDescription')}
                      </p>
                      <ul className="mt-4 space-y-1.5 text-sm text-ada-navy/50">
                        <li className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-ada-purple shrink-0" />
                          {t('insuranceSupport')}
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-ada-purple shrink-0" />
                          {t('serviceAreas')}
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-ada-purple shrink-0" />
                          {t('personalizedMatching')}
                        </li>
                      </ul>
                      <div className="mt-6">
                        <a
                          href="https://www.cooings.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-5 py-2.5 text-sm bg-ada-purple text-white font-medium rounded-full hover:bg-ada-purple-hover transition-colors"
                        >
                          {t('visitPartner')}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pathway 2: Contact ADA directly */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                  {t('recommendationTitle')}
                </h2>
                <p className="mt-4 text-ada-navy/60 leading-relaxed max-w-2xl">
                  {t('recommendationDescription')}
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { step: '01', title: t('steps[0].title'), desc: t('steps[0].desc') },
                    { step: '02', title: t('steps[1].title'), desc: t('steps[1].desc') },
                    { step: '03', title: t('steps[2].title'), desc: t('steps[2].desc') },
                  ].map((s) => (
                    <div key={s.step} className="bg-ada-off-white rounded-2xl p-6">
                      <span className="font-dm-serif text-2xl text-ada-purple/30">{s.step}</span>
                      <h3 className="mt-2 font-dm-serif text-lg text-ada-navy">{s.title}</h3>
                      <p className="mt-2 text-sm text-ada-navy/50 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link
                    href="#contact"
                    className="inline-flex items-center px-5 py-2.5 text-sm border-2 border-ada-purple text-ada-purple font-medium rounded-full hover:bg-ada-purple hover:text-white transition-colors"
                  >
                    {t('contactUs')}
                  </Link>
                  <span className="ml-4 text-sm text-ada-navy/40">{t('noObligation')}</span>
                </div>
              </div>

              {/* Pathway 3: Already have a doula? */}
              <div className="bg-ada-off-white rounded-2xl p-10">
                <h2 className="font-dm-serif text-2xl md:text-3xl text-ada-navy">
                  {t('alreadyHaveDoulaTitle')}
                </h2>
                <p className="mt-3 text-ada-navy/60 leading-relaxed max-w-2xl">
                  {t('alreadyHaveDoulaDescription')}
                </p>
                <div className="mt-6">
                  <Link
                    href="/verify"
                    className="inline-flex items-center px-5 py-2.5 text-sm border-2 border-ada-navy/20 text-ada-navy font-medium rounded-full hover:bg-ada-navy/5 transition-colors"
                  >
                    {t('verifyDoula')}
                  </Link>
                </div>
              </div>

              {/* Why Certification Matters */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                  {t('whyCertificationTitle')}
                </h2>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    {
                      title: t('certificationDetails[0].title'),
                      desc: t('certificationDetails[0].desc'),
                      color: 'bg-ada-green-light',
                    },
                    {
                      title: t('certificationDetails[1].title'),
                      desc: t('certificationDetails[1].desc'),
                      color: 'bg-ada-blue-light',
                    },
                    {
                      title: t('certificationDetails[2].title'),
                      desc: t('certificationDetails[2].desc'),
                      color: 'bg-ada-pink-light',
                    },
                    {
                      title: t('certificationDetails[3].title'),
                      desc: t('certificationDetails[3].desc'),
                      color: 'bg-ada-violet-light',
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className={`mt-1 w-10 h-10 ${item.color} rounded-lg shrink-0`} />
                      <div>
                        <h3 className="font-outfit font-semibold text-ada-navy">{item.title}</h3>
                        <p className="mt-1 text-sm text-ada-navy/60 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages & Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="font-dm-serif text-2xl text-ada-navy mb-4">{t('languagesTitle')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <span key={lang} className="px-4 py-2 bg-ada-off-white rounded-full text-ada-navy/70 text-sm font-outfit">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-dm-serif text-2xl text-ada-navy mb-4">{t('serviceAreasTitle')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {serviceAreas.map((area) => (
                      <span key={area} className="px-4 py-2 bg-ada-off-white rounded-full text-ada-navy/70 text-sm font-outfit">
                        {area}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-ada-navy/40 font-outfit">
                    {t('growingNetwork')}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/5">
              <div className="lg:sticky lg:top-32">
                <p className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                  {t('forFamilies')}
                </p>
                <nav className="mt-4 space-y-3">
                  {sidebarLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-ada-navy/60 hover:text-ada-purple transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Contact */}
      <div id="contact">
        <ContactForm />
      </div>
    </>
  );
}

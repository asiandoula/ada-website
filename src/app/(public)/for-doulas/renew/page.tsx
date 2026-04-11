import { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { ContactForm } from '@/components/public/contact-form';
import { RenewalSteps } from './renewal-steps';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Renew & Recertification | Asian Doula Alliance',
  description:
    'Learn how to renew your ADA doula certification. Certificates are valid for 1 year with two renewal pathways: reference letters or recertification exam.',
};

const sidebarLinks = [
  { label: 'Postpartum Doula', href: '/certifications/postpartum-doula' },
  { label: 'Birth Doula', href: '/certifications/birth-doula' },
  { label: 'IBCLC Prep', href: '/certifications/ibclc' },
  { label: 'Code of Conduct', href: '/for-doulas/code-of-conduct' },
];

export default async function RenewRecertificationPage() {
  const t = await getTranslations('renewCert');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: t('forDoulas'), path: '/for-doulas' },
              { name: t('renewalSteps'), path: '/for-doulas/renew' },
            ])
          ),
        }}
      />
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            {t('forDoulas')}
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/70 max-w-3xl mx-auto leading-relaxed">
            {t('ctaDescription')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Main content column */}
            <div className="lg:w-4/5 space-y-16">
              {/* Key Info — 2x2 Grid */}
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div className="bg-[#f3ebf9] rounded-2xl p-6 md:p-8">
                  <p className="font-outfit text-sm text-ada-navy/50 mb-1">{t('certificateValidity')}</p>
                  <p className="text-3xl md:text-4xl font-outfit font-bold text-ada-purple">{t('validityDuration')}</p>
                </div>
                <div className="bg-[#e6f7fe] rounded-2xl p-6 md:p-8">
                  <p className="font-outfit text-sm text-ada-navy/50 mb-1">{t('renewalFee')}</p>
                  <p className="text-3xl md:text-4xl font-outfit font-bold text-ada-purple">{t('renewalCost')}</p>
                </div>
                <div className="bg-[#f3f9eb] rounded-2xl p-6 md:p-8">
                  <p className="font-outfit text-sm text-ada-navy/50 mb-1">{t('renewalPathways')}</p>
                  <p className="text-3xl md:text-4xl font-outfit font-bold text-ada-purple">{t('optionsCount')}</p>
                </div>
                <div className="bg-[#fdede7] rounded-2xl p-6 md:p-8">
                  <p className="font-outfit text-sm text-ada-navy/50 mb-1">{t('insurancePartners')}</p>
                  <p className="font-outfit text-sm text-ada-navy/70 leading-relaxed mt-1">
                    {t('insurancePartnersList')}
                  </p>
                </div>
              </div>

              {/* Interactive Steps */}
              <RenewalSteps />

              {/* CTA */}
              <div className="bg-ada-off-white rounded-2xl p-10 text-center">
                <h2 className="font-dm-serif text-2xl md:text-3xl text-ada-navy">
                  {t('ctaTitle')}
                </h2>
                <p className="mt-3 text-ada-navy/70 leading-relaxed max-w-xl mx-auto">
                  {t('ctaDescription')}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/verify"
                    className="inline-flex items-center justify-center rounded-full bg-ada-purple text-white px-6 py-3 text-sm font-medium hover:bg-ada-purple-hover transition-colors"
                  >
                    {t('checkCertificationStatus')}
                  </Link>
                  <Link
                    href="/portal"
                    className="inline-flex items-center justify-center rounded-full border border-ada-navy/20 text-ada-navy px-6 py-3 text-sm font-medium hover:bg-ada-navy/5 transition-colors"
                  >
                    {t('myPortal')}
                  </Link>
                  <a
                    href="mailto:contact@asiandoula.org"
                    className="inline-flex items-center justify-center rounded-full border border-ada-navy/20 text-ada-navy px-6 py-3 text-sm font-medium hover:bg-ada-navy/5 transition-colors"
                  >
                    {t('contactUs')}
                  </a>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/5">
              <div className="sticky top-32">
                <span className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-navy/40">
                  {t('forDoulas')}
                </span>
                <nav className="mt-4 flex flex-col">
                  {sidebarLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block py-1.5 text-sm text-ada-navy/60 hover:text-ada-purple transition-colors"
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
      <ContactForm />
    </>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { NewsletterForm } from './newsletter-form';

export function Footer() {
  const t = useTranslations('footer');

  const doulaLinks = [
    { label: t('postpartumDoula'), href: '/certifications/postpartum-doula' },
    { label: t('renewRecertification'), href: '/for-doulas/renew' },
    { label: t('codeOfConduct'), href: '/for-doulas/code-of-conduct' },
  ];

  const familyLinks = [
    { label: t('verifyADoula'), href: '/verify' },
    { label: t('howWeTrain'), href: '/for-families/how-we-train' },
    { label: t('findADoula'), href: '/for-families/find-a-doula' },
  ];

  const institutionLinks = [
    { label: t('credentialVerification'), href: '/verify' },
    { label: t('contactUs'), href: '/support/contact' },
    { label: t('faq'), href: '/support/faq' },
  ];

  const supportLinks = [
    { label: t('donate'), href: '/donate' },
    { label: t('financials'), href: '/about-us/financials' },
    { label: t('privacyPolicy'), href: '/privacy-policy' },
    { label: t('termsOfService'), href: '/terms-of-service' },
  ];

  return (
    <footer className="bg-ada-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/ada-logo-white.svg"
                alt="Asian Doula Alliance Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="font-outfit font-semibold text-sm tracking-wide">
                ASIAN DOULA ALLIANCE
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              {t('tagline')}
            </p>
          </div>

          {/* For Doulas */}
          <div>
            <h3 className="font-outfit font-semibold text-sm tracking-wider uppercase mb-4">
              {t('forDoulas')}
            </h3>
            <ul className="space-y-2.5">
              {doulaLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Families */}
          <div>
            <h3 className="font-outfit font-semibold text-sm tracking-wider uppercase mb-4">
              {t('forFamilies')}
            </h3>
            <ul className="space-y-2.5">
              {familyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Institutions */}
          <div>
            <h3 className="font-outfit font-semibold text-sm tracking-wider uppercase mb-4">
              {t('forInstitutions')}
            </h3>
            <ul className="space-y-2.5">
              {institutionLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="font-outfit font-semibold text-sm tracking-wider uppercase mb-4">
              {t('supportAndLegal')}
            </h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-outfit font-semibold text-sm tracking-wider uppercase mb-4">
              {t('contact')}
            </h3>
            <ul className="space-y-2.5 text-white/60 text-sm">
              <li>
                <a href="tel:+17142026501" className="hover:text-white transition-colors">
                  +1 (714) 202-6501
                </a>
              </li>
              <li>
                <a href="mailto:contact@asiandoula.org" className="hover:text-white transition-colors">
                  contact@asiandoula.org
                </a>
              </li>
              <li>{t('availableHours')}</li>
              <li className="pt-2 text-white/50 text-xs leading-relaxed">
                7515 Irvine Center Dr, Suite 110<br />
                Irvine, CA 92618
              </li>
              <li className="pt-2">
                <a
                  href="https://www.instagram.com/asian_doula"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  @asian_doula
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-10 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-outfit font-semibold text-sm">{t('newsletter')}</h3>
              <p className="text-white/60 text-xs mt-1">{t('newsletterDescription')}</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Bottom bar: nonprofit transparency */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-white/60 text-xs">
            <div className="space-y-1">
              <p>
                Asian Doula Alliance is a registered 501(c)(3) nonprofit organization.
                Donations are tax-deductible to the fullest extent allowed by law.
              </p>
              <p>
                EIN: <span className="font-mono">88-XXXXXXX</span> · See{' '}
                <Link href="/about-us/financials" className="underline hover:text-white">
                  Financials &amp; Accountability
                </Link>{' '}
                for our Form 990 and program impact details.
              </p>
            </div>
            <p className="shrink-0 md:text-right">
              &copy; {new Date().getFullYear()} {t('rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * KIT:FOOTER. One black footer on every page and record page: the logo
 * lockup, four link columns under 2px white rules, then the entity line.
 * Real routes only: KitC links that have no page yet (Verification letters,
 * Accessibility, Test security) are left out, as are its two unconfirmed lines
 * (the security line and the scope statement).
 * /exam-day is a new route from the build plan.
 */
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { CONTACT, ENTITY } from '@/lib/facts';

interface FooterColumn {
  label: string;
  links: { href: string; label: string }[];
}

export function SiteFooter() {
  const t = useTranslations('site.footer');
  const tBrand = useTranslations('site.brand');

  const columns: FooterColumn[] = [
    {
      label: t('programs'),
      links: [
        { href: '/certifications/postpartum-doula', label: t('postpartum') },
        { href: '/certifications/birth-doula', label: t('birth') },
        { href: '/certifications/ibclc', label: t('ibclc') },
        { href: '/programs#continuing-education', label: t('ce') },
        { href: '/programs#train-the-trainer', label: t('trainer') },
      ],
    },
    {
      label: t('registry'),
      links: [
        { href: '/verify', label: t('verify') },
        { href: '/for-doulas/code-of-conduct#report-a-concern', label: t('reportConcern') },
      ],
    },
    {
      label: t('ada'),
      links: [
        { href: '/about-us', label: t('about') },
        { href: '/about-us/board', label: t('governance') },
        { href: '/programs', label: t('education') },
        { href: '/support/contact', label: t('contact') },
      ],
    },
    {
      label: t('help'),
      links: [
        { href: '/exam-day', label: t('examDay') },
        { href: '/privacy-policy', label: t('privacy') },
        { href: '/terms-of-service', label: t('terms') },
      ],
    },
  ];

  const year = new Date().getFullYear();

  return (
    <footer className="flex-[1_0_auto] bg-ada2-black text-white print:hidden">
      <div className="ada2-wrap pt-12 pb-11 flex flex-col gap-9">
        <Link
          href="/"
          aria-label={tBrand('homeLabel')}
          className="self-start inline-flex items-center gap-3 min-h-[44px] text-white no-underline hover:text-white"
        >
          <span aria-hidden="true" className="flex-none flex items-center justify-center w-11 h-11 bg-ada2-indigo">
            <Image src="/images/2026/ada-mark-white.svg" alt="" width={34} height={34} unoptimized className="block" />
          </span>
          <span className="text-[19px] leading-6 font-semibold">Asian Doula Alliance</span>
        </Link>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-8">
          {columns.map((col) => (
            <nav key={col.label} aria-label={col.label} className="min-w-0 flex flex-col">
              <h2 className="m-0 pb-3 border-b-2 border-white text-[17px] leading-[22px] font-semibold text-white">
                {col.label}
              </h2>
              <ul className="pt-2 flex flex-col">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-flex items-center min-h-[44px] text-ada2-band-rule text-[15px] leading-5 no-underline hover:text-white hover:underline underline-offset-4"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-1.5 pt-6 border-t border-ada2-footer-rule text-[14px] leading-[21px]">
          <p className="m-0 text-white [font-variant-numeric:tabular-nums_lining-nums] [text-wrap:pretty]">
            {t('entity', {
              dba: ENTITY.dba,
              legalName: ENTITY.legalName,
              taxCode: ENTITY.taxCode,
              ein: ENTITY.ein,
              address: ENTITY.address.oneLine,
            })}
          </p>
          <p className="m-0 text-white [font-variant-numeric:tabular-nums_lining-nums]">
            <a href={`mailto:${CONTACT.email}`} className="text-white no-underline hover:underline underline-offset-4">
              {CONTACT.email}
            </a>
            {' · '}
            <a href={`tel:${CONTACT.phone.tel}`} className="text-white no-underline hover:underline underline-offset-4 whitespace-nowrap">
              {CONTACT.phone.display}
            </a>
          </p>
          <p className="m-0 text-ada2-kit-rule [text-wrap:pretty]">{t('copyright', { year: String(year), legalName: ENTITY.legalName })}</p>
        </div>
      </div>
    </footer>
  );
}

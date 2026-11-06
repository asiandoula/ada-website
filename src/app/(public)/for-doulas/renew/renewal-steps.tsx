/**
 * "How to renew": the live site's four renewal steps (check status, choose a
 * pathway, submit with the fee, receive the renewed certificate), restyled as
 * the Renew board's numbered ruled list. All steps are shown open (the board
 * is a flat list), so nothing is hidden behind a toggle. Server component.
 */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Pill } from '@/components/site';
import { CERTIFICATE, CONTACT, RENEWAL, usd } from '@/lib/facts';
import { DocSection, StepList, inlineLink, registryInlineLink, strongClass } from '../_components/page-kit';

const mailto = `mailto:${CONTACT.email}`;
const tel = `tel:${CONTACT.phone.tel}`;

export function RenewalSteps() {
  const t = useTranslations('renew.steps');

  const nowrap = (c: React.ReactNode) => <span className="whitespace-nowrap">{c}</span>;
  const strong = (c: React.ReactNode) => <strong className={strongClass}>{c}</strong>;
  const mail = (c: React.ReactNode) => (
    <a href={mailto} className={`${inlineLink} whitespace-nowrap`}>
      {c}
    </a>
  );
  const telLink = (c: React.ReactNode) => (
    <a href={tel} className={`${inlineLink} whitespace-nowrap`}>
      {c}
    </a>
  );
  const contactArgs = { email: CONTACT.email, phone: CONTACT.phone.display };

  const steps = [
    {
      title: t('s1Title'),
      body: (
        <>
          <p className="m-0">{t.rich('s1Body', { nowrap })}</p>
          <p className="m-0 flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/verify" className={registryInlineLink}>
              {t('s1Verify')}
            </Link>
            <Link href="/portal" className={`${inlineLink} font-semibold`}>
              {t('s1Portal')}
            </Link>
          </p>
        </>
      ),
    },
    {
      title: t('s2Title'),
      body: (
        <p className="m-0">
          {t.rich('s2Body', {
            link: (c) => (
              <a href="#pathways" className={`${inlineLink} whitespace-nowrap`}>
                {c}
              </a>
            ),
          })}
        </p>
      ),
    },
    {
      title: t('s3Title'),
      body: (
        <>
          <p className="m-0">{t.rich('s3Body', { strong, fee: usd(RENEWAL.feeUsd) })}</p>
          <p className="m-0">{t.rich('s3Contact', { ...contactArgs, mail, tel: telLink })}</p>
        </>
      ),
    },
    {
      title: t('s4Title'),
      body: (
        <>
          <p className="m-0">{t.rich('s4Body', { strong, years: CERTIFICATE.validityYears })}</p>
          <div className="flex flex-col gap-1">
            <p className="m-0 font-semibold text-ada2-ink">{t('s4ReceiveTitle')}</p>
            <ul className="m-0 pl-5 list-disc marker:text-ada2-muted flex flex-col gap-0.5">
              <li>{t('s4Item1')}</li>
              <li>{t('s4Item2')}</li>
              <li>{t('s4Item3')}</li>
            </ul>
          </div>
        </>
      ),
    },
  ];

  return (
    <DocSection id="steps" title={t('title')}>
      <StepList items={steps} labelledBy="steps-title" />
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Pill href={mailto} variant="primary">
          {t('action')}
        </Pill>
        <p className="m-0 text-[15px] leading-[22px] text-ada2-body [text-wrap:pretty]">
          {t.rich('questions', { ...contactArgs, mail, tel: telLink })}
        </p>
      </div>
    </DocSection>
  );
}

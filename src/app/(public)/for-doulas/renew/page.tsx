import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ArrowLink, Breadcrumb, CtaBox, StatusTag, type StatusKind } from '@/components/site';
import { CERTIFICATE, CONTACT, EXAM, RENEWAL, usd } from '@/lib/facts';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import {
  DocSection,
  InnerPage,
  OnThisPage,
  PageHead,
  Photo,
  Rows,
  DataTable,
  inlineLink,
} from '../_components/page-kit';
import { RenewalSteps } from './renewal-steps';

/**
 * Pathway A asks for this many reference letters (live renewal steps:
 * "Submit 3 professional reference letters"). Not yet in facts.ts; passed to
 * the message as an argument so no number is typed into copy.
 */
const REFERENCE_LETTERS = 3;


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('renew.meta');
  const description = t('description', { years: CERTIFICATE.validityYears, fee: usd(RENEWAL.feeUsd) });
  return {
    title: t('title'),
    description,
    openGraph: { title: t('title'), description, images: [{ url: '/images/hero.webp', width: 1200, height: 630 }] },
  };
}

export default async function RenewPage() {
  const t = await getTranslations('renew');
  const tSite = await getTranslations('site');

  const fee = usd(RENEWAL.feeUsd);
  const years = CERTIFICATE.validityYears;

  const facts = [
    { label: t('facts.period'), value: t('facts.periodValue', { years }) },
    { label: t('facts.fee'), value: fee },
    { label: t('facts.pathways'), value: t('facts.pathwaysValue') },
  ];

  const nowrap = (c: React.ReactNode) => <span className="whitespace-nowrap">{c}</span>;

  /** Statuses a credential or certificate can carry on the public record. */
  const statuses: { kind: StatusKind; text: string }[] = [
    { kind: 'active', text: t('status.active') },
    { kind: 'superseded', text: t('status.superseded') },
    { kind: 'expired', text: t('status.expired') },
    { kind: 'suspended', text: t('status.suspended') },
    { kind: 'revoked', text: t('status.revoked') },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: tSite('audience.doulas'), path: '/portal' },
              { name: t('breadcrumb'), path: '/for-doulas/renew' },
            ])
          ),
        }}
      />
      <Breadcrumb items={[{ label: tSite('audience.doulas'), href: '/portal' }, { label: t('breadcrumb') }]} />

      <InnerPage
        aside={
          <CtaBox
            title={t('cta.title')}
            action={{ href: `mailto:${CONTACT.email}`, label: t('cta.action') }}
          />
        }
      >
        <PageHead title={t('title')} lead={t('lead')}>
          <dl
            aria-label={t('facts.label')}
            className="mt-2 mb-0 flex flex-wrap gap-x-12 gap-y-4 py-4 border-t-2 border-ada2-ink border-b border-b-ada2-hairline [font-variant-numeric:tabular-nums_lining-nums]"
          >
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col gap-0.5">
                <dt className="text-[14px] leading-5 font-semibold text-ada2-muted">{f.label}</dt>
                <dd className="m-0 text-[20px] leading-7 font-semibold text-ada2-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        </PageHead>

        <OnThisPage
          title={t('onThisPage')}
          items={[
            { href: '#need', label: t('need.title') },
            { href: '#pathways', label: t('pathways.title') },
            { href: '#steps', label: t('steps.title') },
            { href: '#status', label: t('status.title') },
          ]}
        />

        <DocSection id="need" title={t('need.title')}>
          <Photo
            src="/images/2026/ada-trainer-slide.jpg"
            alt={t('need.photoAlt')}
            caption={t('need.photoCaption')}
            aspect="5 / 2"
            position="50% 12%"
            sizes="(min-width: 1120px) 66vw, 100vw"
          />
          <Rows
            rows={[
              { label: t('need.doulaId'), value: t.rich('need.doulaIdValue', { nowrap }) },
              { label: t('need.email'), value: t('need.emailValue') },
              {
                label: t('need.pathway'),
                value: t.rich('need.pathwayValue', {
                  link: (c) => (
                    <a href="#pathways" className={`${inlineLink} whitespace-nowrap`}>
                      {c}
                    </a>
                  ),
                }),
              },
              { label: t('need.fee'), value: t('need.feeValue', { fee }) },
            ]}
          />
        </DocSection>

        <DocSection id="pathways" title={t('pathways.title')} intro={<p className="m-0">{t('pathways.intro')}</p>}>
          <DataTable
            caption={t('pathways.caption')}
            minWidth={680}
            columns={[
              { label: t('pathways.colPathway'), className: 'w-[24%]' },
              { label: t('pathways.colWhat'), className: 'w-[40%]' },
              { label: t('pathways.colDetails') },
            ]}
            rows={[
              [
                t('pathways.aName'),
                t('pathways.aWhat', { count: REFERENCE_LETTERS }),
                <DetailList
                  key="a"
                  title={t('pathways.aDetailsTitle')}
                  items={[t('pathways.aItem1'), t('pathways.aItem2'), t('pathways.aItem3')]}
                />,
              ],
              [
                t('pathways.bName'),
                t('pathways.bWhat'),
                <DetailList
                  key="b"
                  title={t('pathways.bDetailsTitle')}
                  items={[
                    t('pathways.bItem1'),
                    t('pathways.bItem2'),
                    t('pathways.bItem3', { pass: EXAM.passScore, max: EXAM.maxScore }),
                  ]}
                />,
              ],
            ]}
          />
        </DocSection>

        <RenewalSteps />

        <DocSection id="status" title={t('status.title')} intro={<p className="m-0">{t('status.intro')}</p>}>
          <dl className="m-0 flex flex-col border-t-2 border-ada2-ink">
            {statuses.map((s) => (
              <div key={s.kind} className="flex flex-wrap items-baseline gap-x-6 gap-y-1.5 py-3 border-b border-ada2-hairline">
                <dt className="flex-[0_0_200px]">
                  <StatusTag status={s.kind} />
                </dt>
                <dd className="flex-[1_1_300px] min-w-0 m-0 [text-wrap:pretty]">{s.text}</dd>
              </div>
            ))}
          </dl>
          <ArrowLink href="/verify" tone="registry" className="self-start">
            {t('status.link')}
          </ArrowLink>
        </DocSection>
      </InnerPage>
    </>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="m-0 font-semibold text-ada2-ink">{title}</p>
      <ul className="m-0 pl-5 list-disc marker:text-ada2-muted flex flex-col gap-0.5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

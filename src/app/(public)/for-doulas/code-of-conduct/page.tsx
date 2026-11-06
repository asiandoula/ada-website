import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Breadcrumb, CtaBox, Pill } from '@/components/site';
import { CONTACT } from '@/lib/facts';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import {
  DocSection,
  InnerPage,
  OnThisPage,
  PageHead,
  Photo,
  PrincipleList,
  Rows,
  DataTable,
  h3Class,
  inlineLink,
  registryInlineLink,
} from '../_components/page-kit';

const mailto = `mailto:${CONTACT.email}`;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('standards.meta');
  return {
    title: t('title'),
    description: t('description'),
    openGraph: { title: t('title'), description: t('description'), images: [{ url: '/images/hero.webp', width: 1200, height: 630 }] },
  };
}

export default async function CodeOfConductPage() {
  const t = await getTranslations('standards');
  const tSite = await getTranslations('site');

  // The ADA Code of Conduct as published on the live site: 14 principles in three groups.
  const groups = [
    {
      title: t('conduct.professionalTitle'),
      items: [
        { title: t('conduct.competency'), text: t('conduct.competencyText') },
        { title: t('conduct.scope'), text: t('conduct.scopeText') },
        { title: t('conduct.certifications'), text: t('conduct.certificationsText') },
        { title: t('conduct.communication'), text: t('conduct.communicationText') },
      ],
    },
    {
      title: t('conduct.clientCareTitle'),
      items: [
        { title: t('conduct.clientCentered'), text: t('conduct.clientCenteredText') },
        { title: t('conduct.consent'), text: t('conduct.consentText') },
        { title: t('conduct.confidentiality'), text: t('conduct.confidentialityText') },
        { title: t('conduct.nonDiscrimination'), text: t('conduct.nonDiscriminationText') },
        { title: t('conduct.cultural'), text: t('conduct.culturalText') },
      ],
    },
    {
      title: t('conduct.ethicsTitle'),
      items: [
        { title: t('conduct.integrity'), text: t('conduct.integrityText') },
        { title: t('conduct.conflict'), text: t('conduct.conflictText') },
        { title: t('conduct.boundaries'), text: t('conduct.boundariesText') },
        { title: t('conduct.reporting'), text: t('conduct.reportingText') },
        { title: t('conduct.accountability'), text: t('conduct.accountabilityText') },
      ],
    },
  ];
  const principleCount = groups.reduce((n, g) => n + g.items.length, 0);
  const starts = groups.map((_, i) => 1 + groups.slice(0, i).reduce((n, g) => n + g.items.length, 0));

  const mail = (c: React.ReactNode) => (
    <a href={mailto} className={`${inlineLink} whitespace-nowrap`}>
      {c}
    </a>
  );

  const concerns = [
    { concern: t('report.breach'), reviewed: t('report.yes'), where: t.rich('report.breachWhere', { email: CONTACT.email, mail }) },
    { concern: t('report.dispute'), reviewed: t('report.no'), where: t('report.disputeWhere') },
    {
      concern: t('report.notCertified'),
      reviewed: t('report.no'),
      where: t.rich('report.notCertifiedWhere', {
        link: (c) => (
          <Link href="/verify" className={registryInlineLink}>
            {c}
          </Link>
        ),
      }),
    },
    { concern: t('report.medical'), reviewed: t('report.no'), where: t('report.medicalWhere') },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: tSite('audience.about'), path: '/about-us' },
              { name: t('breadcrumb'), path: '/for-doulas/code-of-conduct' },
            ])
          ),
        }}
      />
      <Breadcrumb items={[{ label: tSite('audience.about'), href: '/about-us' }, { label: t('breadcrumb') }]} />

      <InnerPage aside={<CtaBox title={t('cta.title')} action={{ href: '#report-a-concern', label: t('cta.action') }} />}>
        <PageHead title={t('title')} lead={t('lead')} />

        <OnThisPage
          title={t('onThisPage')}
          items={[
            { href: '#conduct', label: t('conduct.title') },
            { href: '#scope', label: t('scope.title') },
            { href: '#report-a-concern', label: t('report.title') },
          ]}
        />

        <DocSection
          id="conduct"
          title={t('conduct.title')}
          className="gap-6"
          intro={
            <>
              <p className="m-0">{t('conduct.intro')}</p>
              <p className="m-0">{t('conduct.count', { count: principleCount })}</p>
            </>
          }
        >
          <Photo
            src="/images/2026/ada-care-focus.jpg"
            alt={t('conduct.photoAlt')}
            caption={t('conduct.photoCaption')}
            aspect="2 / 1"
            position="50% 40%"
            sizes="(min-width: 1120px) 66vw, 100vw"
          />
          {groups.map((g, i) => (
            <div key={i} className="flex flex-col gap-3 pt-2">
              <h3 className={h3Class}>{g.title}</h3>
              <PrincipleList start={starts[i]} items={g.items} />
            </div>
          ))}
          <p className="m-0 font-semibold text-ada2-ink [text-wrap:pretty]">{t('conduct.enforcement')}</p>
        </DocSection>

        <DocSection id="scope" title={t('scope.title')} intro={<p className="m-0">{t('scope.intro')}</p>}>
          <Rows
            labelWidth={160}
            rows={[
              { label: t('scope.postpartum'), value: t('scope.postpartumText') },
              { label: t('scope.birth'), value: t('scope.birthText') },
              { label: t('scope.medical'), value: t('scope.medicalText') },
            ]}
          />
        </DocSection>

        <DocSection
          id="report-a-concern"
          title={t('report.title')}
          intro={<p className="m-0">{t.rich('report.intro', { email: CONTACT.email, mail })}</p>}
        >
          <DataTable
            caption={t('report.caption')}
            minWidth={620}
            columns={[
              { label: t('report.colConcern'), className: 'w-[44%]' },
              { label: t('report.colReviewed'), className: 'w-[13%]', cellClassName: 'font-semibold text-ada2-ink' },
              { label: t('report.colWhere') },
            ]}
            rows={concerns.map((c) => [c.concern, c.reviewed, c.where])}
          />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Pill href={mailto} variant="secondary">
              {t('report.action')}
            </Pill>
            <p className="m-0 max-w-[640px] text-[15px] leading-[22px] text-ada2-muted [text-wrap:pretty]">{t('report.note')}</p>
          </div>
        </DocSection>
      </InnerPage>
    </>
  );
}

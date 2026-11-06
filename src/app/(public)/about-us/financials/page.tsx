/**
 * /about-us/financials: Financial information (canvas Financials.dc.html).
 *
 * The live facts and documents only. Every document is "on request" from the
 * finance office (no filing is published as a file on this site yet), so each
 * row has a Request link and none has a download. The live page's planned
 * allocation percentages and impact counts are not in src/lib/facts.ts and
 * are left out; the spending areas stay as text.
 */
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ArrowLink, Breadcrumb, CtaBox, inlineLinkClassName, pillClassName } from '@/components/site';
import { ENTITY } from '@/lib/facts';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import {
  DataTable,
  DocHead,
  DocLayout,
  DocLinkList,
  DocNote,
  DocSection,
  DocText,
  OnThisPage,
  Rows,
  RuledList,
  tdClass,
  thRowClass,
} from '../_components/doc';
import { DIRECTORS, FINANCE, mailto } from '../_lib/governance';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('financials');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: '/about-us/financials' },
    openGraph: { title: t('metaTitle'), description: t('metaDescription') },
  };
}

export default async function FinancialsPage() {
  const t = await getTranslations('financials');
  const form990 = FINANCE.form990;
  const fy = String(FINANCE.firstForm990FiscalYear);

  const documents: { name: string; mark?: string; covers: string }[] = [
    { name: form990, mark: '†', covers: t('documents.form990Covers', { year: fy }) },
    { name: t('documents.irs'), covers: t('documents.irsCovers', { taxCode: ENTITY.taxCode }) },
    { name: t('documents.charitableTrusts'), covers: t('documents.charitableTrustsCovers') },
    { name: t('documents.bylaws'), covers: t('documents.bylawsCovers') },
    { name: t('documents.coi'), covers: t('documents.coiCovers') },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: t('breadcrumbAbout'), path: '/about-us' },
              { name: t('breadcrumb'), path: '/about-us/financials' },
            ])
          ),
        }}
      />
      <Breadcrumb items={[{ label: t('breadcrumbAbout'), href: '/about-us' }, { label: t('breadcrumb') }]} />

      <DocLayout
        aside={
          <CtaBox
            title={t('cta.title')}
            action={{ href: mailto(FINANCE.email, t('cta.subject')), label: t('cta.action') }}
          />
        }
      >
        <DocHead title={t('title')} lead={t('lead')} />

        <OnThisPage
          title={t('toc.title')}
          items={[
            { href: '#tax-status', label: t('toc.taxStatus') },
            { href: '#documents', label: t('toc.documents', { form990 }) },
            { href: '#donations', label: t('toc.donations') },
            { href: '#accountability', label: t('toc.accountability') },
          ]}
        />

        <DocSection id="tax-status" title={t('tax.title')}>
          <Rows
            labelWidth={180}
            rows={[
              { label: t('tax.legalName'), value: t('tax.legalNameValue', { legalName: ENTITY.legalName, dba: ENTITY.dba }) },
              { label: t('tax.organization'), value: t('tax.organizationValue', { year: String(FINANCE.incorporatedYear) }) },
              { label: t('tax.status'), value: t('tax.statusValue', { taxCode: ENTITY.taxCode }) },
              { label: t('tax.ein'), value: <strong className="font-semibold text-ada2-ink">{ENTITY.ein}</strong> },
              { label: t('tax.donations'), value: t('tax.donationsValue') },
              { label: t('tax.office'), value: <span lang="en">{ENTITY.address.oneLine}</span> },
            ]}
          />
        </DocSection>

        <DocSection id="documents" title={t('documents.title', { form990 })} gap="sm">
          <DocText>{t('documents.intro')}</DocText>
          <DataTable
            caption={t('documents.caption')}
            minWidth={720}
            columns={[
              { label: t('documents.colDocument') },
              { label: t('documents.colCovers') },
              { label: t('documents.colStatus') },
              { label: t('documents.colAction'), srOnly: true, align: 'right' },
            ]}
          >
            {documents.map((d, i) => (
              <tr key={i}>
                <th scope="row" className={`${thRowClass} align-middle`}>
                  {d.name}
                  {d.mark}
                </th>
                <td className={`${tdClass} align-middle`}>{d.covers}</td>
                <td className={`${tdClass} align-middle font-semibold text-ada2-tag-text whitespace-nowrap`}>
                  {t('documents.onRequest')}
                </td>
                <td className="align-middle py-2 px-4 text-right">
                  <a
                    href={mailto(FINANCE.email, t('documents.requestSubject', { document: d.name }))}
                    aria-label={t('documents.requestLabel', { document: d.name })}
                    className={pillClassName('secondary', 'sm')}
                  >
                    {t('documents.request')}
                  </a>
                </td>
              </tr>
            ))}
          </DataTable>
          <div className="flex flex-col gap-0.5">
            <DocNote>
              {t.rich('documents.noteRequests', {
                days: FINANCE.replyBusinessDays,
                mail: () => (
                  <a href={mailto(FINANCE.email)} className={inlineLinkClassName}>
                    {FINANCE.email}
                  </a>
                ),
              })}
            </DocNote>
            <DocNote>{t('documents.note990', { form990 })}</DocNote>
          </div>
        </DocSection>

        <DocSection id="donations" title={t('donations.title')}>
          <DocText>{t('donations.intro', { form990 })}</DocText>
          <Rows
            labelWidth={180}
            rows={[
              { label: t('donations.certification'), value: t('donations.certificationValue') },
              { label: t('donations.scholarships'), value: t('donations.scholarshipsValue') },
              { label: t('donations.community'), value: t('donations.communityValue') },
              { label: t('donations.administration'), value: t('donations.administrationValue') },
              { label: t('donations.privacy'), value: t('donations.privacyValue') },
            ]}
          />
          <ArrowLink href="/donate" className="self-start">
            {t('donations.link')}
          </ArrowLink>
        </DocSection>

        <DocSection id="accountability" title={t('accountability.title')}>
          <RuledList
            labelledBy="accountability-title"
            items={[
              t('accountability.review'),
              t('accountability.form990', { form990, year: fy }),
              t('accountability.board'),
              t('accountability.coi'),
              t('accountability.policies'),
            ]}
          />
        </DocSection>

        <DocLinkList
          id="more-title"
          title={t('more.title')}
          items={[
            { href: '/about-us/board', label: t('more.boardLabel'), description: t('more.boardBody', { count: DIRECTORS.length }) },
            { href: '/about-us', label: t('more.governanceLabel'), description: t('more.governanceBody') },
          ]}
        />
      </DocLayout>
    </>
  );
}

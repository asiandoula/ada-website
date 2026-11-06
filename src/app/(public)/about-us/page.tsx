/**
 * /about-us: Governance (canvas Governance.dc.html).
 *
 * Built from facts only: ENTITY/CONTACT/EXAM in src/lib/facts.ts and the live
 * board, election and financials pages (about-us/_lib/governance.ts). The
 * board's unconfirmed rows (effective date, entity number, officers,
 * relationships, registry email) are left out, and the training partner is
 * not named: the live site does not name it in any disclosure.
 */
import type { Metadata } from 'next';
import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowLink, Breadcrumb, CtaBox, inlineLinkClassName } from '@/components/site';
import { CONTACT, ENTITY, EXAM } from '@/lib/facts';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { ContactBand } from '../for-families/_components/contact-band';
import { BoardComposition, BoardTable } from './_components/board-table';
import {
  DataTable,
  DocH3,
  DocHead,
  DocLayout,
  DocNote,
  DocSection,
  DocText,
  OnThisPage,
  Rows,
  RuledList,
  tdClass,
  thRowClass,
} from './_components/doc';
import { asLocale, formatMonth } from './_lib/format';
import { DIRECTORS, ELECTION, FINANCE, PHOTO_MONTH, mailto } from './_lib/governance';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: '/about-us' },
    openGraph: { title: t('metaTitle'), description: t('metaDescription') },
  };
}

export default async function AboutUsPage() {
  const t = await getTranslations('about');
  const locale = asLocale(await getLocale());
  const financeArgs = { form990: FINANCE.form990 };

  const documents = [
    { name: FINANCE.form990, status: t('documents.form990Status', { year: String(FINANCE.firstForm990FiscalYear) }) },
    { name: t('documents.irs'), status: t('documents.onRequest') },
    { name: t('documents.charitableTrusts'), status: t('documents.onRequest') },
    { name: t('documents.bylaws'), status: t('documents.onRequest') },
    { name: t('documents.coi'), status: t('documents.onRequest') },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([{ name: t('breadcrumb'), path: '/about-us' }])),
        }}
      />
      <Breadcrumb items={[{ label: t('breadcrumb') }]} />

      <DocLayout
        aside={
          <CtaBox
            title={t('cta.title', financeArgs)}
            action={{ href: mailto(FINANCE.email, t('cta.subject')), label: t('cta.action') }}
          />
        }
      >
        <DocHead title={t('title')} lead={t('lead')} />

        <OnThisPage
          title={t('toc.title')}
          items={[
            { href: '#does', label: t('toc.does') },
            { href: '#entity', label: t('toc.entity') },
            { href: '#board', label: t('toc.board') },
            { href: '#independence', label: t('toc.independence') },
            { href: '#documents', label: t('toc.documents') },
            { href: '#contact', label: t('toc.contact') },
          ]}
        />

        <DocSection id="does" title={t('does.title')} gap="lg">
          <figure className="m-0 flex flex-col gap-2.5">
            <Image
              src="/images/2026/ada-trainer-slide.jpg"
              alt={t('does.photoAlt')}
              width={1600}
              height={1067}
              sizes="(min-width: 1344px) 900px, (min-width: 1000px) 66vw, 100vw"
              className="block w-full h-auto aspect-[2/1] object-cover"
              style={{ objectPosition: '50% 45%' }}
            />
            <figcaption className="text-[14px] leading-5 text-ada2-muted">
              {t('does.photoCaption', { date: formatMonth(PHOTO_MONTH, locale) })}
            </figcaption>
          </figure>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-x-12 gap-y-8 items-start">
            <div className="flex flex-col gap-3 min-w-0">
              <DocH3 id="does-yes">{t('does.doesTitle')}</DocH3>
              <RuledList
                labelledBy="does-yes"
                items={[t('does.does1'), t('does.does2'), t('does.does3'), t('does.does4'), t('does.does5')]}
              />
            </div>
            <div className="flex flex-col gap-3 min-w-0">
              <DocH3 id="does-no">{t('does.doesNotTitle')}</DocH3>
              <RuledList labelledBy="does-no" items={[t('does.doesNot1'), t('does.doesNot2')]} />
            </div>
          </div>
          <ArrowLink href="/for-doulas/code-of-conduct" className="self-start">
            {t('does.link')}
          </ArrowLink>
        </DocSection>

        <DocSection id="entity" title={t('entity.title')}>
          <Rows
            rows={[
              { label: t('entity.legalName'), value: <span lang="en">{ENTITY.legalName}</span> },
              { label: t('entity.operatingName'), value: t('entity.operatingNameValue', { dba: ENTITY.dba }) },
              { label: t('entity.type'), value: t('entity.typeValue') },
              { label: t('entity.incorporated'), value: t('entity.incorporatedValue', { year: String(FINANCE.incorporatedYear) }) },
              { label: t('entity.taxStatus'), value: t('entity.taxStatusValue', { taxCode: ENTITY.taxCode }) },
              { label: t('entity.ein'), value: ENTITY.ein },
              { label: t('entity.address'), value: <span lang="en">{ENTITY.address.oneLine}</span> },
            ]}
          />
        </DocSection>

        <DocSection id="board" title={t('board.title')}>
          <DocText>{t('board.intro', { count: DIRECTORS.length })}</DocText>
          <BoardTable />
          <BoardComposition
            extra={[{ label: t('board.chosen'), value: t('board.chosenValue', { years: ELECTION.termYears }) }]}
          />
          <ArrowLink href="/about-us/board" className="self-start">
            {t('board.link')}
          </ArrowLink>
        </DocSection>

        <DocSection id="independence" title={t('independence.title')}>
          <DocText>{t('independence.body')}</DocText>
          <Rows
            rows={[
              { label: t('independence.curriculum'), value: t('independence.curriculumValue') },
              { label: t('independence.training'), value: t('independence.trainingValue') },
              {
                label: t('independence.exam'),
                value: t('independence.examValue', { written: EXAM.writtenMinutes, practical: EXAM.practicalMinutes }),
              },
              { label: t('independence.registry'), value: t('independence.registryValue') },
            ]}
          />
          <ArrowLink href="/verify" tone="registry" className="self-start">
            {t('independence.link')}
          </ArrowLink>
        </DocSection>

        <DocSection id="documents" title={t('documents.title')} gap="sm">
          <DataTable
            caption={t('documents.caption')}
            minWidth={0}
            columns={[{ label: t('documents.colDocument') }, { label: t('documents.colStatus') }]}
          >
            {documents.map((d, i) => (
              <tr key={i}>
                <th scope="row" className={thRowClass}>
                  {d.name}
                </th>
                <td className={tdClass}>{d.status}</td>
              </tr>
            ))}
          </DataTable>
          <DocNote>
            {t.rich('documents.note', {
              days: FINANCE.replyBusinessDays,
              mail: () => (
                <a href={mailto(FINANCE.email)} className={inlineLinkClassName}>
                  {FINANCE.email}
                </a>
              ),
            })}
          </DocNote>
          <ArrowLink href="/about-us/financials" className="self-start">
            {t('documents.link')}
          </ArrowLink>
        </DocSection>

        <DocSection id="contact" title={t('contact.title')}>
          <Rows
            rows={[
              {
                label: t('contact.general'),
                value: (
                  <>
                    <a href={mailto(CONTACT.email)} className={inlineLinkClassName}>
                      {CONTACT.email}
                    </a>
                    {' · '}
                    <a href={`tel:${CONTACT.phone.tel}`} className={`${inlineLinkClassName} whitespace-nowrap`}>
                      {CONTACT.phone.display}
                    </a>
                  </>
                ),
              },
              {
                label: t('contact.finance'),
                value: (
                  <a href={mailto(FINANCE.email)} className={inlineLinkClassName}>
                    {FINANCE.email}
                  </a>
                ),
              },
              { label: t('contact.mail'), value: <span lang="en">{`${ENTITY.dba}, ${ENTITY.address.oneLine}`}</span> },
            ]}
          />
        </DocSection>
      </DocLayout>

      <ContactBand id="about-contact" />
    </>
  );
}

/**
 * Board of directors and elections (canvas Board.dc.html), rendered at
 * /about-us/board and /about-us/board/election.
 *
 * People, roles, bios and the election process come from the live board and
 * election pages. The 2026 election timeline is not shown: all of its dates
 * are past, and no next election date is published.
 */
import { getTranslations } from 'next-intl/server';
import { ArrowLink, Breadcrumb, CtaBox, Pill, inlineLinkClassName } from '@/components/site';
import { CONTACT, ENTITY } from '@/lib/facts';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { ContactBand } from '../../../for-families/_components/contact-band';
import { BoardComposition, BoardTable } from '../../_components/board-table';
import { DocH3, DocHead, DocLayout, DocSection, DocText, OnThisPage, Rows } from '../../_components/doc';
import { BIO_YEARS, DIRECTORS, ELECTION, FINANCE, mailto, type Director, type DirectorRole } from '../../_lib/governance';

export async function BoardView({ path }: { path: '/about-us/board' | '/about-us/board/election' }) {
  const t = await getTranslations('board');

  const role: Record<DirectorRole, string> = {
    founderEmeritus: t('roles.founderEmeritus'),
    president: t('roles.president'),
    independentDirector: t('roles.independentDirector'),
    director: t('roles.director'),
  };
  const person: Record<Director['id'], { location: string; bio: string }> = {
    qiWang: { location: t('people.qiWang.location'), bio: t('people.qiWang.bio', { year: String(BIO_YEARS.qiWang) }) },
    sethMeng: { location: t('people.sethMeng.location'), bio: t('people.sethMeng.bio', { year: String(BIO_YEARS.sethMeng) }) },
    wesleyLau: { location: t('people.wesleyLau.location'), bio: t('people.wesleyLau.bio') },
    minyuZhang: { location: t('people.minyuZhang.location'), bio: t('people.minyuZhang.bio') },
    veronicaTseng: { location: t('people.veronicaTseng.location'), bio: t('people.veronicaTseng.bio') },
    miaLiu: { location: t('people.miaLiu.location'), bio: t('people.miaLiu.bio') },
  };

  const steps = [
    { title: t('election.step1Title'), body: t('election.step1Body', { months: ELECTION.minCertifiedMonths }) },
    { title: t('election.step2Title'), body: t('election.step2Body') },
    { title: t('election.step3Title'), body: t('election.step3Body') },
    { title: t('election.step4Title'), body: t('election.step4Body', { days: ELECTION.handoverDays }) },
  ];

  const nominationHref = mailto(CONTACT.email, t('election.nominateSubject'));
  const crumbs = [
    { name: t('breadcrumbAbout'), path: '/about-us' },
    { name: t('breadcrumb'), path: '/about-us/board' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(path === '/about-us/board' ? crumbs : [...crumbs, { name: t('election.title'), path }])
          ),
        }}
      />
      <Breadcrumb items={[{ label: t('breadcrumbAbout'), href: '/about-us' }, { label: t('breadcrumb') }]} />

      <DocLayout
        aside={<CtaBox title={t('cta.title')} action={{ href: '#nominate', label: t('cta.action') }} />}
      >
        <DocHead
          title={t('title')}
          lead={t('lead')}
          meta={t('meta', { legalName: ENTITY.legalName, dba: ENTITY.dba })}
        />

        <OnThisPage
          title={t('toc.title')}
          items={[
            { href: '#the-board', label: t('toc.board') },
            { href: '#directors', label: t('toc.directors') },
            { href: '#election', label: t('toc.election') },
            { href: '#conflicts', label: t('toc.conflicts') },
          ]}
        />

        <DocSection id="the-board" title={t('boardSection.title')}>
          <DocText>{t('boardSection.intro', { count: DIRECTORS.length })}</DocText>
          <BoardTable />
          <BoardComposition labelWidth={200} />
        </DocSection>

        <DocSection id="directors" title={t('directors.title')}>
          <ul className="m-0 p-0 list-none flex flex-col border-t-2 border-ada2-ink">
            {DIRECTORS.map((d) => (
              <li key={d.id} className="flex flex-wrap gap-x-6 gap-y-1.5 py-[18px] border-b border-ada2-hairline">
                <div className="flex-[0_0_200px] max-w-full flex flex-col gap-0.5">
                  <h3 lang="en" className="m-0 text-[19px] leading-7 font-semibold text-ada2-ink">
                    {d.name}
                  </h3>
                  <p className="m-0 text-[15px] leading-[22px] text-ada2-muted">
                    {role[d.role]}
                    <br />
                    {person[d.id].location}
                  </p>
                </div>
                <p className="flex-[1_1_300px] min-w-0 m-0 text-ada2-body [text-wrap:pretty]">{person[d.id].bio}</p>
              </li>
            ))}
          </ul>
        </DocSection>

        <DocSection id="election" title={t('election.title')}>
          <DocText>{t('election.intro', { years: ELECTION.termYears })}</DocText>
          <ol aria-labelledby="election-title" className="m-0 p-0 list-none flex flex-col border-t-2 border-ada2-ink">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-5 pt-4 pb-[18px] border-b border-ada2-hairline">
                <span
                  aria-hidden="true"
                  className="flex-none w-6 text-[22px] leading-7 font-light text-ada2-ink [font-variant-numeric:tabular-nums_lining-nums]"
                >
                  {i + 1}
                </span>
                <div className="flex-auto min-w-0 flex flex-col gap-1">
                  <h3 className="m-0 text-[19px] leading-7 font-semibold text-ada2-ink [text-wrap:balance]">{s.title}</h3>
                  <p className="m-0 text-ada2-body [text-wrap:pretty]">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <DocH3 id="eligible-title" className="mt-4">
            {t('election.eligibleTitle')}
          </DocH3>
          <Rows
            labelWidth={160}
            rows={[
              {
                label: t('election.certification'),
                value: t('election.certificationValue', { months: ELECTION.minCertifiedMonths }),
              },
              {
                label: t('election.standing'),
                value: (
                  <>
                    {t('election.standingValue')}{' '}
                    <a
                      href="/verify"
                      className="text-ada2-blossom font-semibold underline underline-offset-[3px] whitespace-nowrap hover:text-ada2-blossom-hover"
                    >
                      {t('election.standingLink')}
                    </a>
                  </>
                ),
              },
              {
                label: t('election.commitment'),
                value: t('election.commitmentValue', {
                  years: ELECTION.termYears,
                  percent: ELECTION.minAttendancePercent,
                }),
              },
              { label: t('election.term'), value: t('election.termValue', { years: ELECTION.termYears }) },
            ]}
          />

          <div id="nominate" className="flex flex-col gap-4 pt-4 scroll-mt-6">
            <DocH3>{t('election.nominateTitle')}</DocH3>
            <DocText>
              {t.rich('election.nominateBody', {
                subject: t('election.nominateSubject'),
                mail: () => (
                  <a href={nominationHref} className={inlineLinkClassName}>
                    {CONTACT.email}
                  </a>
                ),
              })}
            </DocText>
            <Pill href={nominationHref} variant="secondary" className="self-start">
              {t('election.nominateAction')}
            </Pill>
          </div>
        </DocSection>

        <DocSection id="conflicts" title={t('conflicts.title')}>
          <Rows
            labelWidth={160}
            rows={[
              { label: t('conflicts.everyYear'), value: t('conflicts.everyYearValue') },
              { label: t('conflicts.abstaining'), value: t('conflicts.abstainingValue') },
              { label: t('conflicts.relatedParties'), value: t('conflicts.relatedPartiesValue') },
              {
                label: t('conflicts.policy'),
                value: t.rich('conflicts.policyValue', {
                  mail: () => (
                    <a href={mailto(FINANCE.email, t('conflicts.policySubject'))} className={inlineLinkClassName}>
                      {FINANCE.email}
                    </a>
                  ),
                }),
              },
              {
                label: t('conflicts.accountability'),
                value: t('conflicts.accountabilityValue', {
                  form990: FINANCE.form990,
                  year: String(FINANCE.firstForm990FiscalYear),
                }),
              },
            ]}
          />
          <div className="flex flex-wrap gap-x-8 gap-y-1">
            <ArrowLink href="/about-us/financials">{t('conflicts.financialsLink')}</ArrowLink>
            <ArrowLink href="/about-us">{t('conflicts.governanceLink')}</ArrowLink>
          </div>
        </DocSection>
      </DocLayout>

      <ContactBand id="board-contact" />
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Breadcrumb, CtaBox, Hero, LinkList } from '@/components/site';
import { CONTACT, ENTITY, EXAM, TRAINING, usd } from '@/lib/facts';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import {
  Footnotes,
  Photo,
  Rows,
  StepList,
  DataTable,
  bodyClass,
  h2Class,
  inlineLink,
  strongClass,
} from '../../for-doulas/_components/page-kit';

const mailto = `mailto:${CONTACT.email}`;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('scholarship.meta');
  return {
    title: t('title'),
    description: t('description'),
    openGraph: { title: t('title'), description: t('description'), images: [{ url: '/images/hero.webp', width: 1200, height: 630 }] },
  };
}

export default async function ScholarshipPage() {
  const t = await getTranslations('scholarship');
  const tSite = await getTranslations('site');
  const fee = usd(EXAM.feeUsd);

  const mail = (c: React.ReactNode) => (
    <a href={mailto} className={`${inlineLink} whitespace-nowrap`}>
      {c}
    </a>
  );
  // eslint-disable-next-line react/display-name
  const arrowLink = (href: string) => (c: React.ReactNode) => (
    <Link href={href} className="inline-flex items-center gap-2 font-semibold text-ada2-ink no-underline hover:text-black whitespace-nowrap">
      {c}
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden focusable={false}>
        <path d="M4 12h15M13 6l6 6-6 6" />
      </svg>
    </Link>
  );

  const steps = [
    { title: t('apply.s1Title'), body: <p className="m-0">{t.rich('apply.s1Body', { link: arrowLink('/programs') })}</p> },
    { title: t('apply.s2Title'), body: <p className="m-0">{t.rich('apply.s2Body', { email: CONTACT.email, mail })}</p> },
    { title: t('apply.s3Title'), body: <p className="m-0">{t('apply.s3Body')}</p> },
    {
      title: t('apply.s4Title'),
      body: (
        <p className="m-0">
          {t.rich('apply.s4Body', {
            fee,
            strong: (c) => <strong className={strongClass}>{c}</strong>,
            link: arrowLink('/exam-dates'),
          })}
        </p>
      ),
    },
  ];

  const costs = [
    { cost: t('covers.tuition'), amount: t('covers.tuitionAmount'), paidTo: t('covers.tuitionPaidTo') },
    { cost: t('covers.exam'), amount: fee, paidTo: t('covers.examPaidTo') },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: tSite('audience.candidates'), path: '/certifications' },
              { name: t('breadcrumb'), path: '/programs/scholarship' },
            ])
          ),
        }}
      />
      <Breadcrumb items={[{ label: tSite('audience.candidates'), href: '/certifications' }, { label: t('breadcrumb') }]} />

      <Hero
        title={t('hero.title')}
        line={t('hero.line')}
        actions={[
          { href: mailto, label: t('hero.apply') },
          { href: '/programs', label: t('hero.findCourse') },
        ]}
        image={{ src: '/images/2026/ada-training-band.jpg', alt: t('hero.photoAlt'), position: '50% 40%' }}
      />

      <section aria-labelledby="who-title" className="bg-white pt-20">
        <div className="ada2-wrap flex flex-wrap items-start gap-x-16 gap-y-8">
          <div className="flex-[2_1_400px] min-w-0 flex flex-col gap-5">
            <h2 id="who-title" className={h2Class}>
              {t('who.title')}
            </h2>
            <p className={bodyClass}>{t('who.intro')}</p>
            <Photo
              className="mt-2"
              src="/images/2026/ada-course-practice.jpg"
              alt={t('who.photoAlt')}
              caption={t('who.photoCaption')}
              position="60% 40%"
            />
          </div>
          <div className="flex-[3_1_560px] min-w-0 flex flex-col gap-4">
            <Rows
              rows={[
                { label: t('who.enrollment'), value: t('who.enrollmentText') },
                { label: t('who.need'), value: t('who.needText') },
                { label: t('who.commitment'), value: t('who.commitmentText') },
                { label: t('who.languages'), value: t('who.languagesText') },
                { label: t('who.priority'), value: t('who.priorityText') },
              ]}
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="covers-title" className="bg-white pt-24">
        <div className="ada2-wrap flex flex-col gap-4">
          <h2 id="covers-title" className={h2Class}>
            {t('covers.title')}
          </h2>
          <p className={bodyClass}>{t('covers.intro')}</p>
          <DataTable
            caption={t('covers.caption')}
            minWidth={640}
            columns={[
              { label: t('covers.colCost'), className: 'w-[32%]' },
              { label: t('covers.colAmount'), className: 'w-[28%]' },
              { label: t('covers.colPaidTo'), className: 'w-[24%]' },
              { label: t('covers.colScholarship'), cellClassName: 'font-bold text-ada2-ink' },
            ]}
            rows={costs.map((c) => [c.cost, c.amount, c.paidTo, t('covers.partialOrFull')])}
          />
          <Footnotes>
            <p>{t('covers.note')}</p>
          </Footnotes>
        </div>
      </section>

      <section aria-labelledby="apply-title" className="bg-white pt-24">
        <div className="ada2-wrap flex flex-wrap items-start gap-x-16 gap-y-8">
          <div className="flex-[2_1_400px] min-w-0 flex flex-col gap-5">
            <h2 id="apply-title" className={h2Class}>
              {t('apply.title')}
            </h2>
            <p className={bodyClass}>{t('apply.intro')}</p>
            <Photo className="mt-2" src="/images/2026/ada-exam-written.jpg" alt={t('apply.photoAlt')} caption={t('apply.photoCaption')} />
          </div>
          <div className="flex-[3_1_560px] min-w-0 flex flex-col gap-4">
            <StepList items={steps} labelledBy="apply-title" />
          </div>
        </div>
      </section>

      <section aria-labelledby="contact-title" className="bg-white pt-24">
        <div className="ada2-wrap flex flex-wrap items-start gap-x-12 gap-y-10">
          <div className="flex-[999_1_640px] min-w-0 flex flex-col gap-4">
            <h2 id="contact-title" className={h2Class}>
              {t('contact.title')}
            </h2>
            <p className={bodyClass}>{t('contact.intro')}</p>
            <Rows
              rows={[
                {
                  label: t('contact.email'),
                  value: (
                    <a href={mailto} className={`${inlineLink} whitespace-nowrap`}>
                      {CONTACT.email}
                    </a>
                  ),
                },
                {
                  label: t('contact.phone'),
                  value: (
                    <a href={`tel:${CONTACT.phone.tel}`} className={`${inlineLink} whitespace-nowrap [font-variant-numeric:tabular-nums_lining-nums]`}>
                      {CONTACT.phone.display}
                    </a>
                  ),
                },
                { label: t('contact.mail'), value: t('contact.mailValue', { name: ENTITY.dba, address: ENTITY.address.oneLine }) },
              ]}
            />
          </div>
          <CtaBox title={t('cta.title')} action={{ href: mailto, label: t('cta.action') }} />
        </div>
      </section>

      <div className="pt-24 pb-[104px]">
        <LinkList
          title={t('links.title')}
          items={[
            { href: '/certifications/postpartum-doula', label: t('links.postpartum'), description: t('links.postpartumText', { count: TRAINING.moduleCount }) },
            { href: '/certifications/birth-doula', label: t('links.birth'), description: t('links.birthText') },
            { href: '/certifications/ibclc', label: t('links.ibclc'), description: t('links.ibclcText') },
            { href: '/programs', label: t('links.courses'), description: t('links.coursesText') },
            { href: '/exam-dates', label: t('links.dates'), description: t('links.datesText') },
            { href: '/for-doulas/code-of-conduct', label: t('links.conduct'), description: t('links.conductText') },
          ]}
        />
      </div>
    </>
  );
}

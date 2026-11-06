/**
 * Families page (canvas FindDoula.dc.html), rendered at /for-families and
 * /for-families/find-a-doula.
 *
 * The board's directory search and result list are not built: the database
 * has no directory opt-in, so there is no list of doulas who chose to be
 * listed, and the board's people are sample data. Families check a doula in
 * the registry instead (the verify form, a GET to /verify?q=). The partner
 * block of the old page is removed entirely.
 */
import { getLocale, getTranslations } from 'next-intl/server';
import { Breadcrumb, CtaBox, LinkList, RuledRows, VerifyField } from '@/components/site';
import { INSURANCE_RECOGNITION, PROGRAM_LANGUAGES, TRAINING, range, type ProgramLanguage } from '@/lib/facts';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { PHOTO_MONTH } from '../../about-us/_lib/governance';
import { asLocale, formatList, formatMonth } from '../../about-us/_lib/format';
import { ContactBand } from './contact-band';

export async function FindDoulaView({ path }: { path: '/for-families' | '/for-families/find-a-doula' }) {
  const t = await getTranslations('findDoula');
  const locale = asLocale(await getLocale());

  const languageName: Record<ProgramLanguage, string> = {
    en: t('languages.en'),
    zh: t('languages.zh'),
    ja: t('languages.ja'),
    ko: t('languages.ko'),
  };
  const languages = formatList(
    PROGRAM_LANGUAGES.map((l) => languageName[l.code]),
    locale
  );
  const insurers = formatList(INSURANCE_RECOGNITION, locale);
  const photoDate = formatMonth(PHOTO_MONTH, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([{ name: t('breadcrumb'), path }])),
        }}
      />
      <Breadcrumb items={[{ label: t('breadcrumb') }]} />

      {/* Page head (plain inner-page H1) + right-rail CTA */}
      <div className="ada2-wrap pt-12 pb-[72px] flex flex-wrap items-start gap-x-12 gap-y-8">
        <div className="flex-[999_1_640px] min-w-0 flex flex-col gap-4">
          <h1 className="m-0 text-[clamp(40px,3.9vw,56px)] leading-[1.15] font-light text-ada2-ink [text-wrap:balance]">
            {t.rich('title', { nb: (chunks) => <span className="whitespace-nowrap">{chunks}</span> })}
          </h1>
          <p className="m-0 max-w-[760px] text-[clamp(20px,1.6vw,22px)] leading-[1.42] font-light text-ada2-body [text-wrap:pretty]">
            {t('lead')}
          </p>
          <p className="m-0 text-[14px] leading-[21px] text-ada2-muted [text-wrap:pretty]">{t('meta')}</p>
        </div>
        <CtaBox
          title={t('cta.title')}
          action={{ href: '/certifications/postpartum-doula', label: t('cta.action') }}
        />
      </div>

      <RuledRows
        id="choose-title"
        title={t('choose.title')}
        className="pb-[88px]"
        image={{
          src: '/images/2026/ada-care-seated.jpg',
          alt: t('choose.photoAlt'),
          caption: t('choose.photoCaption', { date: photoDate }),
        }}
        rows={[
          { label: t('choose.typeLabel'), value: t('choose.typeValue') },
          { label: t('choose.languageLabel'), value: t('choose.languageValue', { languages }) },
          { label: t('choose.insuranceLabel'), value: t('choose.insuranceValue', { insurers }) },
          { label: t('choose.coverageLabel'), value: t('choose.coverageValue') },
          { label: t('choose.recordLabel'), value: t('choose.recordValue') },
        ]}
        link={{ href: '/verify', label: t('choose.link'), tone: 'registry' }}
      />

      {/* Check a doula's record (grey band): the registry search */}
      <section aria-labelledby="check-title" className="bg-ada2-band border-y border-ada2-band-rule">
        <div className="ada2-wrap pt-12 pb-[52px] flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 id="check-title" className="m-0 text-[clamp(30px,2.5vw,36px)] leading-[1.22] font-light text-ada2-ink [text-wrap:balance]">
              {t('check.title')}
            </h2>
            <p className="m-0 max-w-[760px] text-ada2-body [text-wrap:pretty]">{t('check.body')}</p>
          </div>
          <VerifyField variant="inline" id="families-verify" />
        </div>
      </section>

      <div className="pt-14 pb-[88px]">
        <LinkList
          id="more-title"
          title={t('more.title')}
          items={[
            { href: '/verify', label: t('more.verifyLabel'), description: t('more.verifyBody') },
            {
              href: '/programs',
              label: t('more.trainingLabel'),
              description: t('more.trainingBody', {
                modules: TRAINING.moduleCount,
                days: range(TRAINING.inPersonDays),
              }),
            },
            { href: '/for-doulas/code-of-conduct', label: t('more.concernLabel'), description: t('more.concernBody') },
            { href: '/support/faq', label: t('more.faqLabel'), description: t('more.faqBody') },
          ]}
        />
      </div>

      <ContactBand id="families-contact" />
    </>
  );
}

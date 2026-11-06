import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getExamContent, type ExamLang } from '@/lib/exam-content';
import { ArrowIcon } from '@/components/site/icons';
import { BiText } from '@/components/exam/bi-text';
import { EXAM } from '@/lib/facts';
import { examLocale, getExamCopy, isExamLang } from '../_lib/exam-copy';

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ session?: string }>;
}

export default async function ExamLangPage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  const { session } = await searchParams;

  if (!isExamLang(lang)) {
    notFound();
  }

  const content = getExamContent(lang as ExamLang);
  const enContent = getExamContent('en');
  const locale = examLocale(lang);
  const { t, en } = await getExamCopy(locale);
  const sessionQuery = session ? `?session=${session}` : '';

  const parts = [
    {
      href: `/exam-home/${lang}/written${sessionQuery}`,
      main: `${content.ui.part1} · ${content.ui.writtenExam}`,
      alt: `${enContent.ui.part1} · ${enContent.ui.writtenExam}`,
      meta: t('parts.writtenMeta', { minutes: EXAM.writtenMinutes }),
      metaEn: en('parts.writtenMeta', { minutes: EXAM.writtenMinutes }),
    },
    {
      href: `/exam-home/${lang}/practical${sessionQuery}`,
      main: `${content.ui.part2} · ${content.ui.practicalExam}`,
      alt: `${enContent.ui.part2} · ${enContent.ui.practicalExam}`,
      meta: t('parts.practicalMeta', { count: content.modules.length, minutes: EXAM.practicalMinutes }),
      metaEn: en('parts.practicalMeta', { count: content.modules.length, minutes: EXAM.practicalMinutes }),
    },
  ];

  return (
    <div className="ada2-wrap pt-12 pb-20">
      <div className="max-w-[1000px] flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <p className="m-0 text-[17px] leading-6 text-ada2-body">
          <BiText lang={locale} main={t('parts.eyebrow')} alt={en('parts.eyebrow')} altClassName="text-ada2-muted" />
        </p>
        <h1 className="m-0 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[clamp(40px,3.9vw,56px)] leading-[1.15] font-light text-ada2-ink [text-wrap:balance]">
          <BiText
            lang={locale}
            main={t('parts.title')}
            alt={en('parts.title')}
            altClassName="text-[24px] leading-8 font-light text-ada2-muted"
          />
        </h1>
      </div>

      <ul className="m-0 p-0 list-none border-t-2 border-ada2-ink">
        {parts.map((part) => (
          <li key={part.href} className="border-b border-ada2-hairline">
            <Link
              href={part.href}
              className="flex items-center justify-between gap-6 min-h-[112px] box-border px-[clamp(12px,2vw,24px)] py-5 text-ada2-ink no-underline hover:bg-ada2-band hover:text-ada2-ink"
            >
              <span className="flex flex-col gap-1 min-w-0">
                <span className="text-[clamp(26px,2.6vw,32px)] leading-[1.25] font-semibold">
                  <BiText lang={locale} main={part.main} alt={null} />
                </span>
                <span className="text-[18px] leading-6 text-ada2-body [font-variant-numeric:tabular-nums_lining-nums]">
                  <BiText lang={locale} main={part.meta} alt={null} />
                </span>
                {locale !== 'en' ? (
                  <span lang="en" className="text-[16px] leading-[22px] text-ada2-muted [font-variant-numeric:tabular-nums_lining-nums]">
                    {part.alt} · {part.metaEn}
                  </span>
                ) : null}
              </span>
              <span className="flex-none inline-flex items-center gap-2 text-[18px] leading-6 font-semibold">
                <span className="hidden sm:inline">
                  <BiText lang={locale} main={t('parts.open')} alt={en('parts.open')} />
                </span>
                <ArrowIcon size={22} />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={`/exam-home${sessionQuery}`}
        className="self-start inline-flex items-center gap-2 min-h-[56px] text-[17px] leading-6 font-semibold text-ada2-ink underline underline-offset-[3px] hover:text-black"
      >
        <BiText lang={locale} main={t('parts.changeLanguage')} alt={en('parts.changeLanguage')} />
      </Link>
      </div>
    </div>
  );
}

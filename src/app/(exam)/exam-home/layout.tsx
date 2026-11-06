import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { ExamHeader, ExamHeaderBar } from '@/components/exam/exam-header';
import { ENTITY } from '@/lib/facts';

/**
 * Exam screens show Chinese, Japanese and Korean whatever the site locale is
 * (language chooser, Chinese practical tasks), so all four Noto families are
 * loaded here. Google Fonts CSS uses unicode-range: only the glyph slices a
 * screen renders are downloaded.
 */
const CJK_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300..700&family=Noto+Sans+TC:wght@300..700' +
  '&family=Noto+Sans+JP:wght@300..700&family=Noto+Sans+KR:wght@300..700&display=swap';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('examHome.meta');
  return {
    title: t('title'),
    robots: { index: false, follow: false },
  };
}

/**
 * Exam-day app chrome (canvas ExamHome etc.): minimal header, full-bleed
 * screens, one black entity line. Self-contained (own font and colour root)
 * so it renders the same whether or not the public site chrome wraps it.
 */
export default async function ExamLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('site.footer');
  const tc = await getTranslations('examHome.chrome');
  const year = new Date().getFullYear();
  return (
    <div className="ada2-root font-site min-h-screen flex flex-col bg-white text-ada2-body text-[17px] leading-[1.6]">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={CJK_FONTS_HREF} />
      <Suspense fallback={<ExamHeaderBar />}>
        <ExamHeader />
      </Suspense>
      <div className="flex-1 flex flex-col">{children}</div>
      <footer className="bg-ada2-black text-white print:hidden">
        <div className="ada2-wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-6 text-[14px] leading-[21px]">
          <p className="m-0 flex-[1_1_560px] min-w-0 text-white [font-variant-numeric:tabular-nums_lining-nums] [text-wrap:pretty]">
            {t('entityShort', {
              dba: ENTITY.dba,
              legalName: ENTITY.legalName,
              taxCode: ENTITY.taxCode,
              ein: ENTITY.ein,
            })}
            {' · '}
            {t('copyright', { year: String(year), legalName: ENTITY.legalName })}
          </p>
          <Link
            href="/privacy-policy"
            className="inline-flex items-center min-h-[44px] text-white underline underline-offset-4 hover:text-white"
          >
            {tc('privacy')}
          </Link>
        </div>
      </footer>
    </div>
  );
}

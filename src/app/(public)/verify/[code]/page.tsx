/**
 * /verify/[code]: a registry record (boards VerifyRecord, VerifyRecordLapsed,
 * VerifyRecordZh, VerifyMobile). The permalink is unchanged: [code] is a
 * certificate code (exact, case-sensitive), a certificate number, or a Doula
 * ID with or without the # ("/verify/25-3107"). Rules: ../_lib/registry.ts.
 *
 * Records sit inside the page chrome: header, breadcrumb band and footer are
 * the page's; the grey desk band, toolbar and white sheet are RecordFrame's.
 */
import type { Metadata } from 'next';
import { cache } from 'react';
import { getTranslations } from 'next-intl/server';
import { Breadcrumb, VerifyField } from '@/components/site';
import { getRecord, type RecordLookup } from '../_lib/registry';
import { parseQuery } from '../_lib/query';
import { RegistryNotFound } from '../_components/not-found';
import { RecordMobile } from './_components/record-mobile';
import { RecordSheet } from './_components/record-sheet';

export const dynamic = 'force-dynamic';

type Params = { code: string };

function decodeSegment(code: string): string {
  try {
    return decodeURIComponent(code);
  } catch {
    return code;
  }
}

/** Deduped per request (generateMetadata and the page both need it). */
const lookup = cache(async (code: string): Promise<RecordLookup | null | 'error'> => {
  try {
    return await getRecord(decodeSegment(code));
  } catch {
    return 'error';
  }
});

export async function generateMetadata({ params }: { params: Params | Promise<Params> }): Promise<Metadata> {
  const { code } = await params;
  const t = await getTranslations('record.meta');
  const found = await lookup(code);
  const robots = { index: false, follow: false };
  if (!found || found === 'error') return { title: t('notFoundTitle'), robots };
  return {
    title: t('title', { id: found.record.doulaId }),
    description: t('description', { id: found.record.doulaId }),
    robots,
  };
}

export default async function VerifyRecordPage({ params }: { params: Params | Promise<Params> }) {
  const { code } = await params;
  const t = await getTranslations('record');
  const tv = await getTranslations('verify');
  const decoded = decodeSegment(code);
  const found = await lookup(code);
  const retrievedAt = new Date();

  const another = (
    <section aria-labelledby="another-h" className="bg-white pt-14 pb-[72px] print:hidden">
      <div className="ada2-wrap">
        <div className="flex flex-col gap-4 pt-5 border-t-2 border-solid border-ada2-ink max-w-[820px]">
          <h2 id="another-h" className="m-0 text-[28px] leading-[35px] font-light text-ada2-ink [text-wrap:balance]">
            {t('another.title')}
          </h2>
          <VerifyField variant="inline" id="verify-another" />
        </div>
      </div>
    </section>
  );

  if (!found || found === 'error') {
    const parsed = parseQuery(decoded);
    return (
      <>
        <Breadcrumb items={[{ label: tv('breadcrumb'), href: '/verify' }, { label: t('breadcrumbNotFound') }]} />
        <div className="bg-ada2-band py-10">
          <div className="ada2-wrap max-w-[1000px]">
            {found === 'error' ? (
              <p role="alert" className="m-0 py-4 px-5 bg-white border border-solid border-ada2-hairline border-l-4 border-l-ada2-suspended text-ada2-body">
                {tv('search.searchError')}
              </p>
            ) : (
              <RegistryNotFound
                query={decoded.trim().slice(0, 80)}
                numberLike={!parsed || parsed.kind !== 'name'}
                retrievedAt={retrievedAt}
                headingLevel="h1"
              />
            )}
          </div>
        </div>
        {another}
      </>
    );
  }

  return (
    <>
      <div className="hidden md:block print:hidden">
        <Breadcrumb
          items={[{ label: tv('breadcrumb'), href: '/verify' }, { label: t('breadcrumb', { id: found.record.doulaId }) }]}
        />
      </div>

      {/* Phones: the condensed record (VerifyMobile) */}
      <div className="md:hidden print:hidden">
        <RecordMobile lookup={found} retrievedAt={retrievedAt} />
      </div>

      {/* md and up, and print: the full sheet */}
      <div className="hidden md:block print:block">
        <RecordSheet lookup={found} retrievedAt={retrievedAt} />
      </div>

      {another}
    </>
  );
}

/**
 * /verify: the registry search page (board Verify.dc.html). "Its form is a
 * page, its result is a record."
 *
 * Server-rendered from the URL, so the header's verify field (GET /verify?q=…)
 * and the page's own forms work without JavaScript:
 *   ?q=…                 any query (number, code or name), auto-detected
 *   ?family=…&given=…    the name form
 *   ?by=name|number      which form to show
 * An exact certificate number, certificate code or Doula ID redirects to the
 * record. Names list at most 10 matches. Rules: _lib/registry.ts.
 */
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@/components/site';
import { hasCjk, nameTokens, normalizeQuery } from './_lib/query';
import { searchRegistry, type SearchOutcome } from './_lib/registry';
import { NameResults } from './_components/name-results';
import { RegistryNotFound } from './_components/not-found';
import { SearchPanel, type FieldError, type SearchMode } from './_components/search-panel';
import { VerifyRail } from './_components/verify-rail';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export async function generateMetadata({ searchParams }: { searchParams: SP | Promise<SP> }): Promise<Metadata> {
  const sp = await searchParams;
  const t = await getTranslations('verify.meta');
  const hasQuery = Boolean(first(sp.q) || first(sp.family) || first(sp.given));
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: '/verify' },
    // Result pages list people: keep them out of search engines.
    robots: hasQuery ? { index: false, follow: true } : undefined,
  };
}

/** Prefill the name form from a free-text query (header field). */
function splitName(q: string): { family: string; given: string } {
  if (hasCjk(q) && !q.includes(' ')) {
    const chars = Array.from(q);
    return { family: chars[0] ?? '', given: chars.slice(1).join('') };
  }
  const tokens = nameTokens(q);
  if (tokens.length >= 2) return { family: tokens[tokens.length - 1], given: tokens.slice(0, -1).join(' ') };
  return { family: tokens[0] ?? q, given: '' };
}

export default async function VerifyPage({ searchParams }: { searchParams: SP | Promise<SP> }) {
  const sp = await searchParams;
  const t = await getTranslations('verify');

  const rawQ = first(sp.q);
  const rawFamily = first(sp.family);
  const rawGiven = first(sp.given);
  const by = first(sp.by);

  let mode: SearchMode = by === 'name' ? 'name' : 'number';
  let number = '';
  let family = '';
  let given = '';
  let error: FieldError | null = null;
  let query: string | null = null;
  let fromNameForm = false;

  if (rawFamily !== undefined || rawGiven !== undefined) {
    mode = 'name';
    fromNameForm = true;
    family = normalizeQuery(rawFamily);
    given = normalizeQuery(rawGiven);
    if (!family) error = { field: 'family', key: 'familyEmpty' };
    else if (!given) error = { field: 'given', key: 'givenEmpty' };
    else query = hasCjk(family + given) ? `${family}${given}` : `${given} ${family}`;
  } else if (rawQ !== undefined) {
    number = normalizeQuery(rawQ);
    if (number) query = number;
    else error = { field: 'number', key: 'numberEmpty' };
  }

  const outcome: SearchOutcome | null = query ? await searchRegistry(query) : null;
  if (outcome?.status === 'exact') redirect(outcome.href);

  if (outcome?.status === 'tooShort') {
    if (outcome.kind === 'name') {
      mode = 'name';
      if (!fromNameForm) ({ family, given } = splitName(number));
      error = { field: 'family', key: 'nameTooShort', min: outcome.min };
    } else {
      mode = 'number';
      error = { field: 'number', key: 'numberTooShort', min: outcome.min };
    }
  } else if (outcome && (outcome.status === 'list' || (outcome.status === 'notFound' && outcome.type === 'name'))) {
    mode = 'name';
    if (!fromNameForm) ({ family, given } = splitName(number));
  } else if (outcome?.status === 'notFound') {
    mode = 'number';
  }

  const retrievedAt = new Date();
  const panelKey = JSON.stringify([rawQ, rawFamily, rawGiven, by]);

  return (
    <>
      <Breadcrumb items={[{ label: t('breadcrumb') }]} />

      <section aria-labelledby="page-h1" className="bg-white pt-10 pb-8">
        <div className="ada2-wrap flex flex-col gap-3.5">
          <h1 id="page-h1" className="m-0 text-[clamp(40px,3.9vw,56px)] leading-[1.15] font-light text-ada2-ink [text-wrap:balance]">
            {t('title')}
          </h1>
          <p className="m-0 max-w-[820px] text-[clamp(19px,1.6vw,22px)] leading-[1.42] font-light text-ada2-body [text-wrap:pretty]">
            {t('lede')}
          </p>
        </div>
      </section>

      <div className="ada2-wrap pb-[72px] flex flex-wrap items-start gap-12">
        <div className="flex-[8_1_600px] min-w-0 max-w-full flex flex-col gap-11">
          <SearchPanel key={panelKey} mode={mode} number={mode === 'number' ? number : ''} family={family} given={given} error={error} />

          {outcome?.status === 'list' ? (
            <NameResults query={outcome.query} records={outcome.records} truncated={outcome.truncated} retrievedAt={retrievedAt} />
          ) : null}

          {outcome?.status === 'notFound' ? (
            <div id="results" className="scroll-mt-4">
              <RegistryNotFound query={outcome.query} numberLike={outcome.type !== 'name'} retrievedAt={retrievedAt} />
            </div>
          ) : null}

          {outcome?.status === 'error' ? (
            <p id="results" role="alert" className="m-0 py-4 px-5 bg-white border-2 border-solid border-ada2-suspended text-ada2-body">
              {t('search.searchError')}
            </p>
          ) : null}
        </div>

        <VerifyRail />
      </div>
    </>
  );
}

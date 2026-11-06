'use client';

/**
 * The search form on /verify (board Verify.dc.html, grey panel): a "Search by"
 * switch, the number form and the name form. Both are plain GET forms to
 * /verify, so they work before hydration; with JS they validate first and
 * navigate client-side. The server runs the search (registry.ts).
 */
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useId, useRef, useState, useTransition, type FormEvent, type ReactNode } from 'react';
import { pillClassName } from '@/components/site';
import { SearchIcon } from '@/components/site/icons';
import { cn } from '@/lib/utils';
import { normalizeQuery, parseQuery, hasCjk } from '../_lib/query';

export type SearchMode = 'number' | 'name';
export type FieldError =
  | { field: 'number'; key: 'numberEmpty' | 'numberTooShort'; min?: number }
  | { field: 'family'; key: 'familyEmpty' | 'nameTooShort'; min?: number }
  | { field: 'given'; key: 'givenEmpty'; min?: number };

export interface SearchPanelProps {
  mode: SearchMode;
  number?: string;
  family?: string;
  given?: string;
  error?: FieldError | null;
}

function WarnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true" focusable="false" className="flex-none mt-0.5">
      <path d="M12 3.5L21.5 20h-19z" />
      <path d="M12 10v4.5M12 17.25v.5" />
    </svg>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="m-0 flex gap-1.5 items-start text-[15px] leading-[22px] text-ada2-suspended">
      <WarnIcon />
      <span>{children}</span>
    </p>
  );
}

const inputClass =
  'w-full box-border h-12 bg-white border-[1.5px] border-solid border-ada2-blossom rounded-[4px] text-ada2-ink text-[18px] appearance-none placeholder:text-ada2-tag-border';

/** The 2px red ring drawn over an invalid field (board). */
function ErrorRing() {
  return <span aria-hidden="true" className="absolute inset-0 border-2 border-solid border-ada2-suspended rounded-[4px] pointer-events-none" />;
}

function Segment({ value, label, wide }: { value: string; label: string; wide?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[28px] leading-[34px] font-semibold text-ada2-ink tracking-[0.02em] [font-variant-numeric:tabular-nums_lining-nums]">
        {value}
      </span>
      <span aria-hidden="true" className="self-stretch h-1.5 border border-t-0 border-solid border-ada2-tag-border" />
      <span className={cn('text-[14px] leading-[18px] text-ada2-muted', wide && 'whitespace-nowrap')}>{label}</span>
    </div>
  );
}

export function SearchPanel({ mode: initialMode, number = '', family = '', given = '', error: initialError = null }: SearchPanelProps) {
  const t = useTranslations('verify.search');
  const router = useRouter();
  const uid = useId();
  const [mode, setMode] = useState<SearchMode>(initialMode);
  const [num, setNum] = useState(number);
  const [fam, setFam] = useState(family);
  const [giv, setGiv] = useState(given);
  const [error, setError] = useState<FieldError | null>(initialError);
  const [pending, startTransition] = useTransition();
  const numRef = useRef<HTMLInputElement>(null);
  const famRef = useRef<HTMLInputElement>(null);
  const givRef = useRef<HTMLInputElement>(null);

  const ids = {
    num: `${uid}-num`,
    numErr: `${uid}-num-err`,
    fam: `${uid}-fam`,
    famErr: `${uid}-fam-err`,
    giv: `${uid}-giv`,
    givErr: `${uid}-giv-err`,
    hint: `${uid}-name-hint`,
  };

  const parsed = parseQuery(num);
  const chip = parsed && parsed.kind !== 'name' ? t(`detected.${parsed.kind}`) : null;

  function switchMode(next: SearchMode) {
    setMode(next);
    setError(null);
  }

  function go(params: Record<string, string>) {
    const qs = new URLSearchParams(params).toString();
    startTransition(() => router.push(`/verify?${qs}#results`));
  }

  function submitNumber(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = normalizeQuery(num);
    const p = parseQuery(value);
    if (!p) {
      setError({ field: 'number', key: 'numberEmpty' });
      numRef.current?.focus();
      return;
    }
    if (!p.longEnough) {
      setError({ field: 'number', key: 'numberTooShort', min: p.min });
      numRef.current?.focus();
      return;
    }
    setError(null);
    go({ q: value });
  }

  function submitName(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = normalizeQuery(fam);
    const g = normalizeQuery(giv);
    if (!f) {
      setError({ field: 'family', key: 'familyEmpty' });
      famRef.current?.focus();
      return;
    }
    if (!g) {
      setError({ field: 'given', key: 'givenEmpty' });
      givRef.current?.focus();
      return;
    }
    const p = parseQuery(hasCjk(f + g) ? `${f}${g}` : `${g} ${f}`);
    if (p && !p.longEnough) {
      setError({ field: 'family', key: 'nameTooShort', min: p.min });
      famRef.current?.focus();
      return;
    }
    setError(null);
    go({ family: f, given: g });
  }

  const errFor = (field: FieldError['field']) => (error && error.field === field ? error : null);
  const numErr = errFor('number');
  const famErr = errFor('family');
  const givErr = errFor('given');

  const toggleBtn = (value: SearchMode, label: string) => {
    const on = mode === value;
    return (
      <button
        type="button"
        aria-pressed={on}
        onClick={() => switchMode(value)}
        className={cn(
          'min-h-[44px] px-[18px] border-0 rounded-full font-semibold text-[16px] leading-5 cursor-pointer whitespace-nowrap',
          on ? 'bg-ada2-ink text-white' : 'bg-white text-ada2-ink hover:bg-ada2-band'
        )}
      >
        {label}
      </button>
    );
  };

  return (
    <section
      id="search"
      aria-labelledby={`${uid}-h`}
      className="relative box-border bg-ada2-band p-[clamp(16px,2.4vw,32px)] flex flex-col gap-5 scroll-mt-4"
    >
      <h2 id={`${uid}-h`} className="ada2-sr">
        {t('heading')}
      </h2>

      <div className="flex flex-col items-start">
        <fieldset className="relative inline-flex flex-wrap gap-1 m-0 p-1 border border-solid border-ada2-hairline rounded-full bg-white">
          <legend className="ada2-sr">{t('by')}</legend>
          {toggleBtn('number', t('byNumber'))}
          {toggleBtn('name', t('byName'))}
        </fieldset>
      </div>

      {mode === 'number' ? (
        <form action="/verify" method="get" role="search" noValidate onSubmit={submitNumber} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 min-w-0">
            <label htmlFor={ids.num} className="text-[15px] leading-5 font-semibold text-ada2-ink">
              {t('numberLabel')}
            </label>
            <div className="flex flex-wrap gap-3 min-w-0">
              <span className="relative flex flex-[999_1_320px] min-w-0">
                <input
                  ref={numRef}
                  id={ids.num}
                  name="q"
                  type="text"
                  inputMode="text"
                  enterKeyHint="search"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  value={num}
                  onChange={(e) => {
                    setNum(e.target.value);
                    if (numErr) setError(null);
                  }}
                  placeholder={t('numberPlaceholder')}
                  aria-invalid={numErr ? true : undefined}
                  aria-describedby={numErr ? ids.numErr : undefined}
                  className={cn(inputClass, 'pl-4 tracking-[0.02em] [font-variant-numeric:tabular-nums_lining-nums]', chip ? 'pr-[min(200px,42%)]' : 'pr-4')}
                />
                {numErr ? <ErrorRing /> : null}
                <span aria-live="polite" className="absolute right-2.5 top-1/2 -translate-y-1/2 max-w-[40%] pointer-events-none">
                  {chip ? (
                    <span className="inline-flex items-center max-w-full min-h-[26px] box-border px-2 bg-white border border-solid border-ada2-blossom rounded-[4px] text-ada2-blossom font-semibold text-[13px] leading-4 whitespace-nowrap overflow-hidden text-ellipsis">
                      {chip}
                    </span>
                  ) : null}
                </span>
              </span>
              <button type="submit" disabled={pending} className={pillClassName('registry', 'md', 'flex-none px-7')}>
                <SearchIcon />
                {t('lookUp')}
              </button>
            </div>
            {numErr ? <ErrorText id={ids.numErr}>{t(numErr.key, { min: numErr.min ?? 0 })}</ErrorText> : null}
          </div>

          <div className="flex flex-col gap-4 pt-5 border-t border-solid border-ada2-hairline">
            <p className="m-0 text-[17px] leading-[22px] font-semibold text-ada2-ink">{t('howTo')}</p>
            <div className="flex flex-wrap items-start gap-1.5">
              <Segment value="ADA" label={t('segRegistry')} />
              <span aria-hidden="true" className="text-[28px] leading-[34px] text-ada2-tag-border">-</span>
              <Segment value="PD" label={t('segCredential')} />
              <span aria-hidden="true" className="text-[28px] leading-[34px] text-ada2-tag-border">-</span>
              <Segment value="YYYY" label={t('segYear')} wide />
              <span aria-hidden="true" className="text-[28px] leading-[34px] text-ada2-tag-border">-</span>
              <Segment value="NNNN" label={t('segSequence')} />
            </div>
            <p className="m-0 text-[14px] leading-[21px] text-ada2-muted [text-wrap:pretty]">{t('prefixes')}</p>
            <div className="flex flex-col border-t border-solid border-ada2-hairline">
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-0.5 py-3 border-b border-solid border-ada2-hairline">
                <span className="flex-[0_0_150px] text-[17px] leading-6 font-semibold text-ada2-blossom whitespace-nowrap [font-variant-numeric:tabular-nums_lining-nums]">
                  {t('doulaIdPattern')}
                </span>
                <span className="flex-[1_1_280px] min-w-0 text-[15px] leading-[22px] text-ada2-muted [text-wrap:pretty]">{t('doulaIdFormat')}</span>
              </div>
            </div>
            <p className="m-0 text-[14px] leading-[21px] text-ada2-muted">{t('exactOpens')}</p>
          </div>
        </form>
      ) : (
        <form action="/verify" method="get" role="search" noValidate onSubmit={submitName} className="flex flex-col gap-[18px]">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-[1_1_200px] flex flex-col gap-2 min-w-0">
              <label htmlFor={ids.fam} className="text-[15px] leading-5 font-semibold text-ada2-ink">
                {t('family')}
              </label>
              <span className="relative block">
                <input
                  ref={famRef}
                  id={ids.fam}
                  name="family"
                  type="text"
                  autoComplete="off"
                  value={fam}
                  onChange={(e) => {
                    setFam(e.target.value);
                    if (famErr) setError(null);
                  }}
                  aria-invalid={famErr ? true : undefined}
                  aria-describedby={cn(ids.hint, famErr && ids.famErr)}
                  className={cn(inputClass, 'px-3.5')}
                />
                {famErr ? <ErrorRing /> : null}
              </span>
              {famErr ? <ErrorText id={ids.famErr}>{t(famErr.key, { min: famErr.min ?? 0 })}</ErrorText> : null}
            </div>
            <div className="flex-[1_1_200px] flex flex-col gap-2 min-w-0">
              <label htmlFor={ids.giv} className="text-[15px] leading-5 font-semibold text-ada2-ink">
                {t('given')}
              </label>
              <span className="relative block">
                <input
                  ref={givRef}
                  id={ids.giv}
                  name="given"
                  type="text"
                  autoComplete="off"
                  value={giv}
                  onChange={(e) => {
                    setGiv(e.target.value);
                    if (givErr) setError(null);
                  }}
                  aria-invalid={givErr ? true : undefined}
                  aria-describedby={cn(ids.hint, givErr && ids.givErr)}
                  className={cn(inputClass, 'px-3.5')}
                />
                {givErr ? <ErrorRing /> : null}
              </span>
              {givErr ? <ErrorText id={ids.givErr}>{t(givErr.key)}</ErrorText> : null}
            </div>
          </div>
          <p id={ids.hint} className="m-0 max-w-[720px] text-[14px] leading-[21px] text-ada2-muted [text-wrap:pretty]">
            {t.rich('nameHint', {
              zh: (chunks) => <span lang="zh-Hans">{chunks}</span>,
              ko: (chunks) => <span lang="ko">{chunks}</span>,
            })}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <button type="submit" disabled={pending} className={pillClassName('registry', 'md')}>
              <SearchIcon />
              {t('submitName')}
            </button>
          </div>
        </form>
      )}

      <p className="m-0 pt-4 border-t border-solid border-ada2-hairline text-[14px] leading-[21px] text-ada2-muted [text-wrap:pretty]">
        {t('terms')}
      </p>
    </section>
  );
}

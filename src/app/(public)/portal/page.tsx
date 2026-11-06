'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  ArrowLink,
  Breadcrumb,
  CtaBox,
  LinkList,
  Pill,
  RuledRows,
  StatusTag,
  certificateStatusTag,
  credentialStatusTag,
  pillClassName,
} from '@/components/site';
import { ScoreTable } from '@/components/exam/score-table';
import { htmlLang, type Locale } from '@/i18n/config';
import { CERTIFICATE, CONTACT, EXAM, RENEWAL, usd } from '@/lib/facts';
import { formatExamDate } from '@/lib/site-dates';
import { cn } from '@/lib/utils';

// ============ TYPES ============

interface DoulaProfile {
  full_name: string;
  full_name_zh: string | null;
  doula_id_code: string;
  email: string | null;
  phone: string | null;
  status: string;
  region: string | null;
  languages: string[] | null;
  certification_date: string | null;
  expiration_date: string | null;
}

interface Credential {
  credential_type: string;
  status: string;
  certification_date: string | null;
  expiration_date: string | null;
}

interface Certificate {
  id: string;
  certificate_number: string;
  certificate_type: string;
  issued_date: string;
  pdf_url: string | null;
  status: string;
}

interface ExamResult {
  id: string;
  exam_session: string;
  exam_type: string;
  overall_score: number;
  score_terminology: number;
  score_newborn: number;
  score_lactation: number;
  score_emergency: number;
  score_practical: number;
  score_postpartum: number;
  score_knowledge: number;
  score_ethics: number;
  passed: boolean;
  exam_date: string;
}

interface PortalData {
  doula: DoulaProfile;
  credentials: Credential[];
  certificates: Certificate[];
  exam_results: ExamResult[];
}

// ============ HELPERS ============

/** ADA's phone for running text: no line break inside the number. */
const PHONE = CONTACT.phone.display.replace(/ /g, '\u00A0');

/** Shown in the Doula ID hint ("for example …"). */
const DOULA_ID_EXAMPLE = '#25-0001';
/** The sign-in photo (ADA training photos, August 2024). */
const PHOTO_DATE = Date.UTC(2024, 7, 1);

const scoreKeys = [
  'score_terminology', 'score_newborn', 'score_lactation', 'score_emergency',
  'score_practical', 'score_postpartum', 'score_knowledge', 'score_ethics',
] as const;

type Translate = ReturnType<typeof useTranslations<'portal'>>;

function formatDate(dateStr: string | null, locale: Locale): string {
  if (!dateStr) return '—';
  return formatExamDate(dateStr, locale);
}

type ExpiryTone = 'expired' | 'soon' | 'ok';

function expiryText(dateStr: string | null, t: Translate): { text: string; tone: ExpiryTone } | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return { text: t('credentials.expired'), tone: 'expired' };
  if (days <= 90) return { text: t('credentials.expiresInDays', { days }), tone: 'soon' };
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (years > 0) return { text: t('credentials.expiresInYears', { years, months: remMonths }), tone: 'ok' };
  return { text: t('credentials.expiresInMonths', { months }), tone: 'ok' };
}

const EXPIRY_TONE: Record<ExpiryTone, string> = {
  expired: 'font-semibold text-ada2-suspended',
  soon: 'font-semibold text-ada2-ink',
  ok: 'text-ada2-muted',
};

function typeLabel(type: string, t: Translate): string {
  const key = `credentials.types.${type}` as const;
  return t.has(key as never) ? t(key as never) : type;
}

/** A plain tag in the record-tag shape, for statuses StatusTag has no kind for. */
function PlainTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center box-border min-h-[26px] px-2.5 border-[1.5px] border-solid border-ada2-lapsed rounded-[2px] bg-white font-bold text-[12px] leading-none tracking-[0.08em] uppercase whitespace-nowrap text-ada2-lapsed-text">
      {children}
    </span>
  );
}

function ResultTag({ passed, label }: { passed: boolean; label: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 box-border min-h-[26px] px-2.5 border-[1.5px] border-solid rounded-[2px]',
        'font-bold text-[12px] leading-none tracking-[0.08em] uppercase whitespace-nowrap',
        passed ? 'bg-ada2-good-bg text-ada2-good-text border-transparent' : 'bg-white text-ada2-lapsed-text border-ada2-lapsed'
      )}
    >
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true" focusable="false">
        {passed ? <path d="M3.5 8.5l3 3 6-7" /> : <path d="M4 8h8" />}
      </svg>
      {label}
    </span>
  );
}

function DownloadGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" focusable="false">
      <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14" />
    </svg>
  );
}

function ChevronGlyph({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      focusable="false"
      className={cn('flex-none transition-transform motion-reduce:transition-none', open && 'rotate-180')}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

const inputClass =
  'w-full min-w-0 box-border h-[52px] px-4 bg-white border-[1.5px] border-solid border-ada2-muted rounded-[4px] text-[18px] text-ada2-ink appearance-none placeholder:text-ada2-muted';
const fieldLabelClass = 'text-[16px] leading-[22px] font-semibold text-ada2-ink';
const hintClass = 'm-0 text-[15px] leading-[22px] text-ada2-muted [text-wrap:pretty]';
const h2Class = 'm-0 text-[36px] leading-[44px] font-light text-ada2-ink [text-wrap:balance]';
const monoIdClass =
  'font-record-mono font-medium tracking-[0.02em] whitespace-nowrap [font-variant-numeric:tabular-nums_slashed-zero]';

// ============ COMPONENTS ============

function ExamSection({ examResults, t, locale }: { examResults: ExamResult[]; t: Translate; locale: Locale }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="results" aria-labelledby="h-results" className="bg-white scroll-mt-4">
      <div className="ada2-wrap pt-16 flex flex-col gap-4">
        <h2 id="h-results" className={h2Class}>
          {t('results.title')}
        </h2>
        {examResults.length === 0 ? (
          <p className="m-0 text-ada2-body">{t('results.empty')}</p>
        ) : (
          <ul className="m-0 p-0 list-none border-t-2 border-ada2-ink">
            {examResults.map((exam) => {
              const isExpanded = expandedId === exam.id;
              const credLabel = typeLabel(exam.exam_type, t);
              const panelId = `scores-${exam.id}`;
              return (
                <li key={exam.id} className="border-b border-ada2-hairline">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : exam.id)}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    className="w-full flex flex-wrap items-center justify-between gap-x-8 gap-y-3 box-border py-4 px-1 text-left bg-transparent border-0 cursor-pointer text-ada2-ink hover:bg-ada2-band"
                  >
                    <span className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[20px] leading-7 font-semibold">{credLabel}</span>
                      <span className="text-[16px] leading-6 text-ada2-body [font-variant-numeric:tabular-nums_lining-nums]">
                        {formatDate(exam.exam_date, locale)}
                        {' · '}
                        {t('results.session')} <span className={cn(monoIdClass, 'text-[15px] text-ada2-body')}>{exam.exam_session}</span>
                      </span>
                    </span>
                    <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
                      <span className="flex items-baseline gap-1.5 [font-variant-numeric:tabular-nums_lining-nums]">
                        <span className="text-[32px] leading-none font-semibold">{exam.overall_score}</span>
                        <span className="text-[17px] leading-none text-ada2-muted">{t('results.outOf', { max: EXAM.maxScore })}</span>
                      </span>
                      <ResultTag passed={exam.passed} label={exam.passed ? t('results.passed') : t('results.notPassed')} />
                      <span className="inline-flex items-center gap-2 min-h-[44px] text-[16px] leading-[22px] font-semibold">
                        {isExpanded ? t('results.hide') : t('results.show')}
                        <ChevronGlyph open={isExpanded} />
                      </span>
                    </span>
                  </button>

                  {isExpanded && (
                    <div id={panelId} className="pb-6 pt-1">
                      <ScoreTable
                        caption={t('results.caption', { session: exam.exam_session })}
                        colArea={t('results.colArea')}
                        colScore={t('results.colScore')}
                        colAgainst={t('results.colAgainst', { pass: EXAM.passScore })}
                        rows={scoreKeys.map((key) => ({
                          key,
                          label: t(`results.areas.${key}`),
                          score: Number(exam[key as keyof ExamResult]) || 0,
                        }))}
                        pass={EXAM.passScore}
                        max={EXAM.maxScore}
                        atOrAbove={t('results.atOrAbove', { pass: EXAM.passScore })}
                        below={t('results.below', { pass: EXAM.passScore })}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

// ============ MAIN ============

export default function PortalPage() {
  const t = useTranslations('portal');
  const locale = useLocale() as Locale;
  const [data, setData] = useState<PortalData | null>(null);
  const [idCode, setIdCode] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = data
      ? t('meta.titleSignedIn', { name: data.doula.full_name })
      : t('meta.titleSignedOut');
  }, [data, t]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!idCode.trim() || !contactValue.trim()) return;

    setLoading(true);
    setError('');

    try {
      const body: Record<string, string> = { doula_id_code: idCode.trim() };
      if (contactMethod === 'email') body.email = contactValue.trim();
      else body.phone = contactValue.trim();

      const res = await fetch('/api/portal/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await res.json();

      if (res.ok) setData(result);
      else if (res.status === 429) setError(t('signIn.errors.tooMany'));
      else if (res.status === 401) setError(t('signIn.errors.noMatch', { method: contactMethod }));
      else setError(t('signIn.errors.failed'));
    } catch {
      setError(t('signIn.errors.network'));
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setData(null);
    setIdCode('');
    setContactValue('');
    setError('');
  }

  const photoDate = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : htmlLang[locale], {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(PHOTO_DATE);

  // ============ SIGN-IN FORM ============
  if (!data) {
    const isEmail = contactMethod === 'email';
    return (
      <>
        <Breadcrumb items={[{ label: t('breadcrumb.signIn') }]} />

        <div className="flex flex-col gap-20 pt-12 pb-[104px]">
          <div className="ada2-wrap flex flex-wrap items-start gap-x-16 gap-y-12">
            <div className="flex-[3_1_560px] min-w-0 flex flex-col gap-7">
              <div className="flex flex-col gap-4">
                <h1 className="m-0 text-[clamp(40px,3.9vw,56px)] leading-[1.15] font-light text-ada2-ink [text-wrap:balance]">
                  {t('signIn.title')}
                </h1>
                <p className="m-0 max-w-[640px] text-[22px] leading-[31px] font-light text-ada2-body [text-wrap:pretty]">
                  {t('signIn.lead')}
                </p>
              </div>

              <section
                aria-labelledby="signin-title"
                className="box-border px-[clamp(20px,2.4vw,36px)] pt-7 pb-8 bg-ada2-band border-t-2 border-ada2-ink"
              >
                <form onSubmit={handleVerify} className="flex flex-col gap-[22px]">
                  <h2 id="signin-title" className="m-0 text-[28px] leading-[35px] font-light text-ada2-ink">
                    {t('signIn.formTitle')}
                  </h2>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="idCode" className={fieldLabelClass}>
                      {t('signIn.doulaId')}
                    </label>
                    <input
                      id="idCode"
                      type="text"
                      value={idCode}
                      onChange={(e) => setIdCode(e.target.value)}
                      required
                      autoComplete="off"
                      spellCheck={false}
                      aria-describedby="idCode-hint"
                      className={cn(inputClass, 'max-w-[320px] [font-variant-numeric:tabular-nums_lining-nums]')}
                    />
                    <p id="idCode-hint" className={hintClass}>
                      {t('signIn.doulaIdHint', { example: DOULA_ID_EXAMPLE })}
                    </p>
                  </div>

                  <fieldset className="min-w-0 m-0 p-0 border-0">
                    <legend className="p-0 pb-2 text-[16px] leading-[22px] font-semibold text-ada2-ink">
                      {t('signIn.method')}
                    </legend>
                    <div className="inline-flex flex-wrap gap-1 p-1 border border-solid border-ada2-hairline rounded-full bg-white">
                      {(['email', 'phone'] as const).map((method) => {
                        const on = contactMethod === method;
                        return (
                          <button
                            key={method}
                            type="button"
                            aria-pressed={on}
                            onClick={() => { setContactMethod(method); setContactValue(''); }}
                            className={cn(
                              'min-h-[44px] px-[18px] border-0 rounded-full text-[16px] leading-5 font-semibold cursor-pointer whitespace-nowrap',
                              on ? 'bg-ada2-ink text-white' : 'bg-white text-ada2-ink hover:bg-ada2-band'
                            )}
                          >
                            {method === 'email' ? t('signIn.methodEmail') : t('signIn.methodPhone')}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="contactValue" className={fieldLabelClass}>
                      {isEmail ? t('signIn.emailLabel') : t('signIn.phoneLabel')}
                    </label>
                    <input
                      id="contactValue"
                      type={isEmail ? 'email' : 'tel'}
                      inputMode={isEmail ? 'email' : 'tel'}
                      autoComplete={isEmail ? 'email' : 'tel'}
                      spellCheck={false}
                      value={contactValue}
                      onChange={(e) => setContactValue(e.target.value)}
                      placeholder={isEmail ? 'name@example.com' : undefined}
                      required
                      aria-describedby="contactValue-hint"
                      className={cn(inputClass, !isEmail && '[font-variant-numeric:tabular-nums_lining-nums]')}
                    />
                    <p id="contactValue-hint" className={hintClass}>
                      {isEmail ? t('signIn.emailHint') : t('signIn.phoneHint')}
                    </p>
                  </div>

                  {error && (
                    <p role="alert" className="m-0 pl-3.5 border-l-4 border-solid border-ada2-suspended text-[16px] leading-6 text-ada2-ink">
                      {error}
                    </p>
                  )}

                  <div>
                    <button type="submit" disabled={loading} className={pillClassName('primary')}>
                      {loading ? t('signIn.submitting') : t('signIn.submit')}
                    </button>
                  </div>

                  <p className="m-0 pt-4 border-t border-ada2-hairline text-[15px] leading-[22px] text-ada2-muted [text-wrap:pretty]">
                    {t('signIn.note')}
                  </p>
                </form>
              </section>
            </div>

            <section aria-labelledby="who-title" className="flex-[2_1_380px] min-w-0 flex flex-col gap-4 pt-2">
              <h2 id="who-title" className="m-0 text-[28px] leading-[35px] font-light text-ada2-ink">
                {t('who.title')}
              </h2>
              <dl className="m-0 flex flex-col border-t-2 border-ada2-ink">
                <div className="flex flex-col gap-0.5 py-3.5 border-b border-ada2-hairline">
                  <dt className="text-[17px] leading-6 font-semibold text-ada2-ink">{t('who.doulasTitle')}</dt>
                  <dd className="m-0 text-[16px] leading-6 text-ada2-body [text-wrap:pretty]">{t('who.doulasBody')}</dd>
                </div>
                <div className="flex flex-col gap-0.5 py-3.5 border-b border-ada2-hairline">
                  <dt className="text-[17px] leading-6 font-semibold text-ada2-ink">{t('who.familiesTitle')}</dt>
                  <dd className="m-0 text-[16px] leading-6 text-ada2-body [text-wrap:pretty]">{t('who.familiesBody')}</dd>
                  <dd className="m-0">
                    <ArrowLink href="/verify" tone="registry" size="sm">
                      {t('who.familiesLink')}
                    </ArrowLink>
                  </dd>
                </div>
                <div className="flex flex-col gap-0.5 py-3.5 border-b border-ada2-hairline">
                  <dt className="text-[17px] leading-6 font-semibold text-ada2-ink">{t('who.staffTitle')}</dt>
                  <dd className="m-0 text-[16px] leading-6 text-ada2-body [text-wrap:pretty]">{t('who.staffBody')}</dd>
                  <dd className="m-0">
                    <ArrowLink href="/admin/login" size="sm">
                      {t('who.staffLink')}
                    </ArrowLink>
                  </dd>
                </div>
              </dl>
            </section>
          </div>

          <RuledRows
            id="trouble-title"
            title={t('trouble.title')}
            image={{
              src: '/images/2026/ada-care-seated.jpg',
              alt: t('trouble.photoAlt'),
              caption: t('trouble.photoCaption', { date: photoDate }),
            }}
            rows={[
              { label: t('trouble.idTitle'), value: t('trouble.idBody') },
              { label: t('trouble.methodTitle'), value: t('trouble.methodBody') },
              {
                label: t('trouble.askTitle'),
                value: t('trouble.askBody', { email: CONTACT.email, phone: PHONE }),
              },
            ]}
          />
        </div>
      </>
    );
  }

  // ============ SIGNED IN ============
  const { doula, credentials, certificates, exam_results } = data;
  const isActive = doula.status === 'active';
  const statusKey = `standing.status.${doula.status}`;
  const statusLabel = t.has(statusKey as never) ? t(statusKey as never) : doula.status;
  const activeCredentials = credentials.filter((c) => c.status === 'active');

  const standingBody = isActive
    ? t('standing.bodyActive', { count: activeCredentials.length })
    : doula.status === 'registered'
      ? t('standing.bodyRegistered')
      : doula.status === 'under_investigation'
        ? t('standing.bodyReview')
        : t('standing.bodyOther');

  // Credentials joined with their active certificate (same type); active
  // certificates with no matching credential (e.g. trainer, cpr) get their own row.
  const activeCerts = certificates.filter((c) => c.status === 'active');
  const usedCerts = new Set<string>();
  type Row = {
    key: string;
    label: string;
    tag: ReactNode;
    cert: Certificate | null;
    certified: string | null;
    expires: string | null;
    isCredential: boolean;
  };
  const credentialTag = (status: string) => {
    const kind = credentialStatusTag(status);
    if (kind) return <StatusTag status={kind} />;
    return <PlainTag>{status === 'under_investigation' ? t('credentials.underReview') : status}</PlainTag>;
  };
  const rows: Row[] = [
    ...credentials.map((cred) => {
      const cert = activeCerts.find((c) => c.certificate_type === cred.credential_type && !usedCerts.has(c.id)) ?? null;
      if (cert) usedCerts.add(cert.id);
      return {
        key: `cred-${cred.credential_type}`,
        label: typeLabel(cred.credential_type, t),
        tag: credentialTag(cred.status),
        cert,
        certified: cred.certification_date,
        expires: cred.expiration_date,
        isCredential: true,
      };
    }),
    ...activeCerts
      .filter((c) => !usedCerts.has(c.id))
      .map((cert) => {
        const kind = certificateStatusTag(cert.status);
        return {
          key: `cert-${cert.id}`,
          label: typeLabel(cert.certificate_type, t),
          tag: kind ? <StatusTag status={kind} /> : <PlainTag>{cert.status}</PlainTag>,
          cert,
          certified: cert.issued_date,
          expires: null,
          isCredential: false,
        };
      }),
  ];

  // The credential that expires next (for the standing panel and the renewal CTA).
  const nextToExpire =
    activeCredentials
      .filter((c) => c.expiration_date)
      .sort((a, b) => (a.expiration_date! < b.expiration_date! ? -1 : 1))[0] ?? null;

  const publicRecordHref = `/verify/${encodeURIComponent(doula.doula_id_code.replace(/^#/, ''))}`;
  const certHref = (cert: Certificate) => `/verify/${encodeURIComponent(cert.certificate_number)}`;

  const validThrough = (row: Row) => {
    if (!row.isCredential) return <span className="text-ada2-muted">—</span>;
    const exp = expiryText(row.expires, t);
    return (
      <span className="flex flex-col gap-0.5">
        <span className="font-semibold text-ada2-ink">
          {row.expires ? formatDate(row.expires, locale) : t('credentials.noExpiry')}
        </span>
        {exp ? <span className={cn('text-[14px] leading-5', EXPIRY_TONE[exp.tone])}>{exp.text}</span> : null}
      </span>
    );
  };

  const certNumber = (row: Row) =>
    row.cert ? (
      <a
        href={certHref(row.cert)}
        className={cn(monoIdClass, 'text-[15px] text-ada2-blossom underline underline-offset-[3px] hover:text-ada2-blossom-hover')}
      >
        {row.cert.certificate_number}
      </a>
    ) : (
      <span className="text-ada2-muted">{t('credentials.noCertificate')}</span>
    );

  const download = (row: Row, full = false) =>
    row.cert?.pdf_url ? (
      <a
        href={row.cert.pdf_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('credentials.downloadLabel', { credential: row.label, number: row.cert.certificate_number })}
        className={pillClassName('secondary', full ? 'md' : 'sm', full ? 'w-full' : undefined)}
      >
        <DownloadGlyph />
        {full ? t('credentials.downloadPdf') : t('credentials.download')}
      </a>
    ) : row.cert ? (
      <span className="text-[15px] leading-5 text-ada2-muted">{t('credentials.noPdf')}</span>
    ) : null;

  const profileRows = [
    doula.email ? { label: t('profile.email'), value: <span className="[overflow-wrap:anywhere]">{doula.email}</span> } : null,
    doula.phone ? { label: t('profile.phone'), value: doula.phone } : null,
    doula.languages && doula.languages.length > 0 ? { label: t('profile.languages'), value: doula.languages.join(', ') } : null,
    doula.region ? { label: t('profile.region'), value: doula.region } : null,
  ].filter(Boolean) as { label: string; value: ReactNode }[];

  const navItems = [
    { href: '#standing', label: t('account.nav.standing') },
    { href: '#credentials', label: t('account.nav.credentials') },
    { href: '#results', label: t('account.nav.results') },
    { href: '#profile', label: t('account.nav.profile') },
    { href: '#help', label: t('account.nav.help') },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: t('breadcrumb.account') }]} />

      {/* Page head: plain H1, identity, section links */}
      <section aria-labelledby="page-title" className="bg-white">
        <div className="ada2-wrap pt-10 flex flex-col gap-3">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div className="flex flex-col gap-3 min-w-0">
              <h1 id="page-title" className="m-0 text-[clamp(40px,3.9vw,56px)] leading-[1.15] font-light text-ada2-ink [text-wrap:balance]">
                {t('account.title')}
              </h1>
              <p className="m-0 flex flex-wrap items-baseline gap-x-4 gap-y-0.5 text-[22px] leading-[31px] font-light text-ada2-body">
                <span className="font-semibold text-ada2-ink">{doula.full_name}</span>
                {doula.full_name_zh && (
                  <span lang="zh-Hans" className="font-normal text-ada2-muted">
                    {doula.full_name_zh}
                  </span>
                )}
                <span className="text-[17px] leading-6 font-normal text-ada2-muted">
                  {t('account.doulaId')}{' '}
                  <span className={cn(monoIdClass, 'text-[17px] text-ada2-blossom')}>{doula.doula_id_code}</span>
                </span>
              </p>
            </div>
            <Pill variant="secondary" onClick={handleLogout}>
              {t('account.signOut')}
            </Pill>
          </div>
          <nav
            aria-label={t('account.sectionsLabel')}
            className="mt-3 hidden md:flex flex-wrap items-center gap-x-7 border-y border-ada2-hairline text-[16px] leading-5"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex items-center min-h-[48px] text-ada2-body no-underline hover:text-ada2-ink hover:underline underline-offset-4"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Standing + right-rail CTA */}
      <div className="ada2-wrap pt-8 flex flex-wrap items-start gap-x-12 gap-y-8">
        <section
          id="standing"
          aria-labelledby="h-standing"
          className="flex-[999_1_560px] min-w-0 box-border px-[clamp(20px,2vw,28px)] pt-6 pb-7 bg-ada2-band border-t-2 border-ada2-ink flex flex-col gap-4 scroll-mt-4"
        >
          <h2 id="h-standing" className="m-0 text-[17px] leading-[22px] font-semibold text-ada2-ink">
            {t('standing.title')}
          </h2>
          <div className="flex items-center gap-3.5">
            {isActive ? (
              <svg width="34" height="34" viewBox="0 0 16 16" fill="none" stroke="#1D6A45" strokeWidth="1.8" strokeLinecap="square" aria-hidden="true" focusable="false" className="flex-none">
                <path d="M3.5 8.5l3 3 6-7" />
              </svg>
            ) : null}
            <p className="m-0 text-[clamp(32px,3vw,40px)] leading-[1.2] font-light text-ada2-ink">
              {isActive ? t('standing.goodStanding') : statusLabel}
            </p>
          </div>
          <p className="m-0 max-w-[760px] text-ada2-body [text-wrap:pretty]">{standingBody}</p>
          <dl className="m-0 flex flex-wrap gap-x-12 gap-y-4 py-4 border-y border-ada2-hairline [font-variant-numeric:tabular-nums_lining-nums]">
            <div className="flex flex-col gap-0.5">
              <dt className="text-[14px] leading-5 font-semibold text-ada2-muted">{t('standing.statActive')}</dt>
              <dd className="m-0 text-[20px] leading-7 font-semibold text-ada2-ink">{activeCredentials.length}</dd>
            </div>
            {nextToExpire ? (
              <div className="flex flex-col gap-0.5">
                <dt className="text-[14px] leading-5 font-semibold text-ada2-muted">
                  {t('standing.statValidThrough', { credential: typeLabel(nextToExpire.credential_type, t) })}
                </dt>
                <dd className="m-0 text-[20px] leading-7 font-semibold text-ada2-ink">
                  {formatDate(nextToExpire.expiration_date, locale)}
                </dd>
              </div>
            ) : null}
            <div className="flex flex-col gap-0.5">
              <dt className="text-[14px] leading-5 font-semibold text-ada2-muted">{t('standing.statCertificates')}</dt>
              <dd className="m-0 text-[20px] leading-7 font-semibold text-ada2-ink">{activeCerts.length}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap items-center justify-end">
            <ArrowLink href={publicRecordHref} tone="registry">
              {t('standing.publicRecord')}
            </ArrowLink>
          </div>
        </section>
        {nextToExpire ? (
          <CtaBox
            title={t('cta.renew', {
              credential: typeLabel(nextToExpire.credential_type, t),
              date: formatDate(nextToExpire.expiration_date, locale),
            })}
            action={{ href: '/for-doulas/renew', label: t('cta.renewAction') }}
          />
        ) : null}
      </div>

      {/* Credentials and certificates */}
      <section id="credentials" aria-labelledby="h-cred" className="bg-white scroll-mt-4">
        <div className="ada2-wrap pt-14 flex flex-col gap-4">
          <h2 id="h-cred" className={h2Class}>
            {t('credentials.title')}
          </h2>
          {rows.length === 0 ? (
            <p className="m-0 text-ada2-body">{t('credentials.empty')}</p>
          ) : (
            <>
              {/* Desktop: dark-header table */}
              <div className="hidden lg:block overflow-x-auto border border-ada2-hairline">
                <table className="w-full border-collapse bg-white text-[16px] leading-[22px] [font-variant-numeric:tabular-nums_lining-nums]">
                  <caption className="ada2-sr">
                    {t('credentials.caption', { name: doula.full_name, id: doula.doula_id_code })}
                  </caption>
                  <thead>
                    <tr className="bg-ada2-table-head text-white">
                      {[
                        t('credentials.colCredential'),
                        t('credentials.colStatus'),
                        t('credentials.colCertificate'),
                        t('credentials.colCertified'),
                        t('credentials.colValidThrough'),
                        t('credentials.colPdf'),
                      ].map((label) => (
                        <th key={label} scope="col" className="text-left align-bottom py-3 px-4 text-[14px] leading-[18px] font-semibold">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.key} className="border-b border-ada2-hairline last:border-b-0">
                        <th scope="row" className="text-left py-2.5 px-4 font-bold text-ada2-ink whitespace-nowrap">
                          {row.label}
                        </th>
                        <td className="py-2.5 px-4 whitespace-nowrap">{row.tag}</td>
                        <td className="py-2.5 px-4 whitespace-nowrap">{certNumber(row)}</td>
                        <td className="py-2.5 px-4 whitespace-nowrap">{formatDate(row.certified, locale)}</td>
                        <td className="py-2.5 px-4 whitespace-nowrap">{validThrough(row)}</td>
                        <td className="py-2 px-4">{download(row)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Phone: one ruled block per credential (MyADAMobile) */}
              <ul className="lg:hidden m-0 p-0 list-none flex flex-col gap-6">
                {rows.map((row) => (
                  <li key={row.key} className="flex flex-col gap-3 pt-4 border-t-2 border-ada2-ink">
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                      <h3 className="m-0 text-[20px] leading-[26px] font-semibold text-ada2-ink">{row.label}</h3>
                      {row.tag}
                    </div>
                    <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[16px] leading-6 [font-variant-numeric:tabular-nums_lining-nums]">
                      <dt className="text-ada2-body">{t('credentials.certificate')}</dt>
                      <dd className="m-0 min-w-0">{certNumber(row)}</dd>
                      <dt className="text-ada2-body">{t('credentials.colCertified')}</dt>
                      <dd className="m-0 text-ada2-ink">{formatDate(row.certified, locale)}</dd>
                      <dt className="text-ada2-body">{t('credentials.colValidThrough')}</dt>
                      <dd className="m-0">{validThrough(row)}</dd>
                    </dl>
                    {row.cert?.pdf_url ? <div className="pt-1">{download(row, true)}</div> : download(row, true)}
                  </li>
                ))}
              </ul>

              {rows.some((r) => r.cert) ? (
                <p className="m-0 text-[14px] leading-[21px] text-ada2-muted [text-wrap:pretty]">{t('credentials.footnote')}</p>
              ) : null}
            </>
          )}
        </div>
      </section>

      {/* Exam results */}
      <ExamSection examResults={exam_results} t={t} locale={locale} />

      {/* Profile */}
      <section id="profile" aria-labelledby="h-profile" className="bg-white scroll-mt-4">
        <div className="ada2-wrap pt-16 flex flex-col gap-5">
          <div className="max-w-[760px] flex flex-col gap-5">
            <h2 id="h-profile" className={h2Class}>
              {t('profile.title')}
            </h2>
            {profileRows.length > 0 ? (
              <dl className="m-0 flex flex-col border-t-2 border-ada2-ink">
                {profileRows.map((row) => (
                  <div key={row.label} className="flex flex-wrap gap-x-6 gap-y-0.5 py-3 border-b border-ada2-hairline">
                    <dt className="flex-[0_0_160px] font-semibold text-ada2-ink">{row.label}</dt>
                    <dd className="flex-[1_1_300px] min-w-0 m-0 text-ada2-body">{row.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            <p className="m-0 text-[15px] leading-[22px] text-ada2-muted [text-wrap:pretty]">
              {t('profile.note', { email: CONTACT.email, phone: PHONE })}
            </p>
          </div>
        </div>
      </section>

      {/* Help */}
      <div id="help" className="pt-16 pb-[72px] scroll-mt-4">
        <LinkList
          id="help-title"
          title={t('help.title')}
          items={[
            {
              href: '/for-doulas/renew',
              label: t('help.renew'),
              description: t('help.renewDesc', { years: CERTIFICATE.validityYears, fee: usd(RENEWAL.feeUsd) }),
            },
            { href: '/for-doulas/code-of-conduct', label: t('help.conduct'), description: t('help.conductDesc') },
            { href: '/verify', label: t('help.registry'), description: t('help.registryDesc') },
            {
              href: '/support/contact',
              label: t('help.contact'),
              description: t('help.contactDesc', { email: CONTACT.email, phone: PHONE }),
            },
          ]}
        />
      </div>
    </>
  );
}

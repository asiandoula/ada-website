/**
 * Copy helpers shared by the search page and the record page. Pure: pass the
 * `record` namespace translator in. Every date is a DB value formatted here;
 * nothing is typed into a message.
 */
import type { Locale } from '@/i18n/config';
import { formatExamDate, todayInPacific } from '@/lib/site-dates';
import type { StatusKind } from '@/components/site';
import type { CertificateKey, CredentialState, PublicCertificate, PublicCredential } from './registry';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Translate = (key: string, values?: Record<string, any>) => string;

/** "YYYY-MM-DD" → "12 Nov 2027" / "2027年11月12日" (no weekday). */
export function formatDay(iso: string, locale: Locale): string {
  return formatExamDate(iso, locale, { weekday: false });
}

/** Page-side retrieval line: "Thu 5 Nov 2026 · 10:42 PT" / "2026年11月5日（周四） · 10:42 PT". */
export function formatRetrievedLine(at: Date, locale: Locale): string {
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Los_Angeles',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(at);
  return `${formatExamDate(todayInPacific(at), locale)} · ${time} PT`;
}

/** The lang tag for a native name, so the right Noto face is used. */
const HANGUL = new RegExp('\\p{Script=Hangul}', 'u');
const KANA = new RegExp('[\\p{Script=Hiragana}\\p{Script=Katakana}]', 'u');
const HAN = new RegExp('\\p{Script=Han}', 'u');

export function nativeNameLang(name: string): string | undefined {
  if (HANGUL.test(name)) return 'ko';
  if (KANA.test(name)) return 'ja';
  if (HAN.test(name)) return 'zh-Hans';
  return undefined;
}

export function credentialLabel(t: Translate, type: CertificateKey): string {
  return t(`credential.${type}`);
}

/** Join sentences: a space in English, nothing in Chinese and Japanese. */
export function joinSentences(parts: string[], locale: Locale): string {
  return parts.join(locale === 'zh-cn' || locale === 'zh-tw' || locale === 'ja' ? '' : ' ');
}

/** Join labels: "Postpartum Doula and Birth Doula" / "产后导乐和分娩导乐". */
export function joinList(items: string[], locale: Locale): string {
  const tag = locale === 'en' ? 'en' : locale === 'zh-cn' ? 'zh-CN' : locale === 'zh-tw' ? 'zh-TW' : locale;
  try {
    return new Intl.ListFormat(tag, { style: 'long', type: 'conjunction' }).format(items);
  } catch {
    return items.join(', ');
  }
}

/** The status tag for a credential state. */
export function credentialTag(status: CredentialState): StatusKind {
  return status;
}

/** One line under a credential's status tag (board: "Meets ADA certification requirements through 12 Nov 2027."). */
export function credentialMeaning(t: Translate, c: PublicCredential, locale: Locale, today: string = todayInPacific()): string {
  switch (c.status) {
    case 'active':
      return c.periodEnds ? t('meaning.activeThrough', { date: formatDay(c.periodEnds, locale) }) : t('meaning.active');
    case 'expired':
      // A row marked expired with a future end date: do not print "not renewed by" a date that has not come.
      return c.periodEnds && c.periodEnds < today
        ? t('meaning.expiredBy', { date: formatDay(c.periodEnds, locale) })
        : t('meaning.expired');
    case 'suspended':
      return t('meaning.suspended');
    case 'revoked':
      return c.revokedOn ? t('meaning.revokedOn', { date: formatDay(c.revokedOn, locale) }) : t('meaning.revoked');
    case 'retired':
      return t('meaning.retired');
  }
}

/** Tag for a certificate state. notCurrent uses the lapsed tag with the "Not current" label. */
export function certificateTag(c: PublicCertificate): { status: StatusKind; notCurrent: boolean } {
  switch (c.state) {
    case 'current':
      return { status: 'current', notCurrent: false };
    case 'superseded':
      return { status: 'superseded', notCurrent: false };
    case 'withdrawn':
      return { status: 'withdrawn', notCurrent: false };
    case 'notCurrent':
      return { status: 'expired', notCurrent: true };
  }
}

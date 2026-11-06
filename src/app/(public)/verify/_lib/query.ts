/**
 * Registry query parsing. Pure (no server imports), so the search panel's
 * "detected as" chip and the server search agree on what a query is.
 *
 *   doula_id      "#25-3107", "25-3107", "#39711", "39711"  → exact doula_id_code
 *   cert_number   "ADA-PD-2026-0142" (any case)             → exact certificate_number
 *   code_or_name  one 6–10 character token of [A-Za-z0-9_-]  → exact verification_code
 *                 (case-sensitive), then a name search if it is letters only
 *   name          anything else                              → name search
 *
 * Minimum lengths (2026-11 fix): 2 for codes, 3 for names. A name written in
 * Chinese, Japanese or Korean needs 2: many Chinese names are two characters.
 */

export type QueryKind = 'doula_id' | 'cert_number' | 'code_or_name' | 'name';

export const MIN_CODE_LENGTH = 2;
export const MIN_NAME_LENGTH = 3;
export const MIN_CJK_NAME_LENGTH = 2;
/** Longest query we accept (longer input is cut). */
export const MAX_QUERY_LENGTH = 80;

// RegExp() rather than literals: tsconfig has no ES target, and tsc rejects the u flag in literals.
const CJK = new RegExp('[\\p{Script=Han}\\p{Script=Hangul}\\p{Script=Hiragana}\\p{Script=Katakana}]', 'u');
const NOT_LETTER = new RegExp('[^\\p{L}\\p{M}\\p{N}]', 'gu');
const NOT_NAME_CHAR = new RegExp("[^\\p{L}\\p{M}\\p{N}'’.\\-]", 'gu');
const DASHES = /[‐-―−﹘﹣－]/g;

export function hasCjk(s: string): boolean {
  return CJK.test(s);
}

/** Trim, collapse spaces, turn typographic dashes and the full-width # into ASCII. */
export function normalizeQuery(raw: string | null | undefined): string {
  return (raw ?? '')
    .normalize('NFKC')
    .replace(DASHES, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_QUERY_LENGTH);
}

export interface ParsedQuery {
  kind: QueryKind;
  /** The value to look up: "#25-3107", "ADA-PD-2026-0142", the code as typed, or the name. */
  value: string;
  /** False when the query is shorter than the minimum for its kind. */
  longEnough: boolean;
  /** The minimum for its kind (for the error message). */
  min: number;
}

export function parseQuery(raw: string | null | undefined): ParsedQuery | null {
  const q = normalizeQuery(raw);
  if (!q) return null;

  // Doula ID: a leading #, "YY-N…", or digits only.
  if (q.startsWith('#') || /^\d{2}-\d+$/.test(q) || /^\d+$/.test(q)) {
    const digits = q.replace(/^#+/, '').replace(/\s+/g, '');
    return { kind: 'doula_id', value: `#${digits}`, longEnough: digits.length >= MIN_CODE_LENGTH, min: MIN_CODE_LENGTH };
  }

  // Certificate number: ADA-PD-2026-0142 (stored upper case).
  if (/^ada-/i.test(q)) {
    const value = q.replace(/\s+/g, '').toUpperCase();
    return { kind: 'cert_number', value, longEnough: value.length >= MIN_CODE_LENGTH, min: MIN_CODE_LENGTH };
  }

  // Certificate code (verification_code): 8 mixed-case characters, may contain - or _.
  if (/^[A-Za-z0-9_-]{6,10}$/.test(q)) {
    return { kind: 'code_or_name', value: q, longEnough: true, min: MIN_CODE_LENGTH };
  }

  const letters = q.replace(NOT_LETTER, '');
  const min = hasCjk(q) ? MIN_CJK_NAME_LENGTH : MIN_NAME_LENGTH;
  return { kind: 'name', value: q, longEnough: Array.from(letters).length >= min, min };
}

/** A code-shaped token that could also be a name ("Jennifer"): letters only. */
export function couldBeName(value: string): boolean {
  return /^[A-Za-z]+$/.test(value);
}

/**
 * Name search tokens: letters, marks, digits, apostrophes, periods and hyphens
 * only. Everything else (%, _, *, commas, brackets) is dropped so it cannot act
 * as a LIKE wildcard or break the PostgREST filter.
 */
export function nameTokens(name: string): string[] {
  return normalizeQuery(name)
    .split(' ')
    .map((t) => t.replace(NOT_NAME_CHAR, ''))
    .filter(Boolean)
    .slice(0, 6);
}

/** For the URL of a record opened by Doula ID: "#25-3107" → "25-3107" (a literal # would be a fragment). */
export function doulaIdSlug(doulaIdCode: string): string {
  return doulaIdCode.replace(/^#+/, '');
}

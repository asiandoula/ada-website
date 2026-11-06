/**
 * The public ADA registry: one place that reads doulas, credentials and
 * certificates and turns them into what a verifier may see. SERVER ONLY (it
 * reads with the service role). Used by /verify, /verify/[code] and
 * /api/verify/search, so their status rules cannot drift.
 *
 * What is public
 *   - Only explicit columns are selected; the internal UUID is read to join
 *     rows but never returned. No email, phone, date of birth, PDF URL,
 *     exam data or doulas.status string leaves this file.
 *   - A credential is shown only when ADA issued it: it has a certification
 *     date, or a certificate of its type exists. (Rows with neither are
 *     candidate placeholders, e.g. status "active" with no dates after a
 *     failed exam.) A doula with no shown credential and no certificate is
 *     not in the public registry: search skips them, the record page says
 *     "no record".
 *   - "under_investigation" is never public (complaints under review are not
 *     published): the credential reads as active or expired by its dates.
 *
 * Status rules
 *   credential  revoked / suspended / retired from the credential row, or from
 *               doulas.status when that is revoked / suspended / retired (an
 *               admin may set it on the person only); otherwise expired when
 *               the row says expired or its end date has passed (Pacific
 *               calendar day); otherwise active.
 *   end date    doula_credentials.expiration_date (the source of truth); when
 *               that is empty, the current certificate's expiration_date
 *               (except IBCLC Training, which has no end date).
 *   revoked on  the calendar day of certificates.revoked_at (UTC, like issued_date), only for a
 *               revoked credential and only when such a certificate exists.
 *               There is no suspension date in the database, so none is shown.
 *   certificate active → current, or not current / withdrawn when its
 *               credential is lapsed / revoked; superseded; revoked → withdrawn.
 */
import { unstable_noStore as noStore } from 'next/cache';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { todayInPacific } from '@/lib/site-dates';
import { couldBeName, doulaIdSlug, hasCjk, nameTokens, parseQuery, type ParsedQuery } from './query';

// ---------------------------------------------------------------------------
// Public shapes
// ---------------------------------------------------------------------------

export type CredentialKey = 'postpartum' | 'birth' | 'ibclc_training' | 'trainer';
export type CertificateKey = 'postpartum' | 'birth' | 'ibclc_training' | 'trainer' | 'cpr';
export type CredentialState = 'active' | 'expired' | 'suspended' | 'revoked' | 'retired';
export type Standing = 'good' | 'retired' | 'lapsed' | 'suspended' | 'revoked';

export interface PublicCredential {
  type: CredentialKey;
  status: CredentialState;
  /** "YYYY-MM-DD" or null. */
  firstCertified: string | null;
  /** End of the current period, "YYYY-MM-DD"; null = no end date. */
  periodEnds: string | null;
  /** Revoked credentials only, when known. */
  revokedOn: string | null;
  /** The current certificate's number, if one is in effect. */
  currentCertificate: string | null;
}

/** How a certificate reads today. */
export type CertificateState = 'current' | 'notCurrent' | 'superseded' | 'withdrawn';

export interface PublicCertificate {
  number: string;
  /** verification_code: the certificate's permalink code. */
  code: string | null;
  type: CertificateKey;
  state: CertificateState;
  /** For notCurrent: why (its credential's state). */
  credentialState: CredentialState | null;
  /** For notCurrent with an expired credential: when it ended. */
  credentialEnded: string | null;
  issued: string | null;
  /** For withdrawn: the Pacific day of revoked_at, when known. */
  withdrawnOn: string | null;
  /** For superseded: the holder's current certificate of the same type, issued after this one. */
  replacedBy: { number: string; issued: string | null } | null;
}

export interface PublicRecord {
  /** "#25-3107". */
  doulaId: string;
  /** "25-3107", for /verify/<slug>. */
  slug: string;
  name: string;
  nativeName: string | null;
  standing: Standing;
  credentials: PublicCredential[];
  /** Newest first. */
  certificates: PublicCertificate[];
}

export interface RecordLookup {
  record: PublicRecord;
  /** The certificate the link points at (opened by certificate code or number). */
  linked: PublicCertificate | null;
  /** The path segment to print as this record's permalink. */
  permalinkPath: string;
}

export type SearchType = 'name' | 'doula_id' | 'cert_number' | 'verification_code';

export type SearchOutcome =
  | { status: 'empty' }
  | { status: 'tooShort'; kind: ParsedQuery['kind']; min: number; query: string }
  | { status: 'exact'; type: Exclude<SearchType, 'name'>; query: string; href: string; record: PublicRecord }
  | { status: 'list'; type: 'name'; query: string; records: PublicRecord[]; truncated: boolean }
  | { status: 'notFound'; type: SearchType; query: string }
  | { status: 'error'; query: string };

export const SEARCH_LIMIT = 10;

// ---------------------------------------------------------------------------
// Rows (internal)
// ---------------------------------------------------------------------------

interface DoulaRow {
  id: string;
  doula_id_code: string;
  full_name: string;
  full_name_zh: string | null;
  status: string | null;
}

interface CredentialRow {
  doula_id: string;
  credential_type: string;
  status: string | null;
  certification_date: string | null;
  expiration_date: string | null;
}

interface CertificateRow {
  doula_id: string;
  certificate_type: string;
  certificate_number: string | null;
  verification_code: string | null;
  status: string | null;
  issued_date: string | null;
  expiration_date: string | null;
  revoked_at: string | null;
  created_at: string | null;
}

const DOULA_COLUMNS = 'id, doula_id_code, full_name, full_name_zh, status';
const CREDENTIAL_COLUMNS = 'doula_id, credential_type, status, certification_date, expiration_date';
const CERTIFICATE_COLUMNS =
  'doula_id, certificate_type, certificate_number, verification_code, status, issued_date, expiration_date, revoked_at, created_at';

const CREDENTIAL_ORDER: readonly CredentialKey[] = ['postpartum', 'birth', 'ibclc_training', 'trainer'];
const CERTIFICATE_TYPES: readonly CertificateKey[] = ['postpartum', 'birth', 'ibclc_training', 'trainer', 'cpr'];

function db(): SupabaseClient {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}

/** "YYYY-MM-DD" of a DATE column, or null. */
function day(v: string | null | undefined): string | null {
  if (!v) return null;
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(v);
  return m ? m[1] : null;
}

/**
 * Calendar day of a timestamptz, on the same convention as the DATE columns it
 * is printed beside: /api/certificates/generate writes issued_date as the UTC
 * day, so revoked_at is read as a UTC day too. (Reading it in Pacific time
 * would show a certificate withdrawn the day before it was issued when both
 * happened on a California evening.)
 */
function eventDay(ts: string | null | undefined): string | null {
  if (!ts) return null;
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

const byCreated = (a: CertificateRow, b: CertificateRow) =>
  (a.created_at ?? a.issued_date ?? '').localeCompare(b.created_at ?? b.issued_date ?? '');

// ---------------------------------------------------------------------------
// Derivation
// ---------------------------------------------------------------------------

function credentialState(
  rowStatus: string | null,
  personStatus: string | null,
  end: string | null,
  today: string
): CredentialState | null {
  if (rowStatus === 'revoked' || personStatus === 'revoked') return 'revoked';
  if (rowStatus === 'suspended' || personStatus === 'suspended') return 'suspended';
  if (rowStatus === 'retired' || personStatus === 'retired') return 'retired';
  if (rowStatus === 'expired') return 'expired';
  if (rowStatus === 'active' || rowStatus === 'certified_active' || rowStatus === 'under_investigation') {
    return end && end < today ? 'expired' : 'active';
  }
  // exam_scheduled, exam_failed, registered…: not an issued credential.
  return null;
}

function standingOf(credentials: PublicCredential[]): Standing {
  if (credentials.some((c) => c.status === 'revoked')) return 'revoked';
  if (credentials.some((c) => c.status === 'suspended')) return 'suspended';
  if (credentials.some((c) => c.status === 'active')) return 'good';
  if (credentials.some((c) => c.status === 'retired')) return 'retired';
  return 'lapsed';
}

function isCertificateKey(v: string): v is CertificateKey {
  return (CERTIFICATE_TYPES as readonly string[]).includes(v);
}

export function buildRecord(
  doula: DoulaRow,
  credRows: CredentialRow[],
  certRows: CertificateRow[],
  today: string = todayInPacific()
): PublicRecord | null {
  const certs = certRows.filter((c) => c.certificate_number && isCertificateKey(c.certificate_type)).sort(byCreated);
  const ofType = (type: string) => certs.filter((c) => c.certificate_type === type);
  const latestActive = (type: string) => ofType(type).filter((c) => c.status === 'active').at(-1) ?? null;
  const latestRevoked = (type: string) => ofType(type).filter((c) => c.status === 'revoked').at(-1) ?? null;

  const credentials: PublicCredential[] = [];

  for (const row of credRows) {
    const type = row.credential_type as CredentialKey;
    if (!CREDENTIAL_ORDER.includes(type)) continue;
    const typeCerts = ofType(type);
    if (!row.certification_date && typeCerts.length === 0) continue; // never issued
    const current = latestActive(type);
    const end = day(row.expiration_date) ?? (type === 'ibclc_training' ? null : day(current?.expiration_date));
    const status = credentialState(row.status, doula.status, end, today);
    if (!status) continue;
    credentials.push({
      type,
      status,
      firstCertified: day(row.certification_date) ?? day(typeCerts[0]?.issued_date),
      periodEnds: end,
      revokedOn: status === 'revoked' ? eventDay(latestRevoked(type)?.revoked_at) : null,
      currentCertificate: status === 'revoked' ? null : (current?.certificate_number ?? null),
    });
  }

  // ADA Certified Trainer has certificates but no credential row: read it from its certificates.
  if (!credentials.some((c) => c.type === 'trainer')) {
    const trainer = ofType('trainer');
    const current = latestActive('trainer');
    const revoked = latestRevoked('trainer');
    const source = current ?? (revoked && trainer.at(-1) === revoked ? revoked : null);
    if (source) {
      const end = day(current?.expiration_date);
      const status = credentialState(current ? 'active' : 'revoked', doula.status, end, today);
      if (status) {
        credentials.push({
          type: 'trainer',
          status,
          firstCertified: day(trainer[0]?.issued_date),
          periodEnds: end,
          revokedOn: status === 'revoked' ? eventDay(revoked?.revoked_at) : null,
          currentCertificate: status === 'revoked' ? null : (current?.certificate_number ?? null),
        });
      }
    }
  }

  credentials.sort((a, b) => CREDENTIAL_ORDER.indexOf(a.type) - CREDENTIAL_ORDER.indexOf(b.type));

  if (credentials.length === 0 && certs.length === 0) return null;

  const credByType = new Map(credentials.map((c) => [c.type as string, c]));

  const certificates: PublicCertificate[] = certs
    .map((c, i): PublicCertificate => {
      const cred = credByType.get(c.certificate_type) ?? null;
      let state: CertificateState;
      if (c.status === 'superseded') state = 'superseded';
      else if (c.status === 'revoked') state = 'withdrawn';
      else if (!cred || cred.status === 'active') state = 'current';
      else if (cred.status === 'revoked') state = 'withdrawn';
      else state = 'notCurrent';

      let replacedBy: PublicCertificate['replacedBy'] = null;
      if (state === 'superseded') {
        const newer = certs.slice(i + 1).filter((n) => n.certificate_type === c.certificate_type && n.status === 'active').at(-1);
        if (newer?.certificate_number) replacedBy = { number: newer.certificate_number, issued: day(newer.issued_date) };
      }

      return {
        number: c.certificate_number!,
        code: c.verification_code,
        type: c.certificate_type as CertificateKey,
        state,
        credentialState: state === 'notCurrent' ? (cred?.status ?? null) : null,
        credentialEnded: state === 'notCurrent' && cred?.status === 'expired' ? cred.periodEnds : null,
        issued: day(c.issued_date),
        withdrawnOn: state === 'withdrawn' ? (eventDay(c.revoked_at) ?? (cred?.revokedOn ?? null)) : null,
        replacedBy,
      };
    })
    .reverse();

  return {
    doulaId: doula.doula_id_code,
    slug: doulaIdSlug(doula.doula_id_code),
    name: doula.full_name,
    nativeName: doula.full_name_zh?.trim() || null,
    standing: standingOf(credentials),
    credentials,
    certificates,
  };
}

async function loadRecords(client: SupabaseClient, doulas: DoulaRow[]): Promise<Map<string, PublicRecord>> {
  const out = new Map<string, PublicRecord>();
  if (doulas.length === 0) return out;
  const ids = doulas.map((d) => d.id);
  const [creds, certs] = await Promise.all([
    client.from('doula_credentials').select(CREDENTIAL_COLUMNS).in('doula_id', ids),
    client.from('certificates').select(CERTIFICATE_COLUMNS).in('doula_id', ids),
  ]);
  if (creds.error || certs.error) throw new Error('registry read failed');
  const today = todayInPacific();
  for (const d of doulas) {
    const record = buildRecord(
      d,
      (creds.data as CredentialRow[]).filter((r) => r.doula_id === d.id),
      (certs.data as CertificateRow[]).filter((r) => r.doula_id === d.id),
      today
    );
    if (record) out.set(d.id, record);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Record lookup (/verify/[code])
// ---------------------------------------------------------------------------

/**
 * The record for a permalink segment: a certificate code (exact, case-sensitive),
 * a certificate number, or a Doula ID (with or without the #). Null when nothing
 * public matches. Throws on a database error.
 */
export async function getRecord(segment: string): Promise<RecordLookup | null> {
  noStore();
  const code = segment.trim();
  if (!code || code.length > 80) return null;
  const client = db();

  let doulaId: string | null = null;
  let linkedNumber: string | null = null;
  let permalinkPath = code;

  const byCode = await client
    .from('certificates')
    .select('doula_id, certificate_number')
    .eq('verification_code', code)
    .limit(1)
    .maybeSingle();
  if (byCode.error) throw new Error('registry read failed');
  if (byCode.data) {
    doulaId = byCode.data.doula_id;
    linkedNumber = byCode.data.certificate_number;
  }

  if (!doulaId) {
    const number = code.toUpperCase();
    const byNumber = await client
      .from('certificates')
      .select('doula_id, certificate_number')
      .eq('certificate_number', number)
      .limit(1)
      .maybeSingle();
    if (byNumber.error) throw new Error('registry read failed');
    if (byNumber.data) {
      doulaId = byNumber.data.doula_id;
      linkedNumber = byNumber.data.certificate_number;
      permalinkPath = number;
    }
  }

  let doula: DoulaRow | null = null;
  if (doulaId) {
    const res = await client.from('doulas').select(DOULA_COLUMNS).eq('id', doulaId).maybeSingle();
    if (res.error) throw new Error('registry read failed');
    doula = res.data as DoulaRow | null;
  } else {
    const idCode = `#${code.replace(/^#+/, '')}`;
    const res = await client.from('doulas').select(DOULA_COLUMNS).eq('doula_id_code', idCode).maybeSingle();
    if (res.error) throw new Error('registry read failed');
    doula = res.data as DoulaRow | null;
    if (doula) permalinkPath = doulaIdSlug(doula.doula_id_code);
  }
  if (!doula) return null;

  const record = (await loadRecords(client, [doula])).get(doula.id);
  if (!record) return null;

  const linked = linkedNumber ? (record.certificates.find((c) => c.number === linkedNumber) ?? null) : null;
  return { record, linked, permalinkPath };
}

// ---------------------------------------------------------------------------
// Search (/verify?q=… and /api/verify/search)
// ---------------------------------------------------------------------------

function recordHref(path: string): string {
  return `/verify/${encodeURIComponent(path)}`;
}

/** The record link for a search result: by Doula ID (stable, shows the whole record). */
export function recordPath(record: PublicRecord): string {
  return recordHref(record.slug);
}

async function exactByCertificate(
  client: SupabaseClient,
  column: 'certificate_number' | 'verification_code',
  value: string
): Promise<{ record: PublicRecord; href: string } | null> {
  const res = await client.from('certificates').select('doula_id, verification_code, certificate_number').eq(column, value).limit(1).maybeSingle();
  if (res.error) throw new Error('registry read failed');
  if (!res.data) return null;
  const d = await client.from('doulas').select(DOULA_COLUMNS).eq('id', res.data.doula_id).maybeSingle();
  if (d.error) throw new Error('registry read failed');
  if (!d.data) return null;
  const record = (await loadRecords(client, [d.data as DoulaRow])).get((d.data as DoulaRow).id);
  if (!record) return null;
  // Open the certificate's own link, so the record shows "Certificate on this link".
  return { record, href: recordHref(res.data.verification_code ?? res.data.certificate_number) };
}

async function searchByName(client: SupabaseClient, name: string): Promise<{ records: PublicRecord[]; truncated: boolean }> {
  const tokens = nameTokens(name);
  if (tokens.length === 0) return { records: [], truncated: false };
  const RAW_LIMIT = 40;

  // English name: every token appears in full_name (any order).
  let latin = client.from('doulas').select(DOULA_COLUMNS);
  for (const tok of tokens) latin = latin.ilike('full_name', `%${tok}%`);
  // Native name: as typed; a CJK name is matched without spaces ("陈 美琳" → "陈美琳").
  const nativeTokens = hasCjk(name) ? [tokens.join('')] : tokens;
  let native = client.from('doulas').select(DOULA_COLUMNS);
  for (const tok of nativeTokens) native = native.ilike('full_name_zh', `%${tok}%`);

  const [a, b] = await Promise.all([latin.order('full_name').limit(RAW_LIMIT), native.order('full_name').limit(RAW_LIMIT)]);
  if (a.error || b.error) throw new Error('registry read failed');

  const seen = new Map<string, DoulaRow>();
  for (const d of [...(a.data as DoulaRow[]), ...(b.data as DoulaRow[])]) if (!seen.has(d.id)) seen.set(d.id, d);
  const matched = Array.from(seen.values());
  const records = await loadRecords(client, matched);

  const list = matched
    .map((d) => records.get(d.id))
    .filter((r): r is PublicRecord => Boolean(r))
    .sort((x, y) => x.name.localeCompare(y.name, 'en') || x.doulaId.localeCompare(y.doulaId));

  const rawCapped = (a.data?.length ?? 0) >= RAW_LIMIT || (b.data?.length ?? 0) >= RAW_LIMIT;
  return { records: list.slice(0, SEARCH_LIMIT), truncated: list.length > SEARCH_LIMIT || rawCapped };
}

/** Run a registry search. Never throws: database errors return { status: 'error' }. */
export async function searchRegistry(raw: string | null | undefined): Promise<SearchOutcome> {
  noStore();
  const parsed = parseQuery(raw);
  if (!parsed) return { status: 'empty' };
  const query = parsed.value;
  if (!parsed.longEnough) return { status: 'tooShort', kind: parsed.kind, min: parsed.min, query };

  try {
    const client = db();

    if (parsed.kind === 'doula_id') {
      const res = await client.from('doulas').select(DOULA_COLUMNS).eq('doula_id_code', parsed.value).maybeSingle();
      if (res.error) throw new Error('registry read failed');
      const record = res.data ? (await loadRecords(client, [res.data as DoulaRow])).get((res.data as DoulaRow).id) : undefined;
      return record
        ? { status: 'exact', type: 'doula_id', query, href: recordPath(record), record }
        : { status: 'notFound', type: 'doula_id', query };
    }

    if (parsed.kind === 'cert_number') {
      const hit = await exactByCertificate(client, 'certificate_number', parsed.value);
      return hit ? { status: 'exact', type: 'cert_number', query, ...hit } : { status: 'notFound', type: 'cert_number', query };
    }

    if (parsed.kind === 'code_or_name') {
      const hit = await exactByCertificate(client, 'verification_code', parsed.value);
      if (hit) return { status: 'exact', type: 'verification_code', query, ...hit };
      if (!couldBeName(parsed.value)) return { status: 'notFound', type: 'verification_code', query };
    }

    const { records, truncated } = await searchByName(client, parsed.value);
    return records.length > 0
      ? { status: 'list', type: 'name', query, records, truncated }
      : { status: 'notFound', type: 'name', query };
  } catch {
    return { status: 'error', query };
  }
}

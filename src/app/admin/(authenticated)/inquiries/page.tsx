import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Badge } from '@/components/ui/badge';
import {
  INQUIRY_STATUSES,
  INQUIRY_STATUS_COLORS,
  INQUIRY_STATUS_LABELS,
  INQUIRY_TOPICS,
  formatPT,
  hasInquiryStatusColumn,
  isInquiryStatus,
  statusOf,
  timeAgo,
  topicColor,
  type InquiryRow,
} from '@/lib/inquiries';

export const dynamic = 'force-dynamic';

const PER_PAGE = 50;

// Search box → PostgREST or-filter. Values are double-quoted, so strip the two
// characters that could break out of the quotes; any dash becomes the LIKE
// single-char wildcard so "K-Mama" also finds "K‑Mama" (non-breaking hyphen).
function toSearchPattern(raw: string): string {
  return raw
    .replace(/["\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
    .replace(/[-\u2010-\u2015]/g, '_');
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; topic?: string; page?: string; q?: string }>;
}) {
  const supabase = getSupabase();
  const params = await searchParams;
  const tracking = await hasInquiryStatusColumn(supabase);

  const searchText = (params.q ?? '').trim().slice(0, 80);
  const searchPattern = toSearchPattern(searchText);

  // Default view is the work queue (New). "all" shows everything.
  // A search always looks across every status, so a handled inquiry is still findable.
  const statusFilter = searchPattern
    ? 'all'
    : tracking && (params.status === 'all' || isInquiryStatus(params.status))
      ? params.status!
      : tracking
        ? 'new'
        : 'all';
  const topicFilter = (INQUIRY_TOPICS as readonly string[]).includes(params.topic ?? '')
    ? params.topic!
    : '';
  const page = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const offset = (page - 1) * PER_PAGE;

  let query = supabase
    .from('contact_submissions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + PER_PAGE - 1);
  if (tracking && statusFilter !== 'all') query = query.eq('status', statusFilter);
  if (topicFilter) query = query.eq('topic', topicFilter);
  if (searchPattern) {
    query = query.or(
      ['full_name', 'email', 'phone', 'message']
        .map((col) => `${col}.ilike."*${searchPattern}*"`)
        .join(',')
    );
  }

  const countFor = (status?: string) => {
    let q = supabase.from('contact_submissions').select('id', { count: 'exact', head: true });
    if (status) q = q.eq('status', status);
    return q;
  };

  const [listRes, totalRes, statusRes] = await Promise.all([
    query,
    countFor(),
    Promise.all(tracking ? INQUIRY_STATUSES.map((s) => countFor(s)) : []),
  ]);
  const { data, count, error } = listRes;

  const rows = (data ?? []) as InquiryRow[];
  const totalPages = Math.max(1, Math.ceil((count || 0) / PER_PAGE));
  const statusCounts: Record<string, number> = { all: totalRes.count ?? 0 };
  if (tracking) {
    INQUIRY_STATUSES.forEach((s, i) => {
      statusCounts[s] = statusRes[i]?.count ?? 0;
    });
  }
  const now = Date.now();

  function buildUrl(next: Record<string, string>) {
    const merged = { status: statusFilter, topic: topicFilter, q: searchText, page: String(page), ...next };
    const p = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => {
      if (v && !(k === 'page' && v === '1')) p.set(k, v);
    });
    const qs = p.toString();
    return `/admin/inquiries${qs ? `?${qs}` : ''}`;
  }

  const statusTabs = tracking
    ? [...INQUIRY_STATUSES.map((s) => ({ value: s, label: INQUIRY_STATUS_LABELS[s] })), { value: 'all', label: 'All' }]
    : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Website Inquiries</h1>
        <span className="text-sm text-muted-foreground">{statusCounts.all} total</span>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Messages sent through the contact form on asiandoula.org. Newest first.
      </p>

      {!tracking && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Status tracking (New / Contacted / Referred / Spam) switches on once the database
          update <span className="font-mono">017_contact_submission_status.sql</span> has been run.
          Until then this page shows every inquiry, read-only.
        </div>
      )}

      <form action="/admin/inquiries" method="get" className="mb-4 flex gap-2">
        {topicFilter && <input type="hidden" name="topic" value={topicFilter} />}
        <input
          type="search"
          name="q"
          defaultValue={searchText}
          placeholder="Search name, email, phone or message (e.g. an organization name)"
          className="h-9 w-full max-w-md rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-ada-purple focus:ring-2 focus:ring-ada-purple/20"
        />
        <button
          type="submit"
          className="h-9 rounded-md bg-ada-purple px-4 text-sm font-medium text-white hover:opacity-90"
        >
          Search
        </button>
        {searchText && (
          <Link
            href={buildUrl({ q: '', status: '', page: '1' })}
            className="flex h-9 items-center rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-600 hover:bg-zinc-50"
          >
            Clear
          </Link>
        )}
      </form>

      {searchText && (
        <p className="mb-3 text-sm text-zinc-600">
          {count ?? 0} {count === 1 ? 'result' : 'results'} for “{searchText}” across all statuses
        </p>
      )}

      {tracking && !searchText && (
        <div className="flex flex-wrap gap-2 mb-3">
          {statusTabs.map((f) => (
            <Link
              key={f.value}
              href={buildUrl({ status: f.value, q: '', page: '1' })}
              className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                statusFilter === f.value
                  ? 'bg-ada-purple text-white border-ada-purple'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              {f.label}
              <span className={`ml-1.5 text-xs ${statusFilter === f.value ? 'text-white/80' : 'text-zinc-400'}`}>
                {statusCounts[f.value] ?? 0}
              </span>
            </Link>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {[{ value: '', label: 'All topics' }, ...INQUIRY_TOPICS.map((t) => ({ value: t, label: t }))].map((f) => (
          <Link
            key={f.value || 'all-topics'}
            href={buildUrl({ topic: f.value, page: '1' })}
            className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
              topicFilter === f.value
                ? 'bg-zinc-800 text-white border-zinc-800'
                : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Could not load inquiries: {error.message}
        </div>
      )}

      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50">
            <tr>
              <th className="text-left p-3 font-medium whitespace-nowrap">Received</th>
              <th className="text-left p-3 font-medium">Topic</th>
              <th className="text-left p-3 font-medium">From</th>
              <th className="text-left p-3 font-medium">Message</th>
              {tracking && <th className="text-left p-3 font-medium">Status</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const status = statusOf(row);
              const href = `/admin/inquiries/${row.id}`;
              return (
                <tr key={row.id} className="border-b last:border-b-0 hover:bg-zinc-50 align-top">
                  <td className="p-3 whitespace-nowrap">
                    <div className="text-sm">{timeAgo(row.created_at, now)}</div>
                    <div className="text-xs text-muted-foreground">{formatPT(row.created_at)}</div>
                  </td>
                  <td className="p-3">
                    <Badge className={topicColor(row.topic)}>{row.topic || 'No topic'}</Badge>
                  </td>
                  <td className="p-3 min-w-[180px]">
                    <Link href={href} className="font-medium text-ada-purple hover:underline">
                      {row.full_name}
                    </Link>
                    <div className="text-xs text-muted-foreground break-all">{row.email}</div>
                    {row.phone && <div className="text-xs text-muted-foreground">{row.phone}</div>}
                  </td>
                  <td className="p-3 min-w-[260px] max-w-[480px]">
                    <Link href={href} className="block text-zinc-700 hover:text-zinc-900">
                      <span className="line-clamp-3">{row.message.replace(/\s+/g, ' ').trim()}</span>
                    </Link>
                    {row.note && (
                      <div className="mt-1 text-xs text-muted-foreground line-clamp-1">Note: {row.note}</div>
                    )}
                  </td>
                  {tracking && (
                    <td className="p-3">
                      <Badge className={INQUIRY_STATUS_COLORS[status]}>{INQUIRY_STATUS_LABELS[status]}</Badge>
                    </td>
                  )}
                </tr>
              );
            })}
            {rows.length === 0 && !error && (
              <tr>
                <td colSpan={tracking ? 5 : 4} className="p-8 text-center text-muted-foreground">
                  {searchText
                    ? 'Nothing matches that search.'
                    : statusFilter === 'new'
                      ? 'No new inquiries. All caught up.'
                      : 'No inquiries here.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          {page > 1 && (
            <Link href={buildUrl({ page: String(page - 1) })} className="px-3 py-1 text-sm border rounded bg-white hover:bg-zinc-50">
              Previous
            </Link>
          )}
          <span className="px-3 py-1 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={buildUrl({ page: String(page + 1) })} className="px-3 py-1 text-sm border rounded bg-white hover:bg-zinc-50">
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

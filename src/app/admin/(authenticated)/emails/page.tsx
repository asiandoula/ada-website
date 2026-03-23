import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TYPE_LABELS: Record<string, string> = {
  exam_pass: 'Exam — Pass',
  exam_fail: 'Exam — Fail',
  certificate: 'Certificate',
};

const TYPE_COLORS: Record<string, string> = {
  exam_pass: 'bg-green-100 text-green-800',
  exam_fail: 'bg-red-100 text-red-800',
  certificate: 'bg-blue-100 text-blue-800',
};

export default async function EmailsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string }>;
}) {
  const params = await searchParams;
  const typeFilter = params.type || '';
  const page = parseInt(params.page || '1', 10);
  const perPage = 20;
  const offset = (page - 1) * perPage;

  let query = supabase
    .from('email_logs')
    .select('*, doulas(full_name, doula_id_code)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1);

  if (typeFilter) {
    query = query.eq('email_type', typeFilter);
  }

  const { data: logs, count } = await query;
  const totalPages = Math.ceil((count || 0) / perPage);

  function buildUrl(newParams: Record<string, string>) {
    const p = new URLSearchParams();
    const merged = { type: typeFilter, page: String(page), ...newParams };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) p.set(k, v);
    });
    return `/admin/emails?${p.toString()}`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Email History</h1>
        <span className="text-sm text-muted-foreground">{count ?? 0} total</span>
      </div>

      <div className="flex gap-2 mb-4">
        {[
          { value: '', label: 'All' },
          { value: 'exam_pass', label: 'Exam Pass' },
          { value: 'exam_fail', label: 'Exam Fail' },
          { value: 'certificate', label: 'Certificate' },
        ].map((f) => (
          <Link
            key={f.value}
            href={buildUrl({ type: f.value, page: '1' })}
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
              typeFilter === f.value
                ? 'bg-ada-purple text-white border-ada-purple'
                : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50">
            <tr>
              <th className="text-left p-3 font-medium">Date</th>
              <th className="text-left p-3 font-medium">Recipient</th>
              <th className="text-left p-3 font-medium">Type</th>
              <th className="text-left p-3 font-medium">Subject</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Sent By</th>
            </tr>
          </thead>
          <tbody>
            {(logs ?? []).map((log) => {
              const doula = log.doulas as { full_name: string; doula_id_code: string } | null;
              return (
                <tr key={log.id} className="border-b hover:bg-zinc-50">
                  <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/doulas/${log.doula_id}`} className="text-ada-purple hover:underline">
                      {doula?.full_name ?? 'Unknown'}
                    </Link>
                    <span className="text-xs text-muted-foreground ml-1">{log.recipient_email}</span>
                  </td>
                  <td className="p-3">
                    <Badge className={TYPE_COLORS[log.email_type] ?? 'bg-gray-100 text-gray-600'}>
                      {TYPE_LABELS[log.email_type] ?? log.email_type}
                    </Badge>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground max-w-[200px] truncate">
                    {log.subject || '—'}
                  </td>
                  <td className="p-3">
                    <Badge className={log.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {log.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {log.sent_by ? log.sent_by.substring(0, 8) + '...' : '—'}
                  </td>
                </tr>
              );
            })}
            {(!logs || logs.length === 0) && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No emails sent yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {page > 1 && (
            <Link href={buildUrl({ page: String(page - 1) })} className="px-3 py-1 text-sm border rounded hover:bg-zinc-50">
              Previous
            </Link>
          )}
          <span className="px-3 py-1 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={buildUrl({ page: String(page + 1) })} className="px-3 py-1 text-sm border rounded hover:bg-zinc-50">
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

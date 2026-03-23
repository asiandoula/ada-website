import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { STATUS_LABELS, STATUS_COLORS, EXAM_STATUS_LABELS, EXAM_STATUS_COLORS } from '@/lib/constants';
import type { DoulaStatus, ExamStatus } from '@/lib/constants';
import { ImportExcelButton } from '@/components/admin/import-excel-button';

interface SearchParams {
  q?: string;
  status?: string;
  sort?: string;
  page?: string;
}

const PAGE_SIZE = 20;

const SORT_OPTIONS = [
  { value: 'created_at_desc', label: 'Newest First', column: 'created_at', asc: false },
  { value: 'created_at_asc', label: 'Oldest First', column: 'created_at', asc: true },
  { value: 'full_name_asc', label: 'Name A→Z', column: 'full_name', asc: true },
  { value: 'full_name_desc', label: 'Name Z→A', column: 'full_name', asc: false },
  { value: 'doula_id_code_asc', label: 'ID (Ascending)', column: 'doula_id_code', asc: true },
  { value: 'doula_id_code_desc', label: 'ID (Descending)', column: 'doula_id_code', asc: false },
  { value: 'certification_date_desc', label: 'Cert Date (Newest)', column: 'certification_date', asc: false },
  { value: 'certification_date_asc', label: 'Cert Date (Oldest)', column: 'certification_date', asc: true },
  { value: 'expiration_date_asc', label: 'Expiring Soonest', column: 'expiration_date', asc: true },
  { value: 'expiration_date_desc', label: 'Expiring Latest', column: 'expiration_date', asc: false },
];

export default async function DoulasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const page = Number(params.page) || 1;
  const offset = (page - 1) * PAGE_SIZE;

  // Sort
  const sortKey = params.sort || 'created_at_desc';
  const sortOption = SORT_OPTIONS.find((s) => s.value === sortKey) || SORT_OPTIONS[0];

  let query = supabase
    .from('doulas')
    .select('*', { count: 'exact' })
    .order(sortOption.column, { ascending: sortOption.asc })
    .range(offset, offset + PAGE_SIZE - 1);

  if (params.q) {
    query = query.or(
      `full_name.ilike.%${params.q}%,doula_id_code.ilike.%${params.q}%,email.ilike.%${params.q}%`
    );
  }

  if (params.status) {
    query = query.eq('status', params.status);
  }

  const { data: doulas, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  // Build URL helper
  function buildUrl(overrides: Partial<SearchParams>) {
    const p = { ...params, ...overrides };
    const parts = [];
    if (p.q) parts.push(`q=${encodeURIComponent(p.q)}`);
    if (p.status) parts.push(`status=${p.status}`);
    if (p.sort && p.sort !== 'created_at_desc') parts.push(`sort=${p.sort}`);
    if (p.page && Number(p.page) > 1) parts.push(`page=${p.page}`);
    return '/admin/doulas' + (parts.length ? '?' + parts.join('&') : '');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Doulas</h1>
        <div className="flex items-center gap-3">
          <ImportExcelButton />
          <Link href="/admin/doulas/new">
            <Button className="bg-ada-purple hover:bg-ada-purple/90">
              + New Doula
            </Button>
          </Link>
        </div>
      </div>

      {/* Search & Filter & Sort */}
      <form className="flex flex-wrap gap-3 mb-4">
        <Input
          name="q"
          placeholder="Search by name, ID, or email..."
          defaultValue={params.q}
          className="max-w-xs"
        />
        <select
          name="status"
          defaultValue={params.status}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          name="sort"
          defaultValue={params.sort || 'created_at_desc'}
          className="border rounded-md px-3 py-2 text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      {/* Count */}
      <p className="text-xs text-muted-foreground mb-2">
        {count ?? 0} doula{(count ?? 0) !== 1 ? 's' : ''} found
      </p>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="border-b bg-zinc-50">
            <tr>
              <th className="text-left p-2 pl-3 font-medium">ID</th>
              <th className="text-left p-2 font-medium">Name</th>
              <th className="text-left p-2 font-medium">Status</th>
              <th className="text-left p-2 font-medium">Exam</th>
              <th className="text-left p-2 font-medium whitespace-nowrap">Cert Date</th>
              <th className="text-left p-2 font-medium whitespace-nowrap">Expires</th>
              <th className="text-left p-2 pr-3 font-medium">Training</th>
            </tr>
          </thead>
          <tbody>
            {doulas?.map((doula) => (
              <tr key={doula.id} className="border-b hover:bg-zinc-50">
                <td className="p-2 pl-3">
                  <Link
                    href={`/admin/doulas/${doula.id}`}
                    className="text-ada-purple hover:underline font-mono text-xs"
                  >
                    {doula.doula_id_code}
                  </Link>
                </td>
                <td className="p-2">{doula.full_name}</td>
                <td className="p-2">
                  <Badge
                    className={STATUS_COLORS[doula.status as DoulaStatus] ?? ''}
                    variant="secondary"
                  >
                    {STATUS_LABELS[doula.status as DoulaStatus] ?? doula.status}
                  </Badge>
                </td>
                <td className="p-2">
                  <Badge
                    className={EXAM_STATUS_COLORS[doula.exam_status as ExamStatus] ?? 'bg-gray-100 text-gray-600'}
                    variant="secondary"
                  >
                    {EXAM_STATUS_LABELS[doula.exam_status as ExamStatus] ?? doula.exam_status ?? 'N/A'}
                  </Badge>
                </td>
                <td className="p-2 whitespace-nowrap">{doula.certification_date ?? '—'}</td>
                <td className="p-2 whitespace-nowrap">{doula.expiration_date ?? '—'}</td>
                <td className="p-2 pr-3">{doula.training_provider ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={buildUrl({ page: String(p) })}>
              <Button
                variant={p === page ? 'default' : 'outline'}
                size="sm"
                className={p === page ? 'bg-ada-purple' : ''}
              >
                {p}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

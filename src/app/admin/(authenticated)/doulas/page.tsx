import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants';
import type { DoulaStatus } from '@/lib/constants';

interface SearchParams {
  q?: string;
  status?: string;
  page?: string;
}

const PAGE_SIZE = 20;

export default async function DoulasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const page = Number(params.page) || 1;
  const offset = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from('doulas')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Doulas</h1>
        <Link href="/admin/doulas/new">
          <Button className="bg-ada-purple hover:bg-ada-purple/90">
            + New Doula
          </Button>
        </Link>
      </div>

      {/* Search & Filter */}
      <form className="flex gap-3 mb-4">
        <Input
          name="q"
          placeholder="Search by name, ID, or email..."
          defaultValue={params.q}
          className="max-w-sm"
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
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50">
            <tr>
              <th className="text-left p-3 font-medium">ID</th>
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Certification Date</th>
              <th className="text-left p-3 font-medium">Expiration</th>
              <th className="text-left p-3 font-medium">Training</th>
            </tr>
          </thead>
          <tbody>
            {doulas?.map((doula) => (
              <tr key={doula.id} className="border-b hover:bg-zinc-50">
                <td className="p-3">
                  <Link
                    href={`/admin/doulas/${doula.id}`}
                    className="text-ada-purple hover:underline font-mono text-xs"
                  >
                    {doula.doula_id_code}
                  </Link>
                </td>
                <td className="p-3">{doula.full_name}</td>
                <td className="p-3">
                  <Badge
                    className={
                      STATUS_COLORS[doula.status as DoulaStatus] ?? ''
                    }
                    variant="secondary"
                  >
                    {STATUS_LABELS[doula.status as DoulaStatus] ??
                      doula.status}
                  </Badge>
                </td>
                <td className="p-3">{doula.certification_date ?? '—'}</td>
                <td className="p-3">{doula.expiration_date ?? '—'}</td>
                <td className="p-3">{doula.training_provider ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/doulas?page=${p}${params.q ? `&q=${params.q}` : ''}${params.status ? `&status=${params.status}` : ''}`}
            >
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

'use client';

/**
 * Possible duplicates (2026-11-18): one person = one record.
 * Groups of records that share a phone, an email, or a name (letters only, either word
 * order) — open each record to check, then merge from the record you keep
 * ("Merge a duplicate record into this one"). Nothing here changes data.
 * Same email / phone is almost always the same person; same name can be two people.
 */
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { emailKey, nameKey, phoneKey } from '@/lib/doula-dedup';

interface Row {
  id: string;
  doula_id_code: string;
  full_name: string;
  full_name_zh: string | null;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  created_at: string;
}

interface Group {
  reason: string;
  strong: boolean;
  rows: Row[];
}

function nameKeys(full: string): string[] {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  const keys = [nameKey(full)];
  if (parts.length > 1) keys.push(nameKey([...parts].reverse().join(' ')));
  return keys.filter((k): k is string => !!k);
}

export default function DuplicatesPage() {
  const supabase = createClient();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('doulas')
        .select('id, doula_id_code, full_name, full_name_zh, email, phone, date_of_birth, created_at')
        .order('created_at');
      if (error) setError(error.message);
      else setRows((data as Row[]) ?? []);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groups = useMemo<Group[]>(() => {
    if (!rows) return [];
    const by = (label: string, strong: boolean, keyOf: (r: Row) => string[]): Group[] => {
      const m: Record<string, Row[]> = {};
      for (const r of rows) {
        const keys = keyOf(r).filter((k, i, arr) => arr.indexOf(k) === i);
        for (const k of keys) (m[k] = m[k] ?? []).push(r);
      }
      return Object.values(m)
        .filter((g) => g.length > 1)
        .map((g) => ({ reason: label, strong, rows: g }));
    };
    const out = [
      ...by('Same phone', true, (r) => [phoneKey(r.phone)].filter((k): k is string => !!k)),
      ...by('Same email', true, (r) => [emailKey(r.email)].filter((k): k is string => !!k)),
      ...by('Same name', false, (r) => nameKeys(r.full_name)),
    ];
    // A name group fully covered by a phone / email group adds nothing.
    const strongSets: string[][] = out.filter((g) => g.strong).map((g) => g.rows.map((r: Row) => r.id));
    return out.filter((g) => g.strong || !strongSets.some((ids) => g.rows.every((r: Row) => ids.includes(r.id))));
  }, [rows]);

  return (
    <div className="max-w-4xl space-y-4">
      <h1 className="text-2xl font-semibold">Possible duplicate records</h1>
      <p className="text-sm text-muted-foreground">
        One person = one record. Open the records in a group to check. If they are the same person, open the record to
        keep (usually the one with the current certificate) and use “Merge a duplicate record into this one”. Same phone
        or email is almost always the same person; the same name can be two different people.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {rows && groups.length === 0 && <p className="text-sm">No possible duplicates.</p>}
      {groups.map((g, i) => (
        <Card key={i}>
          <CardContent className="pt-4 text-sm space-y-1">
            <p className={g.strong ? 'font-semibold text-red-700' : 'font-semibold text-amber-700'}>
              {g.reason} · {g.rows.length} records
            </p>
            <ul className="list-disc pl-5">
              {g.rows.map((r) => (
                <li key={r.id}>
                  <a href={`/admin/doulas/${r.id}`} className="text-ada-purple hover:underline">
                    {r.doula_id_code} {r.full_name}
                    {r.full_name_zh ? ` (${r.full_name_zh})` : ''}
                  </a>
                  <span className="text-muted-foreground">
                    {' '}
                    · created {r.created_at.slice(0, 10)}
                    {r.date_of_birth ? ` · born ${r.date_of_birth}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

'use client';

/**
 * "Merge a duplicate into this record" (2026-11-18): one person = one record.
 * Enter the other record's Doula ID → preview both side by side → tick that they are the
 * same person → merge. Certificates, exam results and emails move here; the other Doula ID
 * keeps working (record page, search, portal sign-in) and points to this record.
 */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Side {
  doula_id_code: string;
  full_name: string;
  full_name_zh: string | null;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  status: string | null;
  created_at: string;
  certificates: { certificate_type: string; certificate_number: string; status: string; expiration_date: string | null }[];
  credentials: { credential_type: string; status: string; expiration_date: string | null }[];
  exam_results: number;
}

function SideView({ title, s }: { title: string; s: Side }) {
  const active = s.certificates.filter((c) => c.status === 'active');
  return (
    <div className="rounded-md border p-3 text-sm space-y-1">
      <p className="font-semibold">{title}</p>
      <p>
        {s.doula_id_code} · {s.full_name}
        {s.full_name_zh ? ` (${s.full_name_zh})` : ''}
      </p>
      <p className="text-muted-foreground">Email: {s.email || '—'}</p>
      <p className="text-muted-foreground">Phone: {s.phone || '—'}</p>
      <p className="text-muted-foreground">Date of birth: {s.date_of_birth || '—'}</p>
      <p className="text-muted-foreground">Created: {s.created_at.slice(0, 10)}</p>
      <p>
        Credentials:{' '}
        {s.credentials.length
          ? s.credentials.map((c) => `${c.credential_type} ${c.status}${c.expiration_date ? ` to ${c.expiration_date}` : ''}`).join(', ')
          : '—'}
      </p>
      <p>
        Current certificates:{' '}
        {active.length ? active.map((c) => `${c.certificate_number}${c.expiration_date ? ` (to ${c.expiration_date})` : ''}`).join(', ') : '—'}
      </p>
      <p>Exam results: {s.exam_results}</p>
    </div>
  );
}

export function MergeDoulaCard({ targetId, onMerged }: { targetId: string; onMerged: () => void }) {
  const [code, setCode] = useState('');
  const [preview, setPreview] = useState<{ keep: Side; merge: Side } | null>(null);
  const [same, setSame] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function call(confirm: boolean) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/admin/doulas/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_id: targetId, source_code: code, confirm }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Nothing was changed.');
        return;
      }
      if (confirm) {
        const m = data.merged;
        setMessage(
          `Merged ${m.merged} into ${m.kept}: ${m.certificates_moved} certificate(s), ${m.exam_results_moved} exam result(s) moved. ${m.merged} now opens this record.`
        );
        setPreview(null);
        setSame(false);
        setCode('');
        onMerged();
      } else {
        setPreview(data.preview);
        setSame(false);
      }
    } catch {
      setError('Something went wrong. Nothing was changed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Merge a duplicate record into this one</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          One person = one record. If this person also has another record, enter its Doula ID. Its certificates, exam
          results and emails move here, empty fields here are filled from it, and its Doula ID keeps working and opens
          this record.
        </p>
        <div className="flex gap-2">
          <Input
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setPreview(null);
            }}
            placeholder="#26-1234"
            className="max-w-48"
          />
          <Button type="button" variant="outline" disabled={busy || !code.trim()} onClick={() => call(false)}>
            Preview
          </Button>
        </div>
        {preview && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <SideView title="Keep (this record)" s={preview.keep} />
              <SideView title="Merge into this record" s={preview.merge} />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={same} onChange={(e) => setSame(e.target.checked)} />I checked: these two
              records are the same person
            </label>
            <Button
              type="button"
              className="bg-ada-purple hover:bg-ada-purple/90"
              disabled={busy || !same}
              onClick={() => call(true)}
            >
              {busy ? 'Merging…' : `Merge ${preview.merge.doula_id_code} into ${preview.keep.doula_id_code}`}
            </Button>
          </div>
        )}
        {message && <p className="text-sm text-green-700">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </CardContent>
    </Card>
  );
}

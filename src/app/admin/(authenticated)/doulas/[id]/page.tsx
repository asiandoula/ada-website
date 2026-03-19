'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DOULA_STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
  CERT_TYPE_LABELS,
} from '@/lib/constants';
import type { DoulaStatus, CertificateType } from '@/lib/constants';

export default function EditDoulaPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [doula, setDoula] = useState<Record<string, any> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [exams, setExams] = useState<Record<string, any>[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [certs, setCerts] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const { data: d } = await supabase
        .from('doulas')
        .select('*')
        .eq('id', params.id)
        .single();
      setDoula(d);

      const { data: e } = await supabase
        .from('exam_results')
        .select('*')
        .eq('doula_id', params.id)
        .order('exam_date', { ascending: false });
      setExams(e ?? []);

      const { data: c } = await supabase
        .from('certificates')
        .select('*')
        .eq('doula_id', params.id)
        .order('issued_date', { ascending: false });
      setCerts(c ?? []);
    }
    load();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const certDate = form.get('certification_date') as string;
    const expDate = certDate
      ? new Date(
          new Date(certDate).setFullYear(new Date(certDate).getFullYear() + 3)
        )
          .toISOString()
          .split('T')[0]
      : null;

    const { error } = await supabase
      .from('doulas')
      .update({
        full_name: form.get('full_name'),
        full_name_zh: form.get('full_name_zh') || null,
        email: form.get('email') || null,
        phone: form.get('phone') || null,
        date_of_birth: form.get('date_of_birth') || null,
        certification_date: certDate || null,
        expiration_date: expDate,
        status: form.get('status'),
        training_provider: form.get('training_provider') || null,
        region: form.get('region') || null,
      })
      .eq('id', params.id);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/admin/doulas');
    router.refresh();
  }

  if (!doula) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {doula.full_name}{' '}
          <span className="text-sm font-mono text-muted-foreground">
            {doula.doula_id_code}
          </span>
        </h1>
        <Badge className={STATUS_COLORS[doula.status as DoulaStatus]}>
          {STATUS_LABELS[doula.status as DoulaStatus]}
        </Badge>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name (English)</Label>
                <Input
                  name="full_name"
                  defaultValue={doula.full_name}
                  required
                />
              </div>
              <div>
                <Label>Chinese Name</Label>
                <Input
                  name="full_name_zh"
                  defaultValue={doula.full_name_zh ?? ''}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  defaultValue={doula.email ?? ''}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input name="phone" defaultValue={doula.phone ?? ''} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date of Birth</Label>
                <Input
                  name="date_of_birth"
                  type="date"
                  defaultValue={doula.date_of_birth ?? ''}
                />
              </div>
              <div>
                <Label>Certification Date</Label>
                <Input
                  name="certification_date"
                  type="date"
                  defaultValue={doula.certification_date ?? ''}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <select
                  name="status"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  defaultValue={doula.status}
                >
                  {DOULA_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Training Provider</Label>
                <Input
                  name="training_provider"
                  defaultValue={doula.training_provider ?? ''}
                />
              </div>
            </div>
            <div>
              <Label>Region</Label>
              <Input name="region" defaultValue={doula.region ?? ''} />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              type="submit"
              className="bg-ada-purple hover:bg-ada-purple/90"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Exam Results */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Results</CardTitle>
        </CardHeader>
        <CardContent>
          {exams.length === 0 ? (
            <p className="text-muted-foreground text-sm">No exam results recorded.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-2">Session</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Overall</th>
                  <th className="text-left p-2">Proficiency</th>
                  <th className="text-left p-2">Passed</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id} className="border-b">
                    <td className="p-2 font-mono">{exam.exam_session ?? '—'}</td>
                    <td className="p-2">{exam.exam_date ?? '—'}</td>
                    <td className="p-2">{exam.overall_score ?? '—'}</td>
                    <td className="p-2">{exam.proficiency_level ?? '—'}</td>
                    <td className="p-2">
                      {exam.passed === true ? '✓' : exam.passed === false ? '✗' : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Certificates */}
      <Card>
        <CardHeader>
          <CardTitle>Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          {certs.length === 0 ? (
            <p className="text-muted-foreground text-sm">No certificates issued.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Number</th>
                  <th className="text-left p-2">Issued</th>
                  <th className="text-left p-2">Expires</th>
                  <th className="text-left p-2">PDF</th>
                </tr>
              </thead>
              <tbody>
                {certs.map((cert) => (
                  <tr key={cert.id} className="border-b">
                    <td className="p-2">
                      {CERT_TYPE_LABELS[cert.certificate_type as CertificateType] ?? cert.certificate_type}
                    </td>
                    <td className="p-2 font-mono">{cert.certificate_number}</td>
                    <td className="p-2">{cert.issued_date}</td>
                    <td className="p-2">{cert.expiration_date}</td>
                    <td className="p-2">
                      {cert.pdf_url && (
                        <a
                          href={cert.pdf_url}
                          target="_blank"
                          className="text-ada-cyan hover:underline"
                        >
                          Download
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

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
  CREDENTIAL_TYPES,
  CREDENTIAL_LABELS,
  CREDENTIAL_COLORS,
} from '@/lib/constants';
import type { DoulaStatus, CertificateType, CredentialType } from '@/lib/constants';
import { ExamEditDialog, type ExamRecord } from '@/components/admin/exam-edit-dialog';

export default function EditDoulaPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [doula, setDoula] = useState<Record<string, any> | null>(null);
  const [exams, setExams] = useState<ExamRecord[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [certs, setCerts] = useState<Record<string, any>[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [credentials, setCredentials] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function reloadData() {
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

    const { data: cr } = await supabase
      .from('doula_credentials')
      .select('*')
      .eq('doula_id', params.id)
      .order('credential_type');
    setCredentials(cr ?? []);
  }

  useEffect(() => {
    reloadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      {/* Credentials */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Credentials</CardTitle>
            <select
              className="border rounded-md px-2 py-1 text-sm"
              onChange={async (e) => {
                const type = e.target.value;
                if (!type) return;
                // Check if credential already exists
                if (credentials.some((c) => c.credential_type === type)) {
                  alert('This credential already exists for this doula.');
                  e.target.value = '';
                  return;
                }
                const isIbclc = type === 'ibclc_training';
                await supabase.from('doula_credentials').insert({
                  doula_id: params.id,
                  credential_type: type,
                  status: 'certified_active',
                  certification_date: new Date().toISOString().split('T')[0],
                  expiration_date: isIbclc ? null : new Date(
                    new Date().setFullYear(new Date().getFullYear() + 3)
                  ).toISOString().split('T')[0],
                });
                reloadData();
                e.target.value = '';
              }}
              defaultValue=""
            >
              <option value="" disabled>+ Add Credential</option>
              {CREDENTIAL_TYPES.map((t) => (
                <option key={t} value={t}>{CREDENTIAL_LABELS[t]}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {credentials.length === 0 ? (
            <p className="text-muted-foreground text-sm">No credentials assigned.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {credentials.map((cred) => (
                <div key={cred.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className={CREDENTIAL_COLORS[cred.credential_type as CredentialType]}>
                      {CREDENTIAL_LABELS[cred.credential_type as CredentialType]}
                    </Badge>
                    <Badge className={STATUS_COLORS[cred.status as DoulaStatus]}>
                      {STATUS_LABELS[cred.status as DoulaStatus]}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Certified: {cred.certification_date ?? '—'}</p>
                    <p>Expires: {cred.expiration_date ?? 'Permanent'}</p>
                  </div>
                  <div className="flex gap-1">
                    <select
                      className="border rounded px-1 py-0.5 text-xs flex-1"
                      value={cred.status}
                      onChange={async (e) => {
                        await supabase
                          .from('doula_credentials')
                          .update({ status: e.target.value, updated_at: new Date().toISOString() })
                          .eq('id', cred.id);
                        reloadData();
                      }}
                    >
                      {DOULA_STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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

      {/* Renew Certification */}
      <Card>
        <CardHeader>
          <CardTitle>Certification Renewal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Current Expiration:</span>{' '}
                <span className={`font-medium ${doula.expiration_date && new Date(doula.expiration_date) < new Date() ? 'text-red-600' : ''}`}>
                  {doula.expiration_date ?? 'Not set'}
                </span>
              </p>
              <p className="text-muted-foreground text-xs">
                Generates a new certificate and extends expiration by 3 years from today.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-ada-purple/10 text-ada-purple border-ada-purple/20 hover:bg-ada-purple/20"
                onClick={async () => {
                  if (!confirm('Renew certification? This will generate a new Postpartum Doula certificate and extend expiration by 3 years.')) return;
                  setLoading(true);
                  const res = await fetch('/api/certificates/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      doula_id: params.id,
                      certificate_type: 'postpartum',
                    }),
                  });
                  if (res.ok) {
                    reloadData();
                  } else {
                    const data = await res.json();
                    alert(data.error || 'Renewal failed');
                  }
                  setLoading(false);
                }}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Renew (Postpartum)'}
              </Button>
            </div>
          </div>
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
                  <th className="text-left p-2">Status</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id} className={`border-b ${exam.voided ? 'opacity-50' : ''}`}>
                    <td className="p-2 font-mono">{exam.exam_session ?? '—'}</td>
                    <td className="p-2">{exam.exam_date ?? '—'}</td>
                    <td className="p-2">{exam.overall_score ?? '—'}</td>
                    <td className="p-2">{exam.proficiency_level ?? '—'}</td>
                    <td className="p-2">
                      {exam.passed === true ? '✓' : exam.passed === false ? '✗' : '—'}
                    </td>
                    <td className="p-2">
                      {exam.voided ? (
                        <Badge className="bg-gray-100 text-gray-500">Voided</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">Valid</Badge>
                      )}
                    </td>
                    <td className="p-2">
                      <ExamEditDialog exam={exam} onSaved={reloadData} />
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
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certs.map((cert) => (
                  <tr key={cert.id} className={`border-b ${cert.status === 'revoked' ? 'opacity-50' : ''}`}>
                    <td className="p-2">
                      {CERT_TYPE_LABELS[cert.certificate_type as CertificateType] ?? cert.certificate_type}
                    </td>
                    <td className="p-2 font-mono">{cert.certificate_number}</td>
                    <td className="p-2">{cert.issued_date}</td>
                    <td className="p-2">{cert.expiration_date}</td>
                    <td className="p-2">
                      {cert.status === 'revoked' ? (
                        <Badge className="bg-red-100 text-red-800">Revoked</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      )}
                    </td>
                    <td className="p-2 space-x-2">
                      {cert.pdf_url && (
                        <a
                          href={cert.pdf_url}
                          target="_blank"
                          className="text-ada-cyan hover:underline text-xs"
                        >
                          PDF
                        </a>
                      )}
                      {cert.status !== 'revoked' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                            onClick={async () => {
                              const res = await fetch('/api/certificates/generate', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  doula_id: params.id,
                                  certificate_type: cert.certificate_type,
                                  regenerate_id: cert.id,
                                }),
                              });
                              if (res.ok) reloadData();
                            }}
                          >
                            Regen PDF
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={async () => {
                              if (!confirm('Revoke this certificate? This cannot be undone.')) return;
                              await supabase
                                .from('certificates')
                                .update({
                                  status: 'revoked',
                                  revoked_at: new Date().toISOString(),
                                  updated_at: new Date().toISOString(),
                                })
                                .eq('id', cert.id);
                              reloadData();
                            }}
                          >
                            Revoke
                          </Button>
                        </>
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

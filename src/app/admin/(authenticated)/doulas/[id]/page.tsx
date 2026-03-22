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
  EXAM_STATUSES,
  EXAM_STATUS_LABELS,
  EXAM_STATUS_COLORS,
  CERTIFICATE_TYPES,
  CERT_TYPE_LABELS,
  CREDENTIAL_TYPES,
  CREDENTIAL_LABELS,
  CREDENTIAL_COLORS,
  CREDENTIAL_STATUSES,
  CREDENTIAL_STATUS_LABELS,
  CREDENTIAL_STATUS_COLORS,
} from '@/lib/constants';
import type { DoulaStatus, ExamStatus, CertificateType, CredentialType, CredentialStatus } from '@/lib/constants';
import { ExamEditDialog, type ExamRecord } from '@/components/admin/exam-edit-dialog';
import { computeProficiencyLevel, PASS_SCORE } from '@/lib/utils';

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
          new Date(certDate).setFullYear(new Date(certDate).getFullYear() + 1)
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
        exam_status: form.get('exam_status'),
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
        <div className="flex gap-2">
          <Badge className={STATUS_COLORS[doula.status as DoulaStatus]}>
            {STATUS_LABELS[doula.status as DoulaStatus]}
          </Badge>
          <Badge className={EXAM_STATUS_COLORS[doula.exam_status as ExamStatus] ?? 'bg-gray-100 text-gray-600'}>
            Exam: {EXAM_STATUS_LABELS[doula.exam_status as ExamStatus] ?? 'Not Started'}
          </Badge>
        </div>
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
                  status: 'active',
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
                    <Badge className={CREDENTIAL_STATUS_COLORS[cred.status as CredentialStatus] ?? 'bg-gray-100 text-gray-600'}>
                      {CREDENTIAL_STATUS_LABELS[cred.status as CredentialStatus] ?? cred.status}
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
                      {CREDENTIAL_STATUSES.map((s) => (
                        <option key={s} value={s}>{CREDENTIAL_STATUS_LABELS[s]}</option>
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
                <Label>Account Status</Label>
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
                <Label>Exam Status</Label>
                <select
                  name="exam_status"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  defaultValue={doula.exam_status ?? 'not_started'}
                >
                  {EXAM_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {EXAM_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Training Provider</Label>
                <Input
                  name="training_provider"
                  defaultValue={doula.training_provider ?? ''}
                />
              </div>
              <div>
                <Label>Region</Label>
                <Input name="region" defaultValue={doula.region ?? ''} />
              </div>
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

      {/* Grant Certification — available unless revoked/suspended */}
      {!['revoked', 'suspended'].includes(doula.status) && (
        <GrantCertification
          doulaId={params.id as string}
          doulaName={doula.full_name}
          existingCertTypes={certs.map((c: Record<string, string>) => c.certificate_type)}
          loading={loading}
          setLoading={setLoading}
          onDone={reloadData}
        />
      )}

      {/* Renew Certification — when there are existing certs */}
      {certs.length > 0 && !['revoked', 'suspended'].includes(doula.status) && (
        <RenewCertification
          doula={doula}
          doulaId={params.id as string}
          loading={loading}
          setLoading={setLoading}
          onDone={reloadData}
        />
      )}

      {/* Exam Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Exam Results</CardTitle>
            <InlineExamRecorder doulaId={params.id as string} doulaName={doula.full_name} onSaved={reloadData} />
          </div>
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
                          className="text-cyan-500 hover:underline text-xs"
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

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 text-base">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium">Delete this doula</p>
              <p className="text-muted-foreground text-xs">This will permanently delete the doula, all exam results, certificates, and credentials. This cannot be undone.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 shrink-0"
              onClick={async () => {
                if (!confirm(`Delete ${doula.full_name} (${doula.doula_id_code}) and ALL related records? This cannot be undone.`)) return;
                if (!confirm('Are you absolutely sure? Type DELETE in the next prompt.')) return;
                setLoading(true);
                // Delete related records first
                await supabase.from('exam_results').delete().eq('doula_id', params.id);
                await supabase.from('certificates').delete().eq('doula_id', params.id);
                await supabase.from('doula_credentials').delete().eq('doula_id', params.id);
                await supabase.from('doulas').delete().eq('id', params.id);
                router.push('/admin/doulas');
                router.refresh();
              }}
              disabled={loading}
            >
              Delete Doula
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ==================== Grant Certification ==================== */
function GrantCertification({
  doulaId, doulaName, existingCertTypes, loading, setLoading, onDone,
}: {
  doulaId: string;
  doulaName: string;
  existingCertTypes: string[];
  loading: boolean;
  setLoading: (v: boolean) => void;
  onDone: () => void;
}) {
  const availableTypes = CERTIFICATE_TYPES.filter(t => !existingCertTypes.includes(t));
  const [certType, setCertType] = useState<string>(availableTypes[0] || 'postpartum');
  const defaultExp = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
  const [expDate, setExpDate] = useState(defaultExp);
  const [result, setResult] = useState<string | null>(null);

  if (availableTypes.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Grant Certification</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">All certificate types have been granted.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grant Certification</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Certificate Type</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={certType}
                onChange={(e) => setCertType(e.target.value)}
              >
                {availableTypes.map((t) => (
                  <option key={t} value={t}>{CERT_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Expiration Date</Label>
              <Input type="date" value={expDate} onChange={(e) => setExpDate(e.target.value)} />
              <p className="text-xs text-muted-foreground mt-1">Default: 1 year from today</p>
            </div>
          </div>
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800">
              {result}
            </div>
          )}
          <Button
            className="bg-ada-purple hover:bg-ada-purple/90"
            disabled={loading}
            onClick={async () => {
              if (!confirm(`Grant ${CERT_TYPE_LABELS[certType as CertificateType]} to ${doulaName}?`)) return;
              setLoading(true);
              setResult(null);
              const res = await fetch('/api/certificates/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  doula_id: doulaId,
                  certificate_type: certType,
                  expiration_date: expDate,
                }),
              });
              const data = await res.json();
              if (res.ok) {
                setResult(`Certificate ${data.certificate?.certificate_number} generated. PDF ready for download.`);
                onDone();
              } else {
                alert(data.error || 'Generation failed');
              }
              setLoading(false);
            }}
          >
            {loading ? 'Generating...' : 'Grant Certification & Generate PDF'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ==================== Renew Certification ==================== */
function RenewCertification({
  doula, doulaId, loading, setLoading, onDone,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doula: Record<string, any>;
  doulaId: string;
  loading: boolean;
  setLoading: (v: boolean) => void;
  onDone: () => void;
}) {
  const currentExp = doula.expiration_date;
  const baseDate = currentExp && new Date(currentExp) > new Date() ? new Date(currentExp) : new Date();
  const defaultRenew = new Date(baseDate.setFullYear(baseDate.getFullYear() + 1)).toISOString().split('T')[0];
  const [renewDate, setRenewDate] = useState(defaultRenew);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certification Renewal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm space-y-1">
            <p>
              <span className="text-muted-foreground">Current Expiration:</span>{' '}
              <span className={`font-medium ${currentExp && new Date(currentExp) < new Date() ? 'text-red-600' : ''}`}>
                {currentExp ?? 'Not set'}
              </span>
            </p>
          </div>
          <div className="flex items-end gap-4">
            <div>
              <Label>New Expiration Date</Label>
              <Input type="date" value={renewDate} onChange={(e) => setRenewDate(e.target.value)} />
              <p className="text-xs text-muted-foreground mt-1">Default: +1 year from current expiration</p>
            </div>
            <Button
              variant="outline"
              className="bg-ada-purple/10 text-ada-purple border-ada-purple/20 hover:bg-ada-purple/20"
              onClick={async () => {
                if (!confirm(`Renew certification until ${renewDate}? This will regenerate the PDF.`)) return;
                setLoading(true);
                const res = await fetch('/api/certificates/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    doula_id: doulaId,
                    certificate_type: 'postpartum',
                    expiration_date: renewDate,
                  }),
                });
                if (res.ok) {
                  onDone();
                } else {
                  const data = await res.json();
                  alert(data.error || 'Renewal failed');
                }
                setLoading(false);
              }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Renew & Regenerate PDF'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ==================== Inline Exam Recorder ==================== */
function InlineExamRecorder({
  doulaId, doulaName, onSaved,
}: {
  doulaId: string;
  doulaName: string;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [examSession, setExamSession] = useState('');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [examType, setExamType] = useState('postpartum');
  const [scores, setScores] = useState({
    score_terminology: '', score_newborn: '', score_lactation: '', score_emergency: '',
    score_practical: '', score_postpartum: '', score_knowledge: '', score_ethics: '',
  });

  const scoreValues = Object.values(scores).filter(s => s !== '').map(Number);
  const overall = scoreValues.length > 0 ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length) : null;
  const passed = overall !== null ? overall >= PASS_SCORE : null;

  async function handleSave() {
    if (!examSession || !examDate) return;
    setSaving(true);
    const { error } = await supabase.from('exam_results').insert({
      doula_id: doulaId,
      exam_session: examSession,
      exam_date: examDate,
      exam_type: examType,
      overall_score: overall,
      score_terminology: scores.score_terminology ? Number(scores.score_terminology) : null,
      score_newborn: scores.score_newborn ? Number(scores.score_newborn) : null,
      score_lactation: scores.score_lactation ? Number(scores.score_lactation) : null,
      score_emergency: scores.score_emergency ? Number(scores.score_emergency) : null,
      score_practical: scores.score_practical ? Number(scores.score_practical) : null,
      score_postpartum: scores.score_postpartum ? Number(scores.score_postpartum) : null,
      score_knowledge: scores.score_knowledge ? Number(scores.score_knowledge) : null,
      score_ethics: scores.score_ethics ? Number(scores.score_ethics) : null,
      passed,
      proficiency_level: computeProficiencyLevel(overall),
    });
    if (error) {
      alert(error.message);
    } else {
      await supabase.from('doulas').update({ exam_status: passed ? 'passed' : 'failed' }).eq('id', doulaId);
      setOpen(false);
      setExamSession('');
      setScores({ score_terminology: '', score_newborn: '', score_lactation: '', score_emergency: '', score_practical: '', score_postpartum: '', score_knowledge: '', score_ethics: '' });
      onSaved();
    }
    setSaving(false);
  }

  if (!open) {
    return <Button variant="outline" size="sm" className="text-xs" onClick={() => setOpen(true)}>+ Record Exam</Button>;
  }

  const fields = [
    { key: 'score_terminology', label: 'Term.' }, { key: 'score_newborn', label: 'Newborn' },
    { key: 'score_lactation', label: 'Lact.' }, { key: 'score_emergency', label: 'Emerg.' },
    { key: 'score_practical', label: 'Pract.' }, { key: 'score_postpartum', label: 'Postpart.' },
    { key: 'score_knowledge', label: 'Know.' }, { key: 'score_ethics', label: 'Ethics' },
  ];

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-zinc-50">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Record Exam for {doulaName}</p>
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>✕</Button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs">Session</Label>
          <Input className="text-sm" placeholder="IRV-20260322-001" value={examSession} onChange={e => setExamSession(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">Date</Label>
          <Input type="date" className="text-sm" value={examDate} onChange={e => setExamDate(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">Type</Label>
          <select className="w-full border rounded-md px-2 py-1.5 text-sm" value={examType} onChange={e => setExamType(e.target.value)}>
            <option value="postpartum">Postpartum</option>
            <option value="birth">Birth</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {fields.map(f => (
          <div key={f.key}>
            <label className="text-[10px] text-muted-foreground">{f.label}</label>
            <Input type="number" min="0" max="100" className="text-center text-sm"
              value={scores[f.key as keyof typeof scores]}
              onChange={e => setScores({ ...scores, [f.key]: e.target.value })} />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        {overall !== null && (
          <span className={`text-sm font-mono px-2 py-0.5 rounded ${passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            Overall: {overall} — {passed ? 'PASS' : 'FAIL'}
          </span>
        )}
        <Button size="sm" className="bg-ada-purple hover:bg-ada-purple/90 text-xs" onClick={handleSave} disabled={saving || !examSession || overall === null}>
          {saving ? 'Saving...' : 'Save Result'}
        </Button>
      </div>
    </div>
  );
}

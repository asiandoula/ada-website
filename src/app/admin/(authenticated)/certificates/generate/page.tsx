'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CERTIFICATE_TYPES, CERT_TYPE_LABELS } from '@/lib/constants';
import { EmailSendDialog, type EmailRecipient } from '@/components/admin/email-send-dialog';

export default function GenerateCertificatePage() {
  const router = useRouter();
  const supabase = createClient();
  const [doulas, setDoulas] = useState<Record<string, string>[]>([]);
  const [selectedDoula, setSelectedDoula] = useState('');
  const [certType, setCertType] = useState<string>('postpartum');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<Record<string, any> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [existingCert, setExistingCert] = useState<Record<string, any> | null>(null);
  const [emailRecipients, setEmailRecipients] = useState<EmailRecipient[]>([]);
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('doulas')
        .select('id, full_name, doula_id_code, email')
        .in('status', ['active'])
        .order('full_name');
      setDoulas((data as Record<string, string>[]) ?? []);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for existing certificate when doula or type changes
  useEffect(() => {
    async function checkExisting() {
      if (!selectedDoula || !certType) {
        setExistingCert(null);
        return;
      }
      const { data } = await supabase
        .from('certificates')
        .select('certificate_number, verification_code, pdf_url, issued_date')
        .eq('doula_id', selectedDoula)
        .eq('certificate_type', certType)
        .single();
      setExistingCert(data);
    }
    checkExisting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDoula, certType]);

  async function handleGenerate() {
    if (!selectedDoula || !certType) {
      setError('Please select a doula and certificate type.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doula_id: selectedDoula,
          certificate_type: certType,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        setError('Server error — please restart dev server and try again.');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setError(data.error || 'Generation failed');
        setLoading(false);
        return;
      }

      setResult(data);
      setExistingCert(null); // refresh

      // Auto-prompt email notification
      const doula = doulas.find((d) => d.id === selectedDoula);
      if (doula?.email && data.certificate) {
        setEmailRecipients([{
          doula_id: selectedDoula,
          doula_name: doula.full_name,
          doula_id_code: doula.doula_id_code,
          email: doula.email,
          related_id: data.certificate.id,
          type: 'certificate',
        }]);
        setShowEmailDialog(true);
      }
    } catch {
      setError('Network error — please check your connection.');
    }
    setLoading(false);
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Generate Certificate</h1>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label>Select Doula *</Label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={selectedDoula}
              onChange={(e) => { setSelectedDoula(e.target.value); setResult(null); setError(''); }}
            >
              <option value="">Choose a doula...</option>
              {doulas.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.full_name} ({d.doula_id_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Certificate Type *</Label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={certType}
              onChange={(e) => { setCertType(e.target.value); setResult(null); setError(''); }}
            >
              {CERTIFICATE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {CERT_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>

          {/* Show existing certificate info */}
          {existingCert && !result && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-1">
              <p className="text-blue-800 font-medium text-sm">This doula already has a certificate</p>
              <p className="text-sm text-blue-700">Number: <code>{existingCert.certificate_number}</code></p>
              <p className="text-sm text-blue-700">Issued: {existingCert.issued_date}</p>
              {existingCert.pdf_url ? (
                <a href={existingCert.pdf_url} target="_blank" className="text-ada-purple hover:underline text-sm">
                  Download existing PDF
                </a>
              ) : (
                <p className="text-sm text-blue-600 italic">No PDF generated yet — click Generate to create one.</p>
              )}
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 space-y-2">
              <p className="text-green-800 font-medium">Certificate generated!</p>
              <p className="text-sm">
                Number: <code>{result.certificate.certificate_number}</code>
              </p>
              <p className="text-sm">
                Verification: <code>{result.certificate.verification_code}</code>
              </p>
              {result.pdf_url && (
                <a
                  href={result.pdf_url}
                  target="_blank"
                  className="text-ada-purple hover:underline text-sm"
                >
                  Download PDF
                </a>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              className="bg-ada-purple hover:bg-ada-purple/90"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? 'Generating...' : existingCert?.pdf_url ? 'Regenerate PDF' : 'Generate Certificate'}
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      <EmailSendDialog
        open={showEmailDialog}
        onClose={() => {
          setShowEmailDialog(false);
          setEmailRecipients([]);
        }}
        recipients={emailRecipients}
        title="Certificate Generated — Send Notification?"
        description="The doula will receive their certificate PDF as an email attachment."
      />
    </div>
  );
}

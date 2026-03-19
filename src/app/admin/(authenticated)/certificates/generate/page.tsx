'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CERTIFICATE_TYPES, CERT_TYPE_LABELS } from '@/lib/constants';

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

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('doulas')
        .select('id, full_name, doula_id_code')
        .in('status', ['certified_active'])
        .order('full_name');
      setDoulas((data as Record<string, string>[]) ?? []);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleGenerate() {
    if (!selectedDoula || !certType) {
      setError('Please select a doula and certificate type.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const response = await fetch('/api/certificates/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doula_id: selectedDoula,
        certificate_type: certType,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Generation failed');
      setLoading(false);
      return;
    }

    setResult(data);
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
              onChange={(e) => setSelectedDoula(e.target.value)}
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
              onChange={(e) => setCertType(e.target.value)}
            >
              {CERTIFICATE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {CERT_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>

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
              <a
                href={result.pdf_url}
                target="_blank"
                className="text-ada-purple hover:underline text-sm"
              >
                Download PDF
              </a>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              className="bg-ada-purple hover:bg-ada-purple/90"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Certificate'}
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

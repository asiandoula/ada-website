'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function ExamVerifyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/exam-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doula_id_code: id, full_name: fullName }),
      });

      if (res.ok) {
        router.push(`/exam-home/exam-chs/${id}/exam-result`);
        return;
      }

      const data = await res.json();

      if (res.status === 404) {
        setError('Exam record not found. Please check the exam ID.');
      } else if (res.status === 429) {
        setError('Too many attempts. Please try again later.');
      } else if (res.status === 401) {
        setError('Name does not match our records. Please try again.');
      } else {
        setError(data.error || 'Verification failed. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4 py-16">
      <Card className="max-w-md w-full shadow-lg border-0">
        <CardContent className="pt-8 pb-8 px-8">
          <div className="text-center mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ada-logo.svg"
              alt="ADA"
              className="h-12 mx-auto mb-4"
            />
            <h1 className="text-xl font-poppins font-bold text-ada-navy mb-1">
              Exam Result Lookup
            </h1>
            <p className="text-sm text-muted-foreground">
              Verify your identity to view exam results
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="exam-id" className="text-sm font-medium">
                Exam ID
              </Label>
              <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-ada-purple" />
                <span className="font-mono text-sm">{id}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full-name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="full-name"
                type="text"
                placeholder="Enter your full name to verify identity"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoFocus
                className="h-11"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !fullName.trim()}
              className="w-full h-11 bg-ada-purple hover:bg-ada-purple/90 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & View Results'
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Asian Doula Alliance — asiandoula.org
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

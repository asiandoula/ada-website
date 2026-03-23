'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { EmailType } from '@/lib/email';

export interface EmailRecipient {
  doula_id: string;
  doula_name: string;
  doula_id_code: string;
  email: string | null;
  related_id: string;
  type: EmailType;
  passed?: boolean | null;
}

interface EmailSendDialogProps {
  open: boolean;
  onClose: () => void;
  recipients: EmailRecipient[];
  title: string;
  description?: string;
}

export function EmailSendDialog({ open, onClose, recipients, title, description }: EmailSendDialogProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setSelected(new Set(recipients.filter((r) => r.email).map((r) => r.doula_id)));
    setResult(null);
    setErrors([]);
    setSending(false);
  }, [recipients]);

  if (!open) return null;

  const hasEmail = recipients.filter((r) => r.email);
  const noEmail = recipients.filter((r) => !r.email);

  function toggleSelect(doulaId: string) {
    const next = new Set(selected);
    if (next.has(doulaId)) next.delete(doulaId);
    else next.add(doulaId);
    setSelected(next);
  }

  async function handleSend() {
    const toSend = recipients.filter((r) => selected.has(r.doula_id) && r.email);
    if (toSend.length === 0) return;

    setSending(true);
    setResult(null);
    setErrors([]);

    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails: toSend.map((r) => ({
            type: r.type,
            doula_id: r.doula_id,
            related_id: r.related_id,
            recipient_email: r.email,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data.summary);
        const failedResults = data.results?.filter((r: { status: string; error?: string }) => r.status === 'failed') ?? [];
        setErrors(failedResults.map((r: { error?: string }) => r.error || 'Unknown error'));
      } else {
        setErrors([data.error || 'Failed to send']);
      }
    } catch (err) {
      setErrors([err instanceof Error ? err.message : 'Network error']);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}

          {hasEmail.length > 0 && (
            <div className="space-y-2 mb-4">
              {hasEmail.map((r) => (
                <label
                  key={r.doula_id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-zinc-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(r.doula_id)}
                    onChange={() => toggleSelect(r.doula_id)}
                    disabled={sending || result !== null}
                    className="rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{r.doula_name}</span>
                      <span className="text-xs font-mono text-muted-foreground">{r.doula_id_code}</span>
                      {r.passed !== undefined && r.passed !== null && (
                        <span className={`text-xs px-1.5 py-0.5 rounded ${r.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {r.passed ? 'Pass' : 'Fail'}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{r.email}</span>
                  </div>
                </label>
              ))}
            </div>
          )}

          {noEmail.length > 0 && (
            <div className="space-y-1 mb-4 opacity-50">
              {noEmail.map((r) => (
                <div key={r.doula_id} className="flex items-center gap-3 p-2">
                  <input type="checkbox" disabled checked={false} className="rounded" />
                  <span className="text-sm">{r.doula_name}</span>
                  <span className="text-xs text-muted-foreground italic">No email</span>
                </div>
              ))}
            </div>
          )}

          {result && (
            <div className={`p-3 rounded-md text-sm mb-4 ${result.failed > 0 ? 'bg-amber-50 border border-amber-200 text-amber-800' : 'bg-green-50 border border-green-200 text-green-800'}`}>
              {result.sent} sent{result.failed > 0 ? `, ${result.failed} failed` : ''}
              {errors.length > 0 && (
                <ul className="mt-1 text-xs list-disc list-inside">
                  {errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" onClick={onClose} disabled={sending}>
              {result ? 'Done' : 'Skip'}
            </Button>
            {!result && (
              <Button
                className="bg-ada-purple hover:bg-ada-purple/90"
                onClick={handleSend}
                disabled={sending || selected.size === 0}
              >
                {sending ? 'Sending...' : `Send to ${selected.size} Doula${selected.size !== 1 ? 's' : ''}`}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

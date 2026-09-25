'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  INQUIRY_STATUSES,
  INQUIRY_STATUS_HINTS,
  INQUIRY_STATUS_LABELS,
  type InquiryStatus,
} from '@/lib/inquiries';

interface Props {
  id: string;
  enabled: boolean;
  initialStatus: InquiryStatus;
  initialNote: string;
  // Pre-formatted on the server so the client never re-formats dates (no hydration drift).
  lastUpdated: string | null;
}

const SELECTED: Record<InquiryStatus, string> = {
  new: 'border-amber-400 bg-amber-50 ring-2 ring-amber-200',
  contacted: 'border-green-500 bg-green-50 ring-2 ring-green-200',
  referred: 'border-blue-500 bg-blue-50 ring-2 ring-blue-200',
  spam: 'border-zinc-400 bg-zinc-100 ring-2 ring-zinc-200',
};

export function InquiryStatusEditor({ id, enabled, initialStatus, initialNote, lastUpdated }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<InquiryStatus>(initialStatus);
  const [note, setNote] = useState(initialNote);
  const [savedNote, setSavedNote] = useState(initialNote);
  const [saving, setSaving] = useState<'status' | 'note' | null>(null);

  async function save(patch: { status?: InquiryStatus; note?: string }, kind: 'status' | 'note') {
    setSaving(kind);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.error || 'Could not save. Please try again.');
        return false;
      }
      toast.success(kind === 'status' ? `Marked as ${INQUIRY_STATUS_LABELS[patch.status!]}` : 'Note saved');
      router.refresh();
      return true;
    } catch {
      toast.error('Network error. Please try again.');
      return false;
    } finally {
      setSaving(null);
    }
  }

  async function chooseStatus(next: InquiryStatus) {
    if (next === status || saving) return;
    const previous = status;
    setStatus(next);
    const ok = await save({ status: next }, 'status');
    if (!ok) setStatus(previous);
  }

  async function saveNote() {
    const ok = await save({ note }, 'note');
    if (ok) setSavedNote(note.trim());
  }

  const noteDirty = note.trim() !== savedNote.trim();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Follow-up</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {!enabled && (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Status and notes switch on after the database update (migration 017) is run.
          </p>
        )}

        <div className="space-y-2">
          {INQUIRY_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              disabled={!enabled || saving !== null}
              onClick={() => chooseStatus(s)}
              aria-pressed={status === s}
              className={cn(
                'w-full rounded-md border bg-white px-3 py-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60',
                status === s ? SELECTED[s] : 'border-zinc-200 hover:bg-zinc-50'
              )}
            >
              <span className="block text-sm font-medium">{INQUIRY_STATUS_LABELS[s]}</span>
              <span className="block text-xs text-muted-foreground">{INQUIRY_STATUS_HINTS[s]}</span>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label htmlFor="inquiry-note" className="text-sm font-medium">
            Internal note
          </label>
          <Textarea
            id="inquiry-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={!enabled}
            maxLength={4000}
            rows={4}
            placeholder="e.g. Called 9/25, left voicemail. Referred to Jenny (Mandarin, Kaiser)."
          />
          <Button
            type="button"
            size="sm"
            onClick={saveNote}
            disabled={!enabled || !noteDirty || saving !== null}
          >
            {saving === 'note' ? 'Saving…' : 'Save note'}
          </Button>
        </div>

        {lastUpdated && (
          <p className="text-xs text-muted-foreground">Last updated by {lastUpdated}</p>
        )}
      </CardContent>
    </Card>
  );
}

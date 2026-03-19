'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { computeProficiencyLevel } from '@/lib/utils';

export interface ExamRecord {
  id: string;
  doula_id: string;
  exam_session: string | null;
  exam_date: string | null;
  overall_score: number | null;
  score_terminology: number | null;
  score_newborn: number | null;
  score_lactation: number | null;
  score_emergency: number | null;
  score_practical: number | null;
  score_postpartum: number | null;
  score_knowledge: number | null;
  score_ethics: number | null;
  passed: boolean | null;
  proficiency_level: string | null;
  notes: string | null;
  voided: boolean;
  voided_at: string | null;
  created_at: string;
  updated_at: string | null;
}

interface ExamEditDialogProps {
  exam: ExamRecord;
  onSaved: () => void;
  trigger?: React.ReactNode;
}

const SCORE_FIELDS = [
  { key: 'overall_score', label: 'Overall' },
  { key: 'score_terminology', label: 'Terminology' },
  { key: 'score_newborn', label: 'Newborn' },
  { key: 'score_lactation', label: 'Lactation' },
  { key: 'score_emergency', label: 'Emergency' },
  { key: 'score_practical', label: 'Practical' },
  { key: 'score_postpartum', label: 'Postpartum' },
  { key: 'score_knowledge', label: 'Knowledge' },
  { key: 'score_ethics', label: 'Ethics' },
] as const;

export function ExamEditDialog({ exam, onSaved, trigger }: ExamEditDialogProps) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [voidConfirm, setVoidConfirm] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const overall = form.get('overall_score') ? Number(form.get('overall_score')) : null;

    const { error } = await supabase
      .from('exam_results')
      .update({
        exam_session: form.get('exam_session') || null,
        exam_date: form.get('exam_date') || null,
        overall_score: overall,
        score_terminology: form.get('score_terminology') ? Number(form.get('score_terminology')) : null,
        score_newborn: form.get('score_newborn') ? Number(form.get('score_newborn')) : null,
        score_lactation: form.get('score_lactation') ? Number(form.get('score_lactation')) : null,
        score_emergency: form.get('score_emergency') ? Number(form.get('score_emergency')) : null,
        score_practical: form.get('score_practical') ? Number(form.get('score_practical')) : null,
        score_postpartum: form.get('score_postpartum') ? Number(form.get('score_postpartum')) : null,
        score_knowledge: form.get('score_knowledge') ? Number(form.get('score_knowledge')) : null,
        score_ethics: form.get('score_ethics') ? Number(form.get('score_ethics')) : null,
        passed: overall !== null ? overall >= 85 : null,
        proficiency_level: computeProficiencyLevel(overall),
        notes: form.get('notes') || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', exam.id);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setOpen(false);
    onSaved();
  }

  async function handleVoid() {
    setLoading(true);
    const { error } = await supabase
      .from('exam_results')
      .update({
        voided: true,
        voided_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', exam.id);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setOpen(false);
    setVoidConfirm(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); setVoidConfirm(false); setError(''); }}>
      <DialogTrigger>
        {trigger || <Button variant="outline" size="sm" type="button">Edit</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {exam.voided ? 'Voided Exam Record' : 'Edit Exam Record'}
          </DialogTitle>
        </DialogHeader>

        {exam.voided ? (
          <p className="text-muted-foreground text-sm py-4">
            This exam record has been voided and cannot be edited.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Exam Session</Label>
                <Input name="exam_session" defaultValue={exam.exam_session ?? ''} />
              </div>
              <div>
                <Label>Exam Date</Label>
                <Input name="exam_date" type="date" defaultValue={exam.exam_date ?? ''} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {SCORE_FIELDS.map(({ key, label }) => (
                <div key={key}>
                  <Label className="text-xs">{label}</Label>
                  <Input
                    name={key}
                    type="number"
                    step="0.01"
                    defaultValue={exam[key as keyof ExamRecord]?.toString() ?? ''}
                  />
                </div>
              ))}
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea name="notes" defaultValue={exam.notes ?? ''} rows={2} />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-between">
              <div>
                {!voidConfirm ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setVoidConfirm(true)}
                  >
                    Void Record
                  </Button>
                ) : (
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-red-600">Are you sure?</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleVoid}
                      disabled={loading}
                    >
                      Yes, Void
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setVoidConfirm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="bg-ada-purple hover:bg-ada-purple/90"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

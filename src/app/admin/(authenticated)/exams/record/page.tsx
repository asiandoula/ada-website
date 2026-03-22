'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { computeProficiencyLevel, PASS_SCORE } from '@/lib/utils';

interface ExamEntry {
  doula_id: string;
  doula_name: string;
  score_terminology: string;
  score_newborn: string;
  score_lactation: string;
  score_emergency: string;
  score_practical: string;
  score_postpartum: string;
  score_knowledge: string;
  score_ethics: string;
  override_passed: boolean | null; // null = auto, true/false = manual override
  override_note: string;
}

const EMPTY_ENTRY: Omit<ExamEntry, 'doula_id' | 'doula_name'> = {
  score_terminology: '',
  score_newborn: '',
  score_lactation: '',
  score_emergency: '',
  score_practical: '',
  score_postpartum: '',
  score_knowledge: '',
  score_ethics: '',
  override_passed: null,
  override_note: '',
};

const SUB_SCORE_FIELDS = [
  { key: 'score_terminology', label: 'Term.' },
  { key: 'score_newborn', label: 'Newborn' },
  { key: 'score_lactation', label: 'Lact.' },
  { key: 'score_emergency', label: 'Emerg.' },
  { key: 'score_practical', label: 'Pract.' },
  { key: 'score_postpartum', label: 'Postpart.' },
  { key: 'score_knowledge', label: 'Know.' },
  { key: 'score_ethics', label: 'Ethics' },
] as const;

function calcOverall(entry: ExamEntry): number | null {
  const scores = SUB_SCORE_FIELDS.map(f => entry[f.key as keyof ExamEntry] as string).filter(s => s !== '').map(Number);
  if (scores.length === 0) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export default function RecordExamPage() {
  const router = useRouter();
  const supabase = createClient();
  const [doulas, setDoulas] = useState<Record<string, string>[]>([]);
  const [examSession, setExamSession] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examType, setExamType] = useState('postpartum');
  const [entries, setEntries] = useState<ExamEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDoulas() {
      const { data } = await supabase
        .from('doulas')
        .select('id, full_name, doula_id_code')
        .order('full_name');
      setDoulas((data as Record<string, string>[]) ?? []);
    }
    loadDoulas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addEntry(doulaId: string) {
    const doula = doulas.find((d) => d.id === doulaId);
    if (!doula || entries.some((e) => e.doula_id === doulaId)) return;
    setEntries([
      ...entries,
      { doula_id: doulaId, doula_name: doula.full_name, ...EMPTY_ENTRY },
    ]);
  }

  function updateEntry(index: number, field: string, value: string) {
    const updated = [...entries];
    (updated[index] as unknown as Record<string, string>)[field] = value;
    // Reset override when scores change
    if (SUB_SCORE_FIELDS.some(f => f.key === field)) {
      updated[index].override_passed = null;
      updated[index].override_note = '';
    }
    setEntries(updated);
  }

  function toggleOverride(index: number) {
    const updated = [...entries];
    const overall = calcOverall(updated[index]);
    const autoPassed = overall !== null && overall >= PASS_SCORE;
    if (updated[index].override_passed === null) {
      // Enable override — flip the auto result
      updated[index].override_passed = !autoPassed;
    } else {
      // Disable override — go back to auto
      updated[index].override_passed = null;
      updated[index].override_note = '';
    }
    setEntries(updated);
  }

  function removeEntry(index: number) {
    setEntries(entries.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (!examSession || !examDate || entries.length === 0) {
      setError('Please fill in exam session, date, and add at least one doula.');
      return;
    }

    // Validate override notes
    for (const entry of entries) {
      if (entry.override_passed !== null && !entry.override_note.trim()) {
        setError(`Override for ${entry.doula_name} requires a note.`);
        return;
      }
    }

    setLoading(true);
    setError('');

    const records = entries.map((entry) => {
      const overall = calcOverall(entry);
      const autoPassed = overall !== null ? overall >= PASS_SCORE : null;
      const passed = entry.override_passed !== null ? entry.override_passed : autoPassed;

      return {
        doula_id: entry.doula_id,
        exam_session: examSession,
        exam_date: examDate,
        exam_type: examType,
        overall_score: overall,
        score_terminology: entry.score_terminology ? Number(entry.score_terminology) : null,
        score_newborn: entry.score_newborn ? Number(entry.score_newborn) : null,
        score_lactation: entry.score_lactation ? Number(entry.score_lactation) : null,
        score_emergency: entry.score_emergency ? Number(entry.score_emergency) : null,
        score_practical: entry.score_practical ? Number(entry.score_practical) : null,
        score_postpartum: entry.score_postpartum ? Number(entry.score_postpartum) : null,
        score_knowledge: entry.score_knowledge ? Number(entry.score_knowledge) : null,
        score_ethics: entry.score_ethics ? Number(entry.score_ethics) : null,
        passed,
        proficiency_level: computeProficiencyLevel(overall),
        notes: entry.override_passed !== null
          ? `[OVERRIDE] ${entry.override_passed ? 'Manually passed' : 'Manually failed'}: ${entry.override_note}`
          : null,
      };
    });

    const { error } = await supabase.from('exam_results').insert(records);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Auto-update doula status for passed/failed
    for (const record of records) {
      if (record.passed) {
        await supabase.from('doulas').update({ status: 'exam_scheduled' }).eq('id', record.doula_id).eq('status', 'exam_scheduled');
        // Don't auto-set to certified_active — admin needs to Grant Certification
      } else if (record.passed === false) {
        await supabase.from('doulas').update({ status: 'exam_failed' }).eq('id', record.doula_id);
      }
    }

    router.push('/admin/exams');
    router.refresh();
  }

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold mb-2">Record Exam Results</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Passing score: <strong>{PASS_SCORE}/100</strong>. Overall score is auto-calculated as the average of all sub-scores.
        You can manually override pass/fail for individual doulas with a required note.
      </p>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label>Exam Session *</Label>
              <Input
                placeholder="e.g. IRV-20260321-001"
                value={examSession}
                onChange={(e) => setExamSession(e.target.value)}
              />
            </div>
            <div>
              <Label>Exam Date *</Label>
              <Input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Exam Type</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
              >
                <option value="postpartum">Postpartum Doula</option>
                <option value="birth">Birth Doula</option>
              </select>
            </div>
            <div>
              <Label>Add Doula</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                onChange={(e) => {
                  addEntry(e.target.value);
                  e.target.value = '';
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Select doula...
                </option>
                {doulas.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.full_name} ({d.doula_id_code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {entries.length > 0 && (
        <div className="space-y-3">
          {entries.map((entry, i) => {
            const overall = calcOverall(entry);
            const autoPassed = overall !== null ? overall >= PASS_SCORE : null;
            const finalPassed = entry.override_passed !== null ? entry.override_passed : autoPassed;
            const isOverridden = entry.override_passed !== null;

            return (
              <Card key={entry.doula_id}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{entry.doula_name}</span>
                      {overall !== null && (
                        <span className={`text-sm font-mono px-2 py-0.5 rounded ${
                          finalPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {overall} — {finalPassed ? 'PASS' : 'FAIL'}
                          {isOverridden && ' (Override)'}
                        </span>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeEntry(i)}>✕</Button>
                  </div>

                  {/* Sub-scores */}
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-3">
                    {SUB_SCORE_FIELDS.map((field) => (
                      <div key={field.key}>
                        <label className="text-xs text-muted-foreground">{field.label}</label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          className="text-center text-sm"
                          value={(entry as unknown as Record<string, string>)[field.key]}
                          onChange={(e) => updateEntry(i, field.key, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Override */}
                  {overall !== null && (
                    <div className="flex items-center gap-3 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`text-xs ${isOverridden ? 'border-amber-400 bg-amber-50 text-amber-800' : ''}`}
                        onClick={() => toggleOverride(i)}
                      >
                        {isOverridden ? '✦ Override Active — Click to Remove' : `Override ${autoPassed ? 'Pass → Fail' : 'Fail → Pass'}`}
                      </Button>
                      {isOverridden && (
                        <Input
                          placeholder="Required: reason for override..."
                          className="flex-1 text-sm"
                          value={entry.override_note}
                          onChange={(e) => {
                            const updated = [...entries];
                            updated[i].override_note = e.target.value;
                            setEntries(updated);
                          }}
                        />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

      <div className="mt-6 flex gap-3">
        <Button
          className="bg-ada-purple hover:bg-ada-purple/90"
          onClick={handleSubmit}
          disabled={loading || entries.length === 0}
        >
          {loading ? 'Saving...' : `Save ${entries.length} Result(s)`}
        </Button>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

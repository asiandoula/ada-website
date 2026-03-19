'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { computeProficiencyLevel } from '@/lib/utils';

interface ExamEntry {
  doula_id: string;
  doula_name: string;
  overall_score: string;
  score_terminology: string;
  score_newborn: string;
  score_lactation: string;
  score_emergency: string;
  score_practical: string;
  score_postpartum: string;
  score_knowledge: string;
  score_ethics: string;
}

const EMPTY_SCORES = {
  overall_score: '',
  score_terminology: '',
  score_newborn: '',
  score_lactation: '',
  score_emergency: '',
  score_practical: '',
  score_postpartum: '',
  score_knowledge: '',
  score_ethics: '',
};

const SCORE_FIELDS = [
  'overall_score',
  'score_terminology',
  'score_newborn',
  'score_lactation',
  'score_emergency',
  'score_practical',
  'score_postpartum',
  'score_knowledge',
  'score_ethics',
] as const;

export default function RecordExamPage() {
  const router = useRouter();
  const supabase = createClient();
  const [doulas, setDoulas] = useState<Record<string, string>[]>([]);
  const [examSession, setExamSession] = useState('');
  const [examDate, setExamDate] = useState('');
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
      { doula_id: doulaId, doula_name: doula.full_name, ...EMPTY_SCORES },
    ]);
  }

  function updateEntry(index: number, field: string, value: string) {
    const updated = [...entries];
    (updated[index] as unknown as Record<string, string>)[field] = value;
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

    setLoading(true);
    setError('');

    const records = entries.map((entry) => {
      const overall = entry.overall_score ? Number(entry.overall_score) : null;
      return {
        doula_id: entry.doula_id,
        exam_session: examSession,
        exam_date: examDate,
        overall_score: overall,
        score_terminology: entry.score_terminology ? Number(entry.score_terminology) : null,
        score_newborn: entry.score_newborn ? Number(entry.score_newborn) : null,
        score_lactation: entry.score_lactation ? Number(entry.score_lactation) : null,
        score_emergency: entry.score_emergency ? Number(entry.score_emergency) : null,
        score_practical: entry.score_practical ? Number(entry.score_practical) : null,
        score_postpartum: entry.score_postpartum ? Number(entry.score_postpartum) : null,
        score_knowledge: entry.score_knowledge ? Number(entry.score_knowledge) : null,
        score_ethics: entry.score_ethics ? Number(entry.score_ethics) : null,
        passed: overall !== null ? overall >= 85 : null,
        proficiency_level: computeProficiencyLevel(overall),
      };
    });

    const { error } = await supabase.from('exam_results').insert(records);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/admin/exams');
    router.refresh();
  }

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Record Exam Results</h1>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Exam Session *</Label>
              <Input
                placeholder="e.g. 25-80301"
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
        <div className="bg-white rounded-lg border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-zinc-50">
              <tr>
                <th className="text-left p-2 font-medium">Doula</th>
                <th className="text-left p-2 font-medium">Overall</th>
                <th className="text-left p-2 font-medium">Term.</th>
                <th className="text-left p-2 font-medium">Newborn</th>
                <th className="text-left p-2 font-medium">Lact.</th>
                <th className="text-left p-2 font-medium">Emerg.</th>
                <th className="text-left p-2 font-medium">Pract.</th>
                <th className="text-left p-2 font-medium">Postpart.</th>
                <th className="text-left p-2 font-medium">Know.</th>
                <th className="text-left p-2 font-medium">Ethics</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={entry.doula_id} className="border-b">
                  <td className="p-2 font-medium whitespace-nowrap">
                    {entry.doula_name}
                  </td>
                  {SCORE_FIELDS.map((field) => (
                    <td key={field} className="p-1">
                      <Input
                        type="number"
                        className="w-16 text-center"
                        value={entry[field]}
                        onChange={(e) => updateEntry(i, field, e.target.value)}
                      />
                    </td>
                  ))}
                  <td className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEntry(i)}
                    >
                      ✕
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

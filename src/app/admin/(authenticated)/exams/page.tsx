'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExamEditDialog, type ExamRecord } from '@/components/admin/exam-edit-dialog';

export default function ExamsPage() {
  const supabase = createClient();
  // Exams include joined doulas data from the query
  const [exams, setExams] = useState<(ExamRecord & { doulas: Record<string, string> | null })[]>([]);

  async function loadExams() {
    const { data } = await supabase
      .from('exam_results')
      .select('*, doulas(full_name, doula_id_code)')
      .order('created_at', { ascending: false })
      .limit(100);
    setExams(data ?? []);
  }

  useEffect(() => {
    loadExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Exam Results</h1>
        <div className="flex gap-2">
          <Link href="/admin/exams/sessions">
            <Button variant="outline">Exam Sessions</Button>
          </Link>
          <Link href="/admin/exams/record">
            <Button className="bg-ada-purple hover:bg-ada-purple/90">
              + Record Exam
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50">
            <tr>
              <th className="text-left p-3 font-medium">Doula</th>
              <th className="text-left p-3 font-medium">Session</th>
              <th className="text-left p-3 font-medium">Date</th>
              <th className="text-left p-3 font-medium">Overall</th>
              <th className="text-left p-3 font-medium">Proficiency</th>
              <th className="text-left p-3 font-medium">Passed</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => {
              const doula = exam.doulas as Record<string, string> | null;
              return (
                <tr key={exam.id} className={`border-b hover:bg-zinc-50 ${exam.voided ? 'opacity-50' : ''}`}>
                  <td className="p-3">
                    <Link
                      href={`/admin/doulas/${exam.doula_id}`}
                      className="text-ada-purple hover:underline"
                    >
                      {doula?.full_name}
                    </Link>
                    <span className="text-xs text-muted-foreground ml-2 font-mono">
                      {doula?.doula_id_code}
                    </span>
                  </td>
                  <td className="p-3 font-mono">{exam.exam_session ?? '—'}</td>
                  <td className="p-3">{exam.exam_date ?? '—'}</td>
                  <td className="p-3">{exam.overall_score ?? '—'}</td>
                  <td className="p-3">{exam.proficiency_level ?? '—'}</td>
                  <td className="p-3">
                    {exam.passed === true ? '✓' : exam.passed === false ? '✗' : '—'}
                  </td>
                  <td className="p-3">
                    {exam.voided ? (
                      <Badge className="bg-gray-100 text-gray-500">Voided</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800">Valid</Badge>
                    )}
                  </td>
                  <td className="p-3">
                    <ExamEditDialog exam={exam} onSaved={loadExams} />
                  </td>
                </tr>
              );
            })}
            {exams.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-muted-foreground">
                  No exam results recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

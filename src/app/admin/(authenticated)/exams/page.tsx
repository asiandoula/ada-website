import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';

export default async function ExamsPage() {
  const supabase = await createClient();

  const { data: exams } = await supabase
    .from('exam_results')
    .select('*, doulas(full_name, doula_id_code)')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Exam Results</h1>
        <Link href="/admin/exams/record">
          <Button className="bg-ada-purple hover:bg-ada-purple/90">
            + Record Exam
          </Button>
        </Link>
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
            </tr>
          </thead>
          <tbody>
            {exams?.map((exam) => {
              const doula = exam.doulas as Record<string, string> | null;
              return (
                <tr key={exam.id} className="border-b hover:bg-zinc-50">
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
                </tr>
              );
            })}
            {(!exams || exams.length === 0) && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
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

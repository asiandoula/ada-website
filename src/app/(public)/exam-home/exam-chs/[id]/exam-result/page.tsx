import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Award, FileCheck, ExternalLink } from 'lucide-react';
import { ScoreBreakdown } from './score-breakdown';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SUBCATEGORIES = [
  { key: 'score_terminology', label: 'Terminology' },
  { key: 'score_newborn', label: 'Newborn Care' },
  { key: 'score_lactation', label: 'Lactation' },
  { key: 'score_emergency', label: 'Emergency' },
  { key: 'score_practical', label: 'Practical Skills' },
  { key: 'score_postpartum', label: 'Postpartum Care' },
  { key: 'score_knowledge', label: 'Knowledge' },
  { key: 'score_ethics', label: 'Ethics' },
] as const;

export default async function ExamResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const examToken = cookieStore.get('exam_token')?.value;

  // Verify cookie matches the URL param
  if (!examToken || examToken !== id) {
    redirect(`/exam-home/exam-chs/${id}`);
  }

  // Fetch doula info
  const { data: doula } = await supabase
    .from('doulas')
    .select('id, full_name, full_name_zh, doula_id_code')
    .eq('doula_id_code', id)
    .single();

  if (!doula) {
    redirect(`/exam-home/exam-chs/${id}`);
  }

  // Fetch exam results (most recent non-voided)
  const { data: examResult } = await supabase
    .from('exam_results')
    .select('overall_score, passed, exam_date, session, exam_type, score_terminology, score_newborn, score_lactation, score_emergency, score_practical, score_postpartum, score_knowledge, score_ethics')
    .eq('doula_id', doula.id)
    .eq('voided', false)
    .order('exam_date', { ascending: false })
    .limit(1)
    .single();

  if (!examResult) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4 py-16">
        <Card className="max-w-md w-full text-center shadow-lg border-0">
          <CardContent className="pt-8 pb-8">
            <FileCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-xl font-poppins font-bold text-ada-navy mb-2">
              No Exam Results Found
            </h1>
            <p className="text-sm text-muted-foreground">
              No exam records were found for this ID. If you recently took an exam,
              results may still be processing.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch certificate if passed
  let certificateCode: string | null = null;
  if (examResult.passed) {
    const { data: cert } = await supabase
      .from('certificates')
      .select('verification_code')
      .eq('doula_id', doula.id)
      .eq('status', 'active')
      .eq('credential_type', examResult.exam_type || 'postpartum')
      .limit(1)
      .single();

    if (cert) {
      certificateCode = cert.verification_code;
    }
  }

  const passed = examResult.passed;
  const overallScore = Number(examResult.overall_score);

  const scores = SUBCATEGORIES.map((cat) => ({
    label: cat.label,
    score: Number(examResult[cat.key]) || 0,
  }));

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-white to-gray-50 px-4 py-16">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Card */}
        <Card className="shadow-lg border-0 overflow-hidden">
          <div
            className={`h-2 ${passed ? 'bg-green-500' : 'bg-red-500'}`}
          />
          <CardContent className="pt-6 pb-6 px-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/ada-logo.svg"
                  alt="ADA"
                  className="h-10 mb-3"
                />
                <h1 className="text-xl font-poppins font-bold text-ada-navy">
                  Exam Results
                </h1>
              </div>
              <Badge
                className={`text-sm px-4 py-1.5 ${
                  passed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {passed ? 'PASSED' : 'NOT PASSED'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block">Name</span>
                <span className="font-medium">
                  {doula.full_name}
                  {doula.full_name_zh && ` (${doula.full_name_zh})`}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Exam ID</span>
                <span className="font-mono font-medium">{doula.doula_id_code}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Exam Date</span>
                <span className="font-medium">
                  {examResult.exam_date
                    ? new Date(examResult.exam_date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Session</span>
                <span className="font-medium">{examResult.session || 'N/A'}</span>
              </div>
            </div>

            {/* Overall Score */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Overall Score
                </span>
                <span
                  className={`text-3xl font-poppins font-bold ${
                    passed ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {overallScore}
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    passed ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(overallScore, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Passing score: 70
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown Card (client component for animation) */}
        <ScoreBreakdown scores={scores} />

        {/* Certificate Link */}
        {passed && certificateCode && (
          <Card className="shadow-lg border-0">
            <CardContent className="py-6 px-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-ada-purple/10 flex items-center justify-center shrink-0">
                  <Award className="h-6 w-6 text-ada-purple" />
                </div>
                <div className="flex-1">
                  <h3 className="font-poppins font-semibold text-ada-navy">
                    Certificate Available
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your certification has been issued and can be verified online.
                  </p>
                </div>
                <Link
                  href={`/verify/${certificateCode}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-ada-purple hover:text-ada-purple/80 transition-colors"
                >
                  View Certificate
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Asian Doula Alliance — asiandoula.org
        </p>
      </div>
    </div>
  );
}

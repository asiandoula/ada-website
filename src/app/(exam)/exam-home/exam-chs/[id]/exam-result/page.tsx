import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { getTranslations } from 'next-intl/server';
import { ResultView } from './result-view';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('examHome.result');
  return {
    title: t('metaTitle'),
    robots: { index: false, follow: false },
  };
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export default async function ExamResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = getSupabase();
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
    const t = await getTranslations('examHome.result');
    return (
      <div className="ada2-wrap pt-12 pb-20">
        <div className="max-w-[760px] flex flex-col gap-4">
          <h1 className="m-0 text-[clamp(40px,3.9vw,56px)] leading-[1.15] font-light text-ada2-ink [text-wrap:balance]">
            {t('noneTitle')}
          </h1>
          <p className="m-0 text-[22px] leading-[31px] font-light text-ada2-body [text-wrap:pretty]">{t('noneBody')}</p>
        </div>
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
      .eq('certificate_type', examResult.exam_type || 'postpartum')
      .limit(1)
      .single();

    if (cert) {
      certificateCode = cert.verification_code;
    }
  }

  return <ResultView doula={doula} examResult={examResult} certificateCode={certificateCode} />;
}

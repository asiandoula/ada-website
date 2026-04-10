import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getExamContent, type ExamLang } from '@/lib/exam-content';

const VALID_LANGS: ExamLang[] = ['en', 'zh-cn', 'zh-tw', 'ja', 'ko'];

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ session?: string }>;
}

export default async function ExamLangPage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  const { session } = await searchParams;

  if (!VALID_LANGS.includes(lang as ExamLang)) {
    notFound();
  }

  const content = getExamContent(lang as ExamLang);

  const sessionQuery = session ? `?session=${session}` : '';

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {/* Branding */}
      <div className="flex flex-col items-center gap-1 mb-6">
        <h1 className="font-outfit font-medium text-3xl tracking-[0.08em] text-ada-purple">
          ASIANDOULA
        </h1>
        <p className="font-outfit font-medium text-sm tracking-[0.19em] text-ada-purple">
          {content.ui.committee}
        </p>
      </div>

      {/* Exam title */}
      <div className="flex flex-col items-center gap-1 mb-10">
        <h2 className="text-2xl font-medium text-zinc-800">
          {content.ui.examTitle}
        </h2>
        <p className="text-sm text-zinc-400">{content.ui.organizedBy}</p>
      </div>

      {/* Part selector cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
        <Link href={`/exam-home/${lang}/written${sessionQuery}`}>
          <div className="rounded-2xl border border-gray-200 p-8 hover:shadow-lg hover:border-ada-purple transition-all cursor-pointer flex flex-col items-center gap-2 text-center">
            <p className="text-sm font-medium text-ada-purple tracking-wide">
              {content.ui.part1}
            </p>
            <p className="text-xl font-semibold text-zinc-800">
              {content.ui.writtenExam}
            </p>
          </div>
        </Link>

        <Link href={`/exam-home/${lang}/practical${sessionQuery}`}>
          <div className="rounded-2xl border border-gray-200 p-8 hover:shadow-lg hover:border-ada-purple transition-all cursor-pointer flex flex-col items-center gap-2 text-center">
            <p className="text-sm font-medium text-ada-purple tracking-wide">
              {content.ui.part2}
            </p>
            <p className="text-xl font-semibold text-zinc-800">
              {content.ui.practicalExam}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

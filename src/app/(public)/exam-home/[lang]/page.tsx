import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getExamContent, type ExamLang } from '@/lib/exam-content';
import { FileText, Stethoscope } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ada-purple/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-ada-purple" />
            <span className="font-outfit text-xs font-semibold tracking-[0.15em] uppercase text-ada-purple">
              {content.ui.committee}
            </span>
          </div>

          <h1 className="font-dm-serif text-4xl text-ada-navy leading-tight">
            {content.ui.examTitle}
          </h1>
          <p className="font-outfit text-sm text-zinc-400 mt-3">
            {content.ui.organizedBy}
          </p>
        </div>

        {/* Part selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link
            href={`/exam-home/${lang}/written${sessionQuery}`}
            className="group relative rounded-2xl border border-zinc-200 p-8 hover:border-ada-purple hover:shadow-lg transition-all flex flex-col items-center text-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-ada-purple/5 flex items-center justify-center group-hover:bg-ada-purple/10 transition-colors">
              <FileText className="w-7 h-7 text-ada-purple" />
            </div>
            <div>
              <p className="font-outfit text-xs font-semibold tracking-[0.12em] uppercase text-ada-purple mb-1">
                {content.ui.part1}
              </p>
              <p className="font-dm-serif text-2xl text-ada-navy">
                {content.ui.writtenExam}
              </p>
            </div>
            <span className="font-outfit text-sm text-zinc-400 group-hover:text-ada-purple transition-colors">
              60 min →
            </span>
          </Link>

          <Link
            href={`/exam-home/${lang}/practical${sessionQuery}`}
            className="group relative rounded-2xl border border-zinc-200 p-8 hover:border-ada-purple hover:shadow-lg transition-all flex flex-col items-center text-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-ada-purple/5 flex items-center justify-center group-hover:bg-ada-purple/10 transition-colors">
              <Stethoscope className="w-7 h-7 text-ada-purple" />
            </div>
            <div>
              <p className="font-outfit text-xs font-semibold tracking-[0.12em] uppercase text-ada-purple mb-1">
                {content.ui.part2}
              </p>
              <p className="font-dm-serif text-2xl text-ada-navy">
                {content.ui.practicalExam}
              </p>
            </div>
            <span className="font-outfit text-sm text-zinc-400 group-hover:text-ada-purple transition-colors">
              9 modules →
            </span>
          </Link>
        </div>

        {/* Back link */}
        <div className="text-center mt-10">
          <Link
            href={`/exam-home${sessionQuery}`}
            className="font-outfit text-sm text-zinc-400 hover:text-ada-purple transition-colors"
          >
            ← Change language
          </Link>
        </div>
      </div>
    </div>
  );
}

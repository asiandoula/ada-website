import Link from 'next/link';
import { EXAM_LANGS } from '@/lib/exam-content';

interface PageProps {
  searchParams: Promise<{ session?: string }>;
}

export default async function ExamHomePage({ searchParams }: PageProps) {
  const { session } = await searchParams;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      {/* Card container */}
      <div className="w-full max-w-lg">
        {/* Header section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ada-purple/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-ada-purple" />
            <span className="font-outfit text-xs font-semibold tracking-[0.15em] uppercase text-ada-purple">
              Examination Committee
            </span>
          </div>

          <h1 className="font-dm-serif text-4xl text-ada-navy leading-tight">
            Certified Postpartum
            <br />
            Doula Examination
          </h1>
          <p className="font-outfit text-xl text-ada-purple/60 mt-3">
            产后导乐国际认证考试
          </p>
          <p className="font-outfit text-sm text-zinc-400 mt-2">
            Organized by the Asian Doula Alliance Certification Board
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-zinc-200" />
          <span className="font-outfit text-xs font-semibold tracking-[0.1em] uppercase text-zinc-400">
            Select Language
          </span>
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        {/* Language buttons */}
        <div className="grid grid-cols-1 gap-2.5">
          {EXAM_LANGS.map((lang) => {
            const href = session
              ? `/exam-home/${lang.code}?session=${session}`
              : `/exam-home/${lang.code}`;
            return (
              <Link
                key={lang.code}
                href={href}
                className="group flex items-center justify-between rounded-xl border border-zinc-200 px-6 py-4 hover:border-ada-purple hover:bg-ada-purple/[0.03] transition-all"
              >
                <span className="font-outfit font-medium text-lg text-zinc-700 group-hover:text-ada-purple transition-colors">
                  {lang.nativeLabel}
                </span>
                <span className="font-outfit text-sm text-zinc-400 group-hover:text-ada-purple/60 transition-colors">
                  {lang.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

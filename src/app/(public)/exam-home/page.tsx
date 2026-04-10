import Link from 'next/link';
import { EXAM_LANGS } from '@/lib/exam-content';

interface PageProps {
  searchParams: Promise<{ session?: string }>;
}

export default async function ExamHomePage({ searchParams }: PageProps) {
  const { session } = await searchParams;

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center flex flex-col items-center gap-6">
      {/* Branding */}
      <div className="flex flex-col items-center gap-1">
        <h1 className="font-outfit font-medium text-3xl tracking-[0.08em] text-ada-purple">
          ASIANDOULA
        </h1>
        <p className="font-outfit font-medium text-sm tracking-[0.19em] text-ada-purple">
          Examination Committee
        </p>
      </div>

      {/* Main heading */}
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-2xl font-medium text-zinc-800">
          Certified Postpartum Doula Examination
        </h2>
        <p className="text-lg text-zinc-500">产后导乐国际认证考试</p>
        <p className="text-sm text-zinc-400">
          Organized by the Asian Doula Alliance Certification Board
        </p>
      </div>

      {/* Language selector */}
      <div className="flex flex-col items-center gap-4 w-full">
        <p className="text-lg text-ada-purple">🌐 Please Select Exam Language:</p>
        <div className="flex flex-col gap-3 w-full">
          {EXAM_LANGS.map((lang) => {
            const href = session
              ? `/exam-home/${lang.code}?session=${session}`
              : `/exam-home/${lang.code}`;
            return (
              <Link
                key={lang.code}
                href={href}
                className="rounded-lg border border-gray-200 px-6 py-3 text-center hover:bg-zinc-50 hover:border-ada-purple transition"
              >
                {lang.nativeLabel}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

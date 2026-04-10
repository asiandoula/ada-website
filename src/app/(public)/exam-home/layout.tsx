import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exam',
  robots: { index: false, follow: false },
};

export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="py-6 flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/ada-logo.svg" alt="Asian Doula Alliance" className="h-10" />
      </header>
      <main className="flex-1">{children}</main>
      <footer className="py-4 text-center text-xs text-zinc-400">
        © 2025 Asian Doula Alliance | All rights reserved.
      </footer>
    </div>
  );
}

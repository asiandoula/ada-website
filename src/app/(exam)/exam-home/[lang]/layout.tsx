import type { ReactNode } from 'react';
import { ExamCopyProvider } from '@/components/exam/exam-copy';
import { examLocale, loadExamMessages } from '../_lib/exam-copy';

/**
 * Provides the exam-language copy to the client exam screens (written,
 * practical). Invalid languages are left to each page, as before.
 */
export default async function ExamLangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = examLocale(lang);
  const { own, en } = await loadExamMessages(locale);
  return (
    <ExamCopyProvider lang={locale} messages={own} enMessages={en}>
      {children}
    </ExamCopyProvider>
  );
}

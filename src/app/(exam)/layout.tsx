/**
 * Exam-day app (/exam-home/**). Route group without the public site header and
 * footer: the exam screens bring their own minimal chrome (exam-home/layout.tsx),
 * so a stray tap cannot leave a running exam. URLs are unchanged.
 */
export default function ExamGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

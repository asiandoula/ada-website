'use client';

import { ScoreTable, type ScoreTableProps } from '@/components/exam/score-table';

/** "Your scores by area" section of the exam result (canvas ExamResult). */
export function ScoreBreakdown({
  title,
  lead,
  ...table
}: ScoreTableProps & { title: string; lead: string }) {
  return (
    <section aria-labelledby="areas-title" className="flex flex-col gap-4">
      <h2 id="areas-title" className="m-0 text-[36px] leading-[44px] font-light text-ada2-ink [text-wrap:balance]">
        {title}
      </h2>
      <p className="m-0 text-ada2-body [text-wrap:pretty]">{lead}</p>
      <ScoreTable {...table} />
    </section>
  );
}

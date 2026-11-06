'use client';

/**
 * "Your scores by area" (canvas ExamResult): a dark-header table, one row per
 * area, a bar against the pass mark (the tick), and an optional Overall row.
 * Used by the exam result page and the My ADA exam results. All copy is passed
 * in already translated; numbers come from the record and from facts.ts.
 */
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface ScoreRow {
  key: string;
  label: string;
  score: number;
}

export interface ScoreTableProps {
  caption: string;
  colArea: string;
  colScore: string;
  colAgainst: string;
  rows: ScoreRow[];
  /** Pass mark and maximum (EXAM.passScore, EXAM.maxScore). */
  pass: number;
  max: number;
  /** "70 or above" / "Below 70". */
  atOrAbove: string;
  below: string;
  overall?: { label: string; score: number; text: string };
  /** Grow the bars after mount. Default true. */
  animate?: boolean;
  className?: string;
}

function pct(score: number, max: number) {
  return Math.max(0, Math.min(100, (score / max) * 100));
}

export function ScoreTable({
  caption,
  colArea,
  colScore,
  colAgainst,
  rows,
  pass,
  max,
  atOrAbove,
  below,
  overall,
  animate = true,
  className,
}: ScoreTableProps) {
  const [visible, setVisible] = useState(!animate);

  useEffect(() => {
    if (!animate) return;
    // Trigger animation after mount
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, [animate]);

  const passPct = pct(pass, max);

  return (
    <div className={cn('border border-ada2-hairline', className)}>
      <table className="w-full border-collapse bg-white text-[16px] leading-[22px] [font-variant-numeric:tabular-nums_lining-nums]">
        <caption className="ada2-sr">{caption}</caption>
        <thead>
          <tr className="bg-ada2-table-head text-white">
            <th scope="col" className="text-left align-bottom py-3 px-4 text-[14px] leading-[18px] font-semibold">
              {colArea}
            </th>
            <th scope="col" className="text-right align-bottom py-3 px-4 text-[14px] leading-[18px] font-semibold whitespace-nowrap">
              {colScore}
            </th>
            <th scope="col" className="text-left align-bottom py-3 px-4 text-[14px] leading-[18px] font-semibold">
              {colAgainst}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const ok = row.score >= pass;
            return (
              <tr key={row.key} className="border-b border-ada2-hairline">
                <th scope="row" className="text-left py-3 px-4 font-semibold text-ada2-ink">
                  {row.label}
                </th>
                <td className="text-right py-3 px-4 text-[20px] leading-7 font-semibold text-ada2-ink">{row.score}</td>
                <td className="py-3 px-4 w-[55%]">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div aria-hidden="true" className="relative flex-[1_1_120px] min-w-[96px] h-2.5 bg-ada2-band-rule">
                      <div
                        className="absolute inset-y-0 left-0 bg-ada2-ink transition-[width] duration-1000 ease-out motion-reduce:transition-none"
                        style={{
                          width: visible ? `${pct(row.score, max)}%` : '0%',
                          transitionDelay: `${index * 80 + 200}ms`,
                        }}
                      />
                      <span className="absolute -top-1.5 -bottom-1.5 w-0.5 bg-ada2-ink" style={{ left: `${passPct}%` }} />
                    </div>
                    <span className={cn('flex-none w-[7.5rem] text-[15px] leading-5 whitespace-nowrap', ok ? 'text-ada2-body' : 'font-semibold text-ada2-ink')}>
                      {ok ? atOrAbove : below}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
          {overall ? (
            <tr className="bg-ada2-band border-t-2 border-ada2-ink">
              <th scope="row" className="text-left py-3.5 px-4 font-bold text-ada2-ink">
                {overall.label}
              </th>
              <td className="text-right py-3.5 px-4 text-[20px] leading-7 font-bold text-ada2-ink">{overall.score}</td>
              <td className="py-3.5 px-4 font-semibold text-ada2-ink">{overall.text}</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

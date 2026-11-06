/**
 * Exam-day building blocks (canvas ExamWritten / ExamPractical). Large type,
 * 56px targets. Server-compatible (no hooks).
 */
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ExamButtonVariant = 'primary' | 'secondary' | 'pass' | 'fail';

const VARIANT: Record<ExamButtonVariant, { idle: string; pressed: string }> = {
  primary: {
    idle: 'bg-ada2-indigo border-ada2-indigo text-white hover:bg-ada2-indigo-hover hover:border-ada2-indigo-hover',
    pressed: 'bg-ada2-indigo border-ada2-indigo text-white',
  },
  secondary: {
    idle: 'bg-white border-ada2-ink text-ada2-ink hover:bg-ada2-band-rule',
    pressed: 'bg-ada2-ink border-ada2-ink text-white',
  },
  pass: {
    idle: 'bg-white border-ada2-good text-ada2-good-text hover:bg-ada2-good-bg',
    pressed: 'bg-ada2-good border-ada2-good text-white',
  },
  fail: {
    idle: 'bg-white border-ada2-suspended text-ada2-suspended hover:bg-[#FBEAE8]',
    pressed: 'bg-ada2-suspended border-ada2-suspended text-white',
  },
};

/** A 56px pill (64px with size="lg"). `pressed` switches to the filled state (toggles). */
export function examButtonClass(
  variant: ExamButtonVariant = 'secondary',
  { pressed = false, size = 'md', className }: { pressed?: boolean; size?: 'md' | 'lg'; className?: string } = {}
) {
  return cn(
    'inline-flex items-center justify-center gap-2.5 box-border rounded-full border-[1.5px] border-solid',
    'font-semibold whitespace-nowrap cursor-pointer no-underline transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-40',
    size === 'md' ? 'min-h-[56px] px-7 text-[18px] leading-6' : 'min-h-[64px] px-10 text-[22px] leading-7',
    pressed ? VARIANT[variant].pressed : VARIANT[variant].idle,
    className
  );
}

/**
 * The grey band under the exam header: the part title (exam language, then
 * English) on the left, timer or controls on the right.
 */
export function ExamBand({ title, sub, right }: { title: ReactNode; sub?: ReactNode; right?: ReactNode }) {
  return (
    <div className="bg-ada2-band border-b border-ada2-hairline">
      <div className="ada2-wrap py-5 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <div className="min-w-0 flex flex-col gap-1">
          <h1 className="m-0 text-[clamp(30px,3vw,40px)] leading-[1.2] font-light text-ada2-ink [text-wrap:balance]">
            {title}
          </h1>
          {sub ? <p className="m-0 text-[16px] leading-[22px] text-ada2-body">{sub}</p> : null}
        </div>
        {right ? <div className="flex flex-wrap items-center gap-3">{right}</div> : null}
      </div>
    </div>
  );
}

/** Section heading on exam screens: 28/35 light, exam language then English. */
export function ExamH2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className="m-0 text-[28px] leading-[35px] font-light text-ada2-ink [text-wrap:balance]">
      {children}
    </h2>
  );
}

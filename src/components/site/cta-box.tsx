/**
 * KIT:CTA. One per inner page, in the right rail: indigo, one sentence, one
 * white pill, no icon. Put it in a flex-wrap row beside the main column
 * (main: flex 999 1 640px; the box is flex 1 1 300px, max 380px).
 */
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Pill } from './pill';
import { PageTag } from './status-tag';

export interface CtaBoxProps {
  /** One sentence. */
  title: ReactNode;
  action: { href: string; label: ReactNode; 'aria-label'?: string };
  /** Optional on-indigo page tag under the sentence (only for an unconfirmed fact). */
  tag?: ReactNode;
  /** Heading id. Default "cta-title". */
  id?: string;
  className?: string;
}

export function CtaBox({ title, action, tag, id = 'cta-title', className }: CtaBoxProps) {
  return (
    <aside
      aria-labelledby={id}
      className={cn(
        'flex-[1_1_300px] max-w-[380px] min-w-0 box-border py-9 px-8 bg-ada2-indigo text-white flex flex-col items-start gap-[18px]',
        className
      )}
    >
      <h2 id={id} className="m-0 text-[28px] leading-[35px] font-light text-white [text-wrap:balance]">
        {title}
      </h2>
      {tag ? <PageTag onIndigo>{tag}</PageTag> : null}
      <Pill href={action.href} variant="onIndigo" aria-label={action['aria-label']}>
        {action.label}
      </Pill>
    </aside>
  );
}

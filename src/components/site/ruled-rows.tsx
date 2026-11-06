/**
 * KIT:RULED-ROWS. Label/value rows under a 2px ink rule, beside a real photo.
 * Use instead of icon-in-circle feature blocks. Every row must say something
 * different. `ordered` turns the rows into a numbered list of steps (write the
 * fee and dates inline in the value).
 */
import Image from 'next/image';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArrowLink } from './pill';

export interface RuledRow {
  label: ReactNode;
  value: ReactNode;
}

export interface RuledRowsProps {
  title?: ReactNode;
  /** Heading id (aria-labelledby). Default "rr-title". */
  id?: string;
  rows: RuledRow[];
  /** Render as an ordered list of steps instead of a definition list. */
  ordered?: boolean;
  /** A real photo beside the rows. Captions carry the date, e.g. "August 2024". */
  image?: { src: string; alt: string; caption?: ReactNode };
  /** A standalone → link under the rows. */
  link?: { href: string; label: ReactNode; tone?: 'ink' | 'registry' };
  /** Width of the label column. Default 160px. */
  labelWidth?: number;
  className?: string;
}

export function RuledRows({ title, id = 'rr-title', rows, ordered = false, image, link, labelWidth = 160, className }: RuledRowsProps) {
  const rowClass = 'flex flex-wrap gap-x-6 gap-y-0.5 py-3 border-b border-ada2-hairline';
  const labelStyle = { flex: `0 0 ${labelWidth}px` };
  const labelClass = 'font-semibold text-ada2-ink';
  const valueClass = 'flex-[1_1_300px] min-w-0 m-0 [text-wrap:pretty]';

  const list = ordered ? (
    <ol className="flex flex-col border-t-2 border-ada2-ink">
      {rows.map((r, i) => (
        <li key={i} className={rowClass}>
          <span className={labelClass} style={labelStyle}>{r.label}</span>
          <div className={valueClass}>{r.value}</div>
        </li>
      ))}
    </ol>
  ) : (
    <dl className="m-0 flex flex-col border-t-2 border-ada2-ink">
      {rows.map((r, i) => (
        <div key={i} className={rowClass}>
          <dt className={labelClass} style={labelStyle}>{r.label}</dt>
          <dd className={valueClass}>{r.value}</dd>
        </div>
      ))}
    </dl>
  );

  return (
    <section aria-labelledby={title ? id : undefined} className={cn('bg-white', className)}>
      <div className="ada2-wrap flex flex-wrap items-start gap-x-16 gap-y-8">
        {image && (
          <figure className="flex-[1_1_440px] min-w-0 m-0 flex flex-col gap-2.5">
            <Image
              src={image.src}
              alt={image.alt}
              width={1600}
              height={1067}
              sizes="(min-width: 1120px) 45vw, 100vw"
              className="block w-full h-auto aspect-[3/2] object-cover"
            />
            {image.caption ? <figcaption className="text-[14px] leading-5 text-ada2-muted">{image.caption}</figcaption> : null}
          </figure>
        )}
        <div className="flex-[1_1_560px] min-w-0 flex flex-col gap-5">
          {title ? (
            <h2 id={id} className="m-0 text-[28px] leading-[34px] sm:text-[36px] sm:leading-[44px] font-light text-ada2-ink [text-wrap:balance]">
              {title}
            </h2>
          ) : null}
          {list}
          {link ? (
            <ArrowLink href={link.href} tone={link.tone} className="self-start">
              {link.label}
            </ArrowLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}

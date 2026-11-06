/**
 * Layout blocks shared by the /certifications pages, copied from the canvas
 * boards (Certifications, PostpartumB, PostpartumCredential, BirthDoula,
 * IBCLC). They compose the site kit (src/components/site) and add only what
 * the kit does not have: the photo-beside-content section, numbered steps,
 * label/value rows, topic grids, plain dark-header tables and the FAQ list.
 * Server components; the FAQ uses <details> so it works without JavaScript.
 */
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowIcon } from '@/components/site/icons';
import { inlineLinkClassName } from '@/components/site/pill';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Type
// ---------------------------------------------------------------------------

export const h2Class = 'm-0 text-[36px] leading-[44px] font-light text-ada2-ink [text-wrap:balance]';
export const h3Class = 'm-0 mt-7 text-[24px] leading-[30px] font-normal text-ada2-ink [text-wrap:balance]';
export const noteClass = 'm-0 text-[14px] leading-[21px] text-ada2-muted [text-wrap:pretty]';

/** <b> in messages: 600 ink, as on the boards. */
export function B(chunks: ReactNode) {
  return <strong className="font-semibold text-ada2-ink">{chunks}</strong>;
}

/** <d> in messages: a bold date that never breaks across lines. */
export function D(chunks: ReactNode) {
  return <strong className="font-semibold text-ada2-ink whitespace-nowrap">{chunks}</strong>;
}

/** <nw> in messages: keep a CJK phrase on one line (headings break mid-word otherwise). */
export function NW(chunks: ReactNode) {
  return <span className="whitespace-nowrap">{chunks}</span>;
}

/** A standalone → link set inside running text (board: inline-flex, 44px target, -10px margin). */
export function InlineArrow({
  href,
  children,
  tone = 'ink',
  external = false,
}: {
  href: string;
  children: ReactNode;
  tone?: 'ink' | 'registry';
  external?: boolean;
}) {
  const cls = cn(
    'inline-flex items-center gap-1.5 min-h-[44px] align-middle -my-2.5 font-semibold no-underline whitespace-nowrap',
    tone === 'ink' ? 'text-ada2-ink hover:text-black' : 'text-ada2-blossom hover:text-ada2-blossom-hover'
  );
  const inner = (
    <>
      {children}
      <ArrowIcon size={16} className="flex-none" />
    </>
  );
  return external ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/** Underlined ink link inside running text. */
export function InlineLink({ href, children, external = false }: { href: string; children: ReactNode; external?: boolean }) {
  if (external) {
    return (
      <a href={href} className={inlineLinkClassName} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
    return (
      <a href={href} className={`${inlineLinkClassName} [overflow-wrap:anywhere]`}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={inlineLinkClassName}>
      {children}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Photos
// ---------------------------------------------------------------------------

export interface PhotoProps {
  src: string;
  alt: string;
  caption: ReactNode;
  /** CSS aspect-ratio. Default "3 / 2". */
  ratio?: string;
  position?: string;
  className?: string;
}

export function Photo({ src, alt, caption, ratio = '3 / 2', position, className }: PhotoProps) {
  return (
    <figure className={cn('m-0 flex flex-col gap-2.5', className)}>
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1067}
        sizes="(min-width: 1120px) 45vw, 100vw"
        className="block w-full h-auto object-cover"
        style={{ aspectRatio: ratio, objectPosition: position }}
      />
      <figcaption className="text-[14px] leading-5 text-ada2-muted">{caption}</figcaption>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

/**
 * Photo-beside-content section (boards: "How to get certified", "What's on the exam"…).
 * Left: H2, intro and an optional photo (flex 2 1 400px). Right: the content (flex 3 1 560px).
 */
export function SplitSection({
  id,
  title,
  intro,
  photo,
  aside,
  children,
  first = false,
}: {
  id: string;
  title: ReactNode;
  intro?: ReactNode;
  photo?: PhotoProps;
  /** Extra content under the intro in the left column (links, a pill). */
  aside?: ReactNode;
  children: ReactNode;
  /** First section under the hero: 80px top padding instead of 96px. */
  first?: boolean;
}) {
  return (
    <section aria-labelledby={id} className={cn('bg-white', first ? 'pt-20' : 'pt-24')}>
      <div className="ada2-wrap flex flex-wrap items-start gap-x-16 gap-y-8">
        <div className="flex-[2_1_400px] min-w-0 flex flex-col gap-5">
          <h2 id={id} className={h2Class}>
            {title}
          </h2>
          {intro ? <p className="m-0 text-ada2-body [text-wrap:pretty]">{intro}</p> : null}
          {aside}
          {photo ? <Photo {...photo} className="mt-2" /> : null}
        </div>
        <div className="flex-[3_1_560px] min-w-0 flex flex-col gap-4">{children}</div>
      </div>
    </section>
  );
}

/** Main column + right-rail CTA box (boards: fees, compare, IBCLC requirements). */
export function RailSection({
  id,
  main,
  rail,
  first = false,
}: {
  id: string;
  main: ReactNode;
  rail: ReactNode;
  first?: boolean;
}) {
  return (
    <section aria-labelledby={id} className={cn('bg-white', first ? 'pt-20' : 'pt-24')}>
      <div className="ada2-wrap flex flex-wrap items-start gap-x-12 gap-y-10">
        <div className="flex-[999_1_640px] min-w-0 flex flex-col gap-4">{main}</div>
        {rail}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Lists
// ---------------------------------------------------------------------------

export interface Step {
  title: ReactNode;
  body: ReactNode;
}

/** Numbered ruled steps: a light number, a 19/28 heading and the body. */
export function StepList({ steps, labelledBy, className }: { steps: Step[]; labelledBy?: string; className?: string }) {
  // role="list": Safari drops list semantics when list-style is none.
  return (
    <ol role="list" aria-labelledby={labelledBy} className={cn('m-0 p-0 list-none flex flex-col border-t-2 border-ada2-ink', className)}>
      {steps.map((s, i) => (
        <li key={i} className="flex gap-5 pt-4 pb-[18px] border-b border-ada2-hairline">
          <span
            aria-hidden="true"
            className="flex-none w-6 text-[22px] leading-7 font-light text-ada2-ink [font-variant-numeric:tabular-nums_lining-nums]"
          >
            {i + 1}
          </span>
          <div className="flex-[1_1_auto] min-w-0 flex flex-col gap-1">
            <h3 className="m-0 text-[19px] leading-7 font-semibold text-ada2-ink [text-wrap:balance]">{s.title}</h3>
            <p className="m-0 text-ada2-body [text-wrap:pretty]">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export interface Row {
  label: ReactNode;
  value: ReactNode;
  /** A small grey line under the label. */
  sub?: ReactNode;
}

/** Label/value rows under a 2px ink rule. */
export function Rows({ rows, labelWidth = 200, className }: { rows: Row[]; labelWidth?: number; className?: string }) {
  return (
    <dl className={cn('m-0 flex flex-col border-t-2 border-ada2-ink', className)}>
      {rows.map((r, i) => (
        <div key={i} className="flex flex-wrap gap-x-6 gap-y-0.5 py-3 border-b border-ada2-hairline">
          <dt className="font-semibold text-ada2-ink [overflow-wrap:anywhere]" style={{ flex: `0 1 ${labelWidth}px` }}>
            {r.label}
            {r.sub ? <span className="block text-[14px] leading-5 font-normal text-ada2-muted">{r.sub}</span> : null}
          </dt>
          <dd className="flex-[1_1_300px] min-w-0 m-0 [text-wrap:pretty]">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Two-column grid of short topic names under a 2px ink rule. */
export function TopicGrid({ items, label }: { items: ReactNode[]; label: string }) {
  return (
    <ul
      role="list"
      aria-label={label}
      className="m-0 p-0 list-none grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-x-8 border-t-2 border-ada2-ink"
    >
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-center min-h-[56px] box-border py-3 border-b border-ada2-hairline text-ada2-ink font-semibold [text-wrap:pretty]"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Notes({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-1', className)}>{children}</div>;
}

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------

export const thCol = 'text-left align-bottom py-3 px-4 text-[14px] leading-[18px] font-semibold';
export const thRow = 'text-left align-top py-2.5 px-4 font-bold text-ada2-ink';
export const td = 'align-top py-2.5 px-4 [text-wrap:pretty]';

/**
 * A dark-header table in a bordered box. On narrow screens the box scrolls
 * sideways (it is focusable so keyboard users can scroll it); the page never does.
 */
export function DataTable({
  caption,
  minWidth = 600,
  children,
  className,
}: {
  caption: string;
  minWidth?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="region"
      aria-label={caption}
      tabIndex={0}
      className="relative overflow-x-auto border border-ada2-hairline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ada2-blossom"
    >
      <table
        className={cn(
          'w-full border-collapse bg-white text-[16px] leading-[22px] [font-variant-numeric:tabular-nums_lining-nums]',
          '[&>tbody>tr:not(:last-child)>*]:border-b [&>tbody>tr:not(:last-child)>*]:border-ada2-hairline',
          className
        )}
        style={{ minWidth }}
      >
        <caption className="ada2-sr">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="bg-ada2-table-head text-white">{children}</tr>
    </thead>
  );
}

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

export interface QA {
  q: ReactNode;
  a: ReactNode;
}

function Chevron() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
      focusable="false"
      className="flex-none transition-transform group-open:rotate-180"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/**
 * Board "Questions" section: H2 and the "write to us" line on the left, the
 * questions as disclosure rows on the right. The first one starts open.
 */
export function FaqSection({
  id = 'faq-title',
  title,
  note,
  items,
}: {
  id?: string;
  title: ReactNode;
  note: ReactNode;
  items: QA[];
}) {
  return (
    <section aria-labelledby={id} className="bg-white pt-24 pb-[104px]">
      <div className="ada2-wrap flex flex-wrap items-start gap-x-16 gap-y-6">
        <div className="flex-[1_1_280px] min-w-0 flex flex-col gap-3">
          <h2 id={id} className={h2Class}>
            {title}
          </h2>
          <p className="m-0 text-[16px] leading-[25px] text-ada2-muted [text-wrap:pretty]">{note}</p>
        </div>
        <div className="flex-[999_1_560px] min-w-0 border-t-2 border-ada2-ink">
          {items.map((item, i) => (
            <details key={i} open={i === 0} className="group border-b border-ada2-hairline">
              <summary className="flex w-full items-center justify-between gap-6 min-h-[68px] box-border py-4 pr-1 cursor-pointer list-none text-ada2-ink [&::-webkit-details-marker]:hidden hover:bg-ada2-band">
                <h3 className="m-0 text-[20px] leading-7 font-normal text-ada2-ink [text-wrap:pretty]">{item.q}</h3>
                <Chevron />
              </summary>
              <div className="pb-[22px] sm:pr-14">
                <p className="m-0 max-w-[720px] text-ada2-body [text-wrap:pretty]">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Questions as a plain ruled list (handbook). */
export function QuestionList({ items }: { items: QA[] }) {
  return (
    <div className="flex flex-col border-t-2 border-ada2-ink">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col gap-1 pt-4 pb-[18px] border-b border-ada2-hairline">
          <h3 className="m-0 text-[19px] leading-7 font-semibold text-ada2-ink [text-wrap:balance]">{item.q}</h3>
          <p className="m-0 text-ada2-body [text-wrap:pretty]">{item.a}</p>
        </div>
      ))}
    </div>
  );
}

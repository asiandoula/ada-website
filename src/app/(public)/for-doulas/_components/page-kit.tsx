/**
 * Page parts for the inner pages in /programs and /for-doulas (Education,
 * Scholarship, Standards, Renew), copied from those KitC boards. Server
 * compatible. Shared site components (Hero, Tiles, RuledRows, CtaBox…) come
 * from @/components/site; these are the pieces that sit inside a page column.
 */
import Image from 'next/image';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Type and table classes (KitC)
// ---------------------------------------------------------------------------

export const h2Class = 'm-0 text-[36px] leading-[44px] font-light text-ada2-ink [text-wrap:balance]';
export const h3Class = 'm-0 text-[24px] leading-[30px] font-normal text-ada2-ink [text-wrap:balance]';
export const bodyClass = 'm-0 text-ada2-body [text-wrap:pretty]';
export const strongClass = 'font-semibold text-ada2-ink';
/** Inline email/phone/record links inside running text: ink, underlined. */
export const inlineLink = 'text-ada2-ink underline underline-offset-[3px] hover:text-black';
/** Inline links that open the registry or a record: blossom, 600, underlined. */
export const registryInlineLink =
  'font-semibold text-ada2-blossom underline underline-offset-[3px] hover:text-ada2-blossom-hover';

export const thHead = 'text-left align-bottom py-3 px-4 text-[14px] leading-[18px] font-semibold';
export const thRow = 'text-left align-top py-3 px-4 font-bold text-ada2-ink';
export const tdCell = 'align-top py-3 px-4';
export const rowRule = 'border-b border-ada2-hairline';

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

/** Inner page: main column plus the right-rail CTA box (KIT:CTA). */
export function InnerPage({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="ada2-wrap pt-12 pb-[104px] flex flex-wrap items-start gap-x-12 gap-y-10">
      <div className="flex-[999_1_640px] min-w-0 flex flex-col gap-16">{children}</div>
      {aside}
    </div>
  );
}

/** The inner page's H1 block (plain H1, no hero). */
export function PageHead({
  title,
  lead,
  note,
  children,
}: {
  title: ReactNode;
  lead?: ReactNode;
  note?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="m-0 text-[clamp(40px,3.9vw,56px)] leading-[1.15] font-light text-ada2-ink [text-wrap:balance]">
        {title}
      </h1>
      {lead ? (
        <p className="m-0 max-w-[760px] text-[22px] leading-[31px] font-light text-ada2-body [text-wrap:pretty]">{lead}</p>
      ) : null}
      {note ? <p className="m-0 text-[14px] leading-[21px] text-ada2-muted [text-wrap:pretty]">{note}</p> : null}
      {children}
    </div>
  );
}

/** A section inside the main column: H2, optional intro, then content. */
export function DocSection({
  id,
  title,
  intro,
  children,
  className,
}: {
  id: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn('scroll-mt-6 flex flex-col gap-5', className)}>
      <div className="flex flex-col gap-3">
        <h2 id={`${id}-title`} className={h2Class}>
          {title}
        </h2>
        {intro ? <div className={cn(bodyClass, 'max-w-[820px] flex flex-col gap-3')}>{intro}</div> : null}
      </div>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// "On this page" (jump links, two columns from ~650px)
// ---------------------------------------------------------------------------

function DownChevron() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="#6B7280" strokeWidth={1.5} aria-hidden focusable={false} className="flex-none">
      <path d="M3.5 6L8 10.5 12.5 6" />
    </svg>
  );
}

export function OnThisPage({ title, items, id = 'otp-title' }: { title: ReactNode; items: { href: string; label: ReactNode }[]; id?: string }) {
  return (
    <nav aria-labelledby={id} className="flex flex-col gap-2">
      <h2 id={id} className="m-0 text-[17px] leading-[22px] font-semibold text-ada2-ink">
        {title}
      </h2>
      <ul className="m-0 p-0 list-none grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-x-8 border-t-2 border-ada2-ink">
        {items.map((item) => (
          <li key={item.href} className="border-b border-ada2-hairline">
            <a
              href={item.href}
              className="flex items-center justify-between gap-3 min-h-[48px] px-1 text-ada2-body text-[16px] leading-[22px] no-underline hover:bg-ada2-band hover:text-ada2-body"
            >
              {item.label}
              <DownChevron />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Ruled rows inside a column (the shared RuledRows is a full-width section)
// ---------------------------------------------------------------------------

export interface DocRow {
  label: ReactNode;
  value: ReactNode;
  /** Anchor id on the row (e.g. a footer link target). */
  id?: string;
}

export function Rows({
  rows,
  labelWidth = 200,
  compact = false,
  className,
}: {
  rows: DocRow[];
  /** Width of the label column in px. */
  labelWidth?: number;
  /** 16/24 type, as in Education's "Program details". */
  compact?: boolean;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        'm-0 flex flex-col border-t-2 border-ada2-ink',
        compact && 'text-[16px] leading-6',
        className
      )}
    >
      {rows.map((r, i) => (
        <div
          key={i}
          id={r.id}
          className={cn(
            'scroll-mt-6 flex flex-wrap border-b border-ada2-hairline',
            compact ? 'gap-x-5 gap-y-0.5 py-[11px]' : 'gap-x-6 gap-y-0.5 py-3'
          )}
        >
          <dt className="font-semibold text-ada2-ink" style={{ flex: `0 0 ${labelWidth}px` }}>
            {r.label}
          </dt>
          <dd className={cn('min-w-0 m-0 [text-wrap:pretty]', compact ? 'flex-[1_1_200px]' : 'flex-[1_1_300px]')}>
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Phone accordion (EducationMobile "Seven modules"): native <details>, so it
 * works without JavaScript and with the keyboard. The first item starts open.
 */
export function DisclosureList({ items, className }: { items: { title: ReactNode; body: ReactNode }[]; className?: string }) {
  return (
    <div className={cn('border-t-2 border-ada2-ink', className)}>
      {items.map((item, i) => (
        <details key={i} open={i === 0} className="group border-b border-ada2-hairline">
          <summary className="flex items-center justify-between gap-4 min-h-[52px] box-border py-3 pr-0.5 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-[17px] leading-6 font-semibold text-ada2-ink">
            {item.title}
            <svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              aria-hidden
              focusable={false}
              className="flex-none transition-transform group-open:rotate-180"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </summary>
          <div className="pb-[14px] text-[16px] leading-6 text-ada2-body [text-wrap:pretty]">{item.body}</div>
        </details>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Numbered ruled lists
// ---------------------------------------------------------------------------

/** Code of Conduct principles: "1  Title. Text", numbers continue across groups. */
export function PrincipleList({ start, items }: { start: number; items: { title: ReactNode; text: ReactNode }[] }) {
  return (
    <ol start={start} className="m-0 p-0 list-none flex flex-col border-t-2 border-ada2-ink">
      {items.map((item, i) => (
        <li key={i} className="flex gap-5 pt-3 pb-[14px] border-b border-ada2-hairline">
          <span
            aria-hidden="true"
            className="flex-none w-7 text-[20px] leading-[27px] font-light text-ada2-ink [font-variant-numeric:tabular-nums_lining-nums]"
          >
            {start + i}
          </span>
          <p className="flex-[1_1_auto] min-w-0 m-0 text-ada2-body [text-wrap:pretty]">
            <strong className={strongClass}>{item.title}</strong> {item.text}
          </p>
        </li>
      ))}
    </ol>
  );
}

/** Steps: number, H3 and text (Renew "How to renew", Scholarship "How to apply"). */
export function StepList({
  items,
  labelledBy,
}: {
  items: { title: ReactNode; body: ReactNode }[];
  labelledBy?: string;
}) {
  return (
    <ol aria-labelledby={labelledBy} className="m-0 p-0 list-none flex flex-col border-t-2 border-ada2-ink">
      {items.map((item, i) => (
        <li key={i} className="flex gap-5 pt-4 pb-[18px] border-b border-ada2-hairline">
          <span
            aria-hidden="true"
            className="flex-none w-6 text-[22px] leading-7 font-light text-ada2-ink [font-variant-numeric:tabular-nums_lining-nums]"
          >
            {i + 1}
          </span>
          <div className="flex-[1_1_auto] min-w-0 flex flex-col gap-1">
            <h3 className="m-0 text-[19px] leading-7 font-semibold text-ada2-ink [text-wrap:balance]">{item.title}</h3>
            <div className="text-ada2-body [text-wrap:pretty] flex flex-col gap-2">{item.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// Tables and footnotes (KIT:TABLE)
// ---------------------------------------------------------------------------

/**
 * Dark-header table in a horizontally scrollable frame. The frame is a
 * focusable region so keyboard users can scroll it on narrow screens.
 */
export function TableFrame({
  caption,
  minWidth,
  children,
}: {
  /** Visually hidden caption; also the scroll region's accessible name. */
  caption: string;
  minWidth: number;
  children: ReactNode;
}) {
  return (
    <div role="region" aria-label={caption} tabIndex={0} className="relative overflow-x-auto border border-ada2-hairline">
      <table
        className="w-full border-collapse bg-white text-[16px] leading-[22px] [font-variant-numeric:tabular-nums_lining-nums]"
        style={{ minWidth }}
      >
        <caption className="ada2-sr">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

export interface DataColumn {
  label: ReactNode;
  /** Extra classes on the header cell (e.g. a width). */
  className?: string;
  /** Extra classes on this column's body cells (e.g. "font-bold text-ada2-ink"). */
  cellClassName?: string;
}

/**
 * A small dark-header table. From 640px it is a table (first column = row
 * header); on phones each row becomes a ruled block of label/value pairs, so
 * no column is hidden off-screen behind a horizontal scroll.
 */
export function DataTable({
  caption,
  minWidth,
  columns,
  rows,
}: {
  caption: string;
  minWidth: number;
  columns: DataColumn[];
  /** Each row has one cell per column; cell 0 is the row header. */
  rows: ReactNode[][];
}) {
  return (
    <>
      <div className="hidden sm:block">
        <TableFrame caption={caption} minWidth={minWidth}>
          <thead>
            <tr className="bg-ada2-table-head text-white">
              {columns.map((c, i) => (
                <th key={i} scope="col" className={cn(thHead, c.className)}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((cells, r) => {
              const rule = r < rows.length - 1 ? rowRule : '';
              return (
                <tr key={r}>
                  {cells.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className={cn(thRow, rule, columns[0]?.cellClassName)}>
                        {cell}
                      </th>
                    ) : (
                      <td key={i} className={cn(tdCell, rule, columns[i]?.cellClassName)}>
                        {cell}
                      </td>
                    )
                  )}
                </tr>
              );
            })}
          </tbody>
        </TableFrame>
      </div>
      <ul aria-label={caption} className="sm:hidden m-0 p-0 list-none flex flex-col border-t-2 border-ada2-ink">
        {rows.map((cells, r) => (
          <li key={r} className="flex flex-col gap-2 pt-3 pb-4 border-b border-ada2-hairline">
            <p className="m-0 font-bold text-ada2-ink [text-wrap:pretty]">{cells[0]}</p>
            <dl className="m-0 flex flex-col gap-2">
              {columns.slice(1).map((c, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <dt className="text-[14px] leading-5 font-semibold text-ada2-muted">{c.label}</dt>
                  <dd className={cn('m-0 [text-wrap:pretty]', c.cellClassName)}>{cells[i + 1]}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}

export function Footnotes({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-1 text-[14px] leading-[21px] text-ada2-muted [&>p]:m-0 [&>p]:[text-wrap:pretty]">{children}</div>;
}

// ---------------------------------------------------------------------------
// Photo with dated caption
// ---------------------------------------------------------------------------

export function Photo({
  src,
  alt,
  caption,
  aspect = '3 / 2',
  position = '50% 50%',
  sizes = '(min-width: 1120px) 45vw, 100vw',
  className,
}: {
  src: string;
  alt: string;
  caption?: ReactNode;
  aspect?: string;
  position?: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <figure className={cn('m-0 flex flex-col gap-2.5', className)}>
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1067}
        sizes={sizes}
        className="block w-full h-auto object-cover"
        style={{ aspectRatio: aspect, objectPosition: position }}
      />
      {caption ? <figcaption className="text-[14px] leading-5 text-ada2-muted">{caption}</figcaption> : null}
    </figure>
  );
}

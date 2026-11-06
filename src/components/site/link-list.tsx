/**
 * KIT:LINK-LIST. One ruled list instead of a grid of identical tiles: one row
 * per destination, each with a one-line reason to go there. Two columns from
 * ~1000px, one on phones.
 */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowIcon } from './icons';

export interface LinkListItem {
  href: string;
  label: ReactNode;
  /** One line: why go there. */
  description?: ReactNode;
}

export function LinkList({ title, id = 'links-title', items }: { title: ReactNode; id?: string; items: LinkListItem[] }) {
  return (
    <section aria-labelledby={id} className="bg-white">
      <div className="ada2-wrap flex flex-col gap-5">
        <h2 id={id} className="m-0 text-[28px] leading-[34px] sm:text-[36px] sm:leading-[44px] font-light text-ada2-ink">
          {title}
        </h2>
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(440px,100%),1fr))] gap-x-12 border-t-2 border-ada2-ink">
          {items.map((item, i) => (
            <li key={i} className="border-b border-ada2-hairline">
              <Link
                href={item.href}
                className="flex items-center justify-between gap-4 min-h-[72px] box-border py-3 px-1 text-ada2-ink no-underline hover:bg-ada2-band hover:text-ada2-ink"
              >
                <span className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[18px] leading-6 font-semibold">{item.label}</span>
                  {item.description ? (
                    <span className="text-[15px] leading-[22px] text-ada2-muted [text-wrap:pretty]">{item.description}</span>
                  ) : null}
                </span>
                <ArrowIcon className="flex-none" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

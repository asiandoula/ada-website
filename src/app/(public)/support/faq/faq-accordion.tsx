'use client';

/**
 * FAQ.dc.html accordion: a heading per question holding a disclosure button
 * (aria-expanded / aria-controls). Answers stay in the DOM (hidden when
 * closed) so find-in-page and crawlers still see them. The first question of
 * each group starts open, as on the board.
 */
import Link from 'next/link';
import { useState } from 'react';
import { ArrowIcon } from '@/components/site/icons';
import { cn } from '@/lib/utils';

export interface FaqItemView {
  id: string;
  q: string;
  /** The answer, plain text translated on the server (also used for the FAQ JSON-LD). */
  a: string;
  link?: { href: string; label: string; tone?: 'ink' | 'registry' };
}

export function FaqAccordion({ items }: { items: FaqItemView[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    items.length ? { [items[0].id]: true } : {}
  );

  return (
    <div className="border-t-2 border-ada2-ink">
      {items.map((item) => {
        const isOpen = !!open[item.id];
        return (
          <div key={item.id} className="border-b border-ada2-hairline">
            <h3 className="m-0">
              <button
                type="button"
                id={`faq-q-${item.id}`}
                aria-expanded={isOpen}
                aria-controls={`faq-a-${item.id}`}
                onClick={() => setOpen((s) => ({ ...s, [item.id]: !s[item.id] }))}
                className="flex w-full items-center justify-between gap-6 min-h-[68px] box-border py-4 pr-1 pl-0 bg-transparent border-0 cursor-pointer font-[inherit] text-[20px] leading-7 font-normal text-ada2-ink text-left hover:bg-ada2-band"
              >
                <span className="min-w-0 [text-wrap:pretty]">{item.q}</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#111827"
                  strokeWidth="1.8"
                  aria-hidden="true"
                  focusable="false"
                  className={cn('flex-none transition-transform', isOpen && 'rotate-180')}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </h3>
            <div
              id={`faq-a-${item.id}`}
              role="region"
              aria-labelledby={`faq-q-${item.id}`}
              hidden={!isOpen}
              className="pr-0 sm:pr-14 pb-[22px] flex-col items-start gap-1 [&:not([hidden])]:flex"
            >
              <p className="m-0 max-w-[720px] text-ada2-body [text-wrap:pretty]">{item.a}</p>
              {item.link ? (
                <Link
                  href={item.link.href}
                  className={cn(
                    'inline-flex items-center gap-2 min-h-[44px] mt-1 text-[16px] leading-[22px] font-semibold no-underline',
                    item.link.tone === 'registry'
                      ? 'text-ada2-blossom hover:text-ada2-blossom-hover'
                      : 'text-ada2-ink hover:text-black'
                  )}
                >
                  {item.link.label}
                  <ArrowIcon />
                </Link>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

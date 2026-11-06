/**
 * KIT:HERO. One per hub page: solid indigo, a light H1, at most two pills, and
 * a real ADA photo bleeding off the right edge, never tinted or overlaid.
 * On inner pages use a plain H1 instead of this.
 *
 * `deadline` renders only when passed. Pass it only for a REAL upcoming
 * session from getUpcomingExamSessions(); the table has no registration
 * deadline, so write the exam date only, e.g.
 *   t('site.hero.nextExam', { type, date: formatExamDate(session.date, locale) })
 */
import Image from 'next/image';
import type { ReactNode } from 'react';
import { Pill } from './pill';

export interface HeroAction {
  href: string;
  label: ReactNode;
  /** The first action defaults to primary (white), the second to secondary (white outline). */
  variant?: 'primary' | 'secondary';
  'aria-label'?: string;
}

export interface HeroImage {
  /** A photo from /public/images/2026/, e.g. "/images/2026/ada-training-band.jpg". */
  src: string;
  alt: string;
  /** CSS object-position, e.g. "20% 50%". Default "50% 50%". */
  position?: string;
}

export interface HeroProps {
  title: ReactNode;
  /** The lead sentence under the H1 (22–24px light). */
  line?: ReactNode;
  /** The dated line. Only from a real session. Omit when there is none. */
  deadline?: ReactNode;
  /** Up to two pills; extra actions are ignored. */
  actions?: HeroAction[];
  image: HeroImage;
  /** Heading id for aria-labelledby. Default "hero-title". */
  id?: string;
  /** Preload the photo (the hero is usually the LCP). Default true. */
  priority?: boolean;
}

const leadClass =
  'm-0 max-w-[580px] text-[clamp(20px,1.7vw,24px)] leading-[1.4] font-light text-white [text-wrap:pretty]';

export function Hero({ title, line, deadline, actions = [], image, id = 'hero-title', priority = true }: HeroProps) {
  const shown = actions.slice(0, 2);
  return (
    <section aria-labelledby={id} className="bg-ada2-indigo text-white">
      <div className="flex flex-wrap items-stretch">
        <div className="ada2-hero-copy flex-[1_1_560px] min-w-0 box-border flex flex-col justify-center gap-5">
          <h1
            id={id}
            className="m-0 max-w-[620px] text-[clamp(40px,3.9vw,56px)] leading-[1.15] font-light text-white [text-wrap:balance]"
          >
            {title}
          </h1>
          {line ? <p className={leadClass}>{line}</p> : null}
          {deadline ? <p className={leadClass}>{deadline}</p> : null}
          {shown.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-3">
              {shown.map((a, i) => {
                const secondary = a.variant ? a.variant === 'secondary' : i > 0;
                return (
                  <Pill
                    key={a.href + i}
                    href={a.href}
                    variant={secondary ? 'onIndigoSecondary' : 'onIndigo'}
                    aria-label={a['aria-label']}
                    className="max-sm:flex-[1_1_240px]"
                  >
                    {a.label}
                  </Pill>
                );
              })}
            </div>
          )}
        </div>
        <div className="relative flex-[1_1_560px] min-w-0 min-h-[clamp(240px,32vw,460px)]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={priority}
            sizes="(min-width: 1120px) 50vw, 100vw"
            className="object-cover"
            style={{ objectPosition: image.position ?? '50% 50%' }}
          />
        </div>
      </div>
    </section>
  );
}

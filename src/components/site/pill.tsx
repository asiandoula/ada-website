/**
 * KIT:BUTTONS. Pills are 48px tall, 44px inside tables and toolbars.
 * One primary pill per view. The color says what the action does:
 *   primary (indigo)  certifies: Register, the main certification action
 *   secondary (ink)   everything else, and the second pill beside a primary
 *   registry (blossom) only actions that look up or open a record
 *   onIndigo / onIndigoSecondary  on the hero and CTA box (never blossom on indigo)
 */
import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArrowIcon, SearchIcon } from './icons';

export type PillVariant = 'primary' | 'secondary' | 'registry' | 'onIndigo' | 'onIndigoSecondary';
/** md = 48px page pill · sm = 44px table pill (20px side padding) · toolbar = 44px record toolbar (18px). */
export type PillSize = 'md' | 'sm' | 'toolbar';

const VARIANT: Record<PillVariant, string> = {
  primary:
    'bg-ada2-indigo border-ada2-indigo text-white hover:bg-ada2-indigo-hover hover:border-ada2-indigo-hover hover:text-white',
  secondary: 'bg-white border-ada2-ink text-ada2-ink hover:bg-ada2-band hover:text-ada2-ink',
  registry:
    'bg-ada2-blossom border-ada2-blossom text-white hover:bg-ada2-blossom-hover hover:border-ada2-blossom-hover hover:text-white',
  onIndigo: 'bg-white border-white text-ada2-indigo hover:bg-ada2-band-rule hover:text-ada2-indigo',
  onIndigoSecondary: 'bg-transparent border-white text-white hover:bg-ada2-indigo-hover hover:text-white',
};

const SIZE: Record<PillSize, string> = {
  md: 'min-h-[48px] px-[26px] text-[16px]',
  sm: 'min-h-[44px] px-5 text-[15px]',
  toolbar: 'min-h-[44px] px-[18px] text-[15px]',
};

export function pillClassName(variant: PillVariant = 'primary', size: PillSize = 'md', className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 box-border rounded-full border-[1.5px] border-solid',
    'font-semibold leading-5 no-underline whitespace-nowrap cursor-pointer',
    'transition-colors disabled:cursor-not-allowed disabled:opacity-60',
    VARIANT[variant],
    SIZE[size],
    className
  );
}

interface PillCommon {
  variant?: PillVariant;
  size?: PillSize;
  /** 'search' renders the magnifier used on registry pills; or pass any icon node. */
  icon?: 'search' | ReactNode;
  className?: string;
  children: ReactNode;
}

export type PillLinkProps = PillCommon & {
  href: string;
  /** Opens off-site in a new tab (adds rel="noopener noreferrer"). */
  external?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
};

export type PillButtonProps = PillCommon &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & { href?: undefined };

function renderIcon(icon: PillCommon['icon']) {
  if (!icon) return null;
  if (icon === 'search') return <SearchIcon />;
  return icon;
}

/** A pill: a link when `href` is given, otherwise a `<button>` (type="button" unless set). */
export function Pill(props: PillLinkProps | PillButtonProps) {
  if (typeof props.href === 'string') {
    const { href, external, variant, size, icon, className, children, ...aria } = props as PillLinkProps;
    const cls = pillClassName(variant, size, className);
    if (external) {
      return (
        <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...aria}>
          {renderIcon(icon)}
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...aria}>
        {renderIcon(icon)}
        {children}
      </Link>
    );
  }
  const { variant, size, icon, className, children, type, ...rest } = props as PillButtonProps;
  return (
    <button type={type ?? 'button'} className={pillClassName(variant, size, className)} {...rest}>
      {renderIcon(icon)}
      {children}
    </button>
  );
}

/**
 * Standalone link: 600 weight with a → arrow. Ink by default; `tone="registry"`
 * (blossom) only when it opens the registry or a record.
 */
export function ArrowLink({
  href,
  children,
  tone = 'ink',
  size = 'md',
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: 'ink' | 'registry' | 'onDark';
  /** md = 17/22 (default) · sm = 16/22 (inside tiles). */
  size?: 'md' | 'sm';
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-2 min-h-[44px] font-semibold no-underline',
        size === 'md' ? 'text-[17px] leading-[22px]' : 'text-[16px] leading-[22px]',
        tone === 'ink' && 'text-ada2-ink hover:text-black',
        tone === 'registry' && 'text-ada2-blossom hover:text-ada2-blossom-hover',
        tone === 'onDark' && 'text-white hover:text-white',
        className
      )}
    >
      {children}
      <ArrowIcon />
    </Link>
  );
}

/** Inline links are ink and underlined (KitC). Use on `<a>`/`<Link>` inside running text. */
export const inlineLinkClassName =
  'text-ada2-ink underline underline-offset-[3px] hover:text-black';

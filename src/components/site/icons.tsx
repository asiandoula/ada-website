/**
 * Inline stroke icons copied from KitC.dc.html. All decorative (aria-hidden):
 * the visible text next to them carries the meaning.
 */
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 18, ...rest }: IconProps, strokeWidth = 1.6): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    'aria-hidden': true,
    focusable: false,
    ...rest,
  };
}

export function GlobeIcon(p: IconProps) {
  return (
    <svg {...base({ size: 17, ...p }, 1.5)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
    </svg>
  );
}

export function PersonIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 19.5c1.2-3.3 3.8-5 7-5s5.8 1.7 7 5" />
    </svg>
  );
}

export function SearchIcon(p: IconProps) {
  return (
    <svg {...base(p, 1.8)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </svg>
  );
}

/** Standalone-link arrow (→). */
export function ArrowIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

/** Small row chevron used in tile sublinks (16 viewBox, grey). */
export function ChevronIcon({ size = 14, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="#6B7280" strokeWidth={1.5} aria-hidden focusable={false} {...rest}>
      <path d="M6 3.5L10.5 8 6 12.5" />
    </svg>
  );
}

export function MenuIcon(p: IconProps) {
  return (
    <svg {...base({ size: 16, ...p }, 2)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(p: IconProps) {
  return (
    <svg {...base({ size: 16, ...p }, 2)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/** Thin "×" used by the alert's dismiss button. */
export function DismissIcon(p: IconProps) {
  return (
    <svg {...base(p, 1.8)}>
      <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
    </svg>
  );
}

export function PrintIcon(p: IconProps) {
  return (
    <svg {...base(p, 1.5)}>
      <path d="M7 9V3.5h10V9" />
      <rect x="3.5" y="9" width="17" height="7.5" />
      <path d="M7 14h10v6.5H7z" />
    </svg>
  );
}

export function LinkIcon(p: IconProps) {
  return (
    <svg {...base(p, 1.5)}>
      <path d="M10 14l4-4" />
      <path d="M8.5 11.5l-2 2a3.2 3.2 0 004.5 4.5l2-2M15.5 12.5l2-2A3.2 3.2 0 0013 6l-2 2" />
    </svg>
  );
}

export function LetterIcon(p: IconProps) {
  return (
    <svg {...base(p, 1.5)}>
      <path d="M6 3.5h8l4 4v13H6z" />
      <path d="M14 3.5v4h4M9 12h6M9 15.5h6" />
    </svg>
  );
}

export function FlagIcon(p: IconProps) {
  return (
    <svg {...base(p, 1.5)}>
      <path d="M5 21V4M5 4.5h11l-2 4 2 4H5" />
    </svg>
  );
}

/** Square-cornered copy icon used inside the record sheet. */
export function CopyIcon(p: IconProps) {
  return (
    <svg {...base(p, 1.5)} strokeLinecap="square" strokeLinejoin="miter">
      <rect x="8.5" y="8.5" width="11" height="11" />
      <path d="M15.5 8.5v-4h-11v11h4" />
    </svg>
  );
}

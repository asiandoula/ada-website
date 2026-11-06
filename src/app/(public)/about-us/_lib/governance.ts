/**
 * Governance facts for /about-us, /about-us/board and /about-us/financials.
 *
 * Every value here is copied from the LIVE site (asiandoula.org, checked
 * 2026-11-06) and is passed into messages as an ICU argument, so no figure is
 * typed into a message string. They are page-local because src/lib/facts.ts
 * does not carry them yet; the orchestrator may move them there.
 *
 * Directors: names, roles, locations and bios exactly as the live board page
 * lists them (about-us/board). Composition: the live page says
 * "2 Independent directors (Wesley Lau · Minyu Zhang) · 2 Industry directors
 * (Mia Liu · Veronica Tseng) · 1 Founder-chair (Seth Meng)", plus Qi Wang,
 * Founder Emeritus ("Six volunteer directors"). Nothing here says more than that.
 */

export type DirectorRole = 'founderEmeritus' | 'president' | 'independentDirector' | 'director';
/** The live page's composition groups. */
export type DirectorGroup = 'founder' | 'chair' | 'independent' | 'industry';

export interface Director {
  /** Message key under board.people.<id> (location, bio). */
  id: 'qiWang' | 'sethMeng' | 'wesleyLau' | 'minyuZhang' | 'veronicaTseng' | 'miaLiu';
  /** Latin name, never translated. */
  name: string;
  role: DirectorRole;
  group: DirectorGroup;
}

/** Live order: leadership (Founder Emeritus, President), then the four directors. */
export const DIRECTORS: readonly Director[] = [
  { id: 'qiWang', name: 'Qi Wang', role: 'founderEmeritus', group: 'founder' },
  { id: 'sethMeng', name: 'Seth Meng', role: 'president', group: 'chair' },
  { id: 'wesleyLau', name: 'Wesley Lau', role: 'independentDirector', group: 'independent' },
  { id: 'minyuZhang', name: 'Minyu Zhang', role: 'independentDirector', group: 'independent' },
  { id: 'veronicaTseng', name: 'Veronica Tseng', role: 'director', group: 'industry' },
  { id: 'miaLiu', name: 'Mia Liu', role: 'director', group: 'industry' },
] as const;

/** Years named in the live bios (board.people.*.bio). */
export const BIO_YEARS = {
  /** Qi Wang "seeded what would become the Asian Doula Alliance in 2021". */
  qiWang: 2021,
  /** Seth Meng "was elected ADA's inaugural Board President at the 2026 board meeting". */
  sethMeng: 2026,
} as const;

/** Live election page (about-us/board/election) and board page. */
export const ELECTION = {
  /** "Board members serve two-year terms. There are no term limits." */
  termYears: 2,
  /** "Certification must have been active for at least 12 months." */
  minCertifiedMonths: 12,
  /** "Must attend at least 75% of quarterly board meetings." */
  minAttendancePercent: 75,
  /** "Outgoing members support a 30-day transition period." */
  handoverDays: 30,
} as const;

/** Live financials page (about-us/financials). */
export const FINANCE = {
  email: 'finance@asiandoula.org',
  /** "To request any of the above documents, email finance@asiandoula.org. We respond within 10 business days." */
  replyBusinessDays: 10,
  /** "State of incorporation: California, 2022." */
  incorporatedYear: 2022,
  /** "Form 990: our first annual filing covers fiscal year 2025." */
  firstForm990FiscalYear: 2025,
  /** The IRS form name; written the same in every locale (no-break space, so it never splits). */
  form990: 'Form\u00A0990',
} as const;

/** Month of the graded ADA training photos (public/images/2026/), for captions. */
export const PHOTO_MONTH = '2024-08';

export function directorsIn(group: DirectorGroup): Director[] {
  return DIRECTORS.filter((d) => d.group === group);
}

export function mailto(email: string, subject?: string): string {
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
}

/**
 * Site navigation: the audience nav and which audience a route belongs to.
 * Edit here (not in the header) when routes move. Real routes only.
 */

export type AudienceKey = 'candidates' | 'doulas' | 'families' | 'insurers' | 'providers' | 'about';

export interface Audience {
  key: AudienceKey;
  /** Where the audience link goes. */
  href: string;
  /** Route prefixes that mark this audience as current (aria-current + ink underline). */
  match: readonly string[];
}

/** KitC order: Candidates · Certified Doulas · Families · Insurers & Agencies · Training Providers · About ADA. */
export const AUDIENCES: readonly Audience[] = [
  {
    key: 'candidates',
    href: '/certifications',
    match: ['/certifications', '/exam-dates', '/exam-day', '/programs/scholarship', '/exam-home'],
  },
  { key: 'doulas', href: '/portal', match: ['/portal', '/for-doulas/renew'] },
  { key: 'families', href: '/for-families', match: ['/for-families'] },
  { key: 'insurers', href: '/verify', match: ['/verify'] },
  { key: 'providers', href: '/programs', match: ['/programs'] },
  {
    key: 'about',
    href: '/about-us',
    match: ['/about-us', '/articles', '/for-doulas/code-of-conduct', '/support', '/donate'],
  },
];

function matches(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(prefix + '/');
}

/** The audience a path belongs to (longest matching prefix wins), or null (home, legal pages). */
export function audienceForPath(pathname: string | null | undefined): AudienceKey | null {
  if (!pathname) return null;
  let best: { key: AudienceKey; len: number } | null = null;
  for (const a of AUDIENCES) {
    for (const prefix of a.match) {
      if (matches(pathname, prefix) && (!best || prefix.length > best.len)) best = { key: a.key, len: prefix.length };
    }
  }
  return best?.key ?? null;
}

/** Routes where the phone verify block is NOT shown under the header (the page is the verify form, a record, or an app). */
export const NO_PHONE_VERIFY_BLOCK: readonly string[] = ['/verify', '/portal', '/exam-home'];

export function showPhoneVerifyBlock(pathname: string | null | undefined): boolean {
  if (!pathname) return true;
  return !NO_PHONE_VERIFY_BLOCK.some((p) => matches(pathname, p));
}

export const UTILITY_LINKS = {
  contact: '/support/contact',
  signIn: '/portal',
  verify: '/verify',
} as const;

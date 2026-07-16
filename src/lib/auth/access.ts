// Admin access is restricted to these Google Workspace domains.
// Widening access = add a domain here (single source of truth for both the
// page middleware and every authenticated API route).
const ALLOWED_ADMIN_DOMAINS = ['cooings.com', 'asiandoula.org'];

/**
 * True only when `email` belongs to an allowed admin domain. Any other
 * authenticated identity (e.g. a self-registered Google account) is treated
 * as unauthorized — this is what stops open signup from reaching /admin.
 */
export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  // Require exactly one '@' with a non-empty local part, and match on the
  // domain segment after it. Rejecting multi-'@' forms avoids the
  // `x@cooings.com@evil.com` ambiguity where the true domain is `evil.com`.
  const parts = email.trim().toLowerCase().split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return false;
  return ALLOWED_ADMIN_DOMAINS.includes(parts[1]);
}

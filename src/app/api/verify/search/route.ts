/**
 * GET /api/verify/search?q=…  Public registry search (JSON).
 *
 * Same rules as the /verify page (src/app/(public)/verify/_lib/registry.ts):
 *   - certificate numbers, certificate codes and Doula IDs are exact lookups
 *   - names match the English name or the native name; at most 10 results
 *   - minimum length 2 for codes, 3 for names (2 when written in CJK)
 *   - only public fields: no internal IDs, emails, phones, dates of birth,
 *     PDF links or internal status strings
 *
 * Response: { query, type, results: PublicResult[], truncated? }
 *   400 { error: 'query_required' } · 400 { error: 'too_short', min } · 500 { error: 'search_failed' }
 */
import { NextRequest, NextResponse } from 'next/server';
import { recordPath, searchRegistry, type PublicRecord } from '@/app/(public)/verify/_lib/registry';

export const dynamic = 'force-dynamic';

function publicResult(r: PublicRecord, href?: string) {
  return {
    doula: {
      full_name: r.name,
      full_name_zh: r.nativeName,
      doula_id_code: r.doulaId,
    },
    /** good | retired | lapsed | suspended | revoked */
    standing: r.standing,
    href: href ?? recordPath(r),
    credentials: r.credentials.map((c) => ({
      credential_type: c.type,
      status: c.status,
      first_certified: c.firstCertified,
      period_ends: c.periodEnds,
      revoked_on: c.revokedOn,
      current_certificate: c.currentCertificate,
    })),
    certificates: r.certificates.map((c) => ({
      certificate_number: c.number,
      certificate_type: c.type,
      verification_code: c.code,
      status: c.state,
      issued_date: c.issued,
    })),
  };
}

export async function GET(request: NextRequest) {
  const outcome = await searchRegistry(request.nextUrl.searchParams.get('q'));
  const headers = { 'Cache-Control': 'no-store' };

  switch (outcome.status) {
    case 'empty':
      return NextResponse.json({ error: 'query_required' }, { status: 400, headers });
    case 'tooShort':
      return NextResponse.json({ error: 'too_short', min: outcome.min, query: outcome.query }, { status: 400, headers });
    case 'error':
      return NextResponse.json({ error: 'search_failed' }, { status: 500, headers });
    case 'notFound':
      return NextResponse.json({ query: outcome.query, type: outcome.type, results: [] }, { headers });
    case 'exact':
      return NextResponse.json(
        { query: outcome.query, type: outcome.type, results: [publicResult(outcome.record, outcome.href)] },
        { headers }
      );
    case 'list':
      return NextResponse.json(
        {
          query: outcome.query,
          type: outcome.type,
          results: outcome.records.map((r) => publicResult(r)),
          truncated: outcome.truncated,
        },
        { headers }
      );
  }
}

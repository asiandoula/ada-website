import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  const q = request.nextUrl.searchParams.get('q')?.trim();
  if (!q) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }

  // Detect query type
  const isDoulaId = q.startsWith('#') || /^\d{2}-/.test(q);
  const isCertNumber = q.toUpperCase().startsWith('ADA-');
  // 8-char alphanumeric = likely verification code
  const isVerificationCode = /^[A-Z0-9]{6,10}$/i.test(q) && !isDoulaId && !isCertNumber;

  try {
    if (isDoulaId) {
      // Search by doula ID code
      const normalizedId = q.startsWith('#') ? q : `#${q}`;
      const { data: doula } = await supabase
        .from('doulas')
        .select('id, full_name, full_name_zh, doula_id_code, status')
        .eq('doula_id_code', normalizedId)
        .single();

      if (!doula) {
        return NextResponse.json({ results: [], query: q, type: 'doula_id' });
      }

      const { data: certs } = await supabase
        .from('certificates')
        .select('*')
        .eq('doula_id', doula.id);

      return NextResponse.json({
        results: (certs || []).map(c => ({ ...c, doula })),
        query: q,
        type: 'doula_id',
      });
    }

    if (isCertNumber) {
      const { data: cert } = await supabase
        .from('certificates')
        .select('*, doulas(full_name, full_name_zh, doula_id_code, status)')
        .eq('certificate_number', q.toUpperCase())
        .single();

      return NextResponse.json({
        results: cert ? [{ ...cert, doula: cert.doulas }] : [],
        query: q,
        type: 'cert_number',
      });
    }

    if (isVerificationCode) {
      const { data: cert } = await supabase
        .from('certificates')
        .select('*, doulas(full_name, full_name_zh, doula_id_code, status)')
        .eq('verification_code', q.toUpperCase())
        .single();

      return NextResponse.json({
        results: cert ? [{ ...cert, doula: cert.doulas }] : [],
        query: q,
        type: 'verification_code',
      });
    }

    // Default: name search (case-insensitive partial match)
    const { data: doulas } = await supabase
      .from('doulas')
      .select('id, full_name, full_name_zh, doula_id_code, status')
      .ilike('full_name', `%${q}%`);

    if (!doulas || doulas.length === 0) {
      return NextResponse.json({ results: [], query: q, type: 'name' });
    }

    // Get certificates for all matched doulas
    const doulaIds = doulas.map(d => d.id);
    const { data: certs } = await supabase
      .from('certificates')
      .select('*')
      .in('doula_id', doulaIds);

    const results = doulas.map(doula => {
      const doulaCerts = (certs || []).filter(c => c.doula_id === doula.id);
      return {
        doula,
        certificates: doulaCerts,
      };
    });

    return NextResponse.json({ results, query: q, type: 'name' });
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

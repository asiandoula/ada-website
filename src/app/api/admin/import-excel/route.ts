import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function excelDate(serial: number | string | null): string | null {
  if (!serial || typeof serial === 'string') return null;
  return new Date((serial - 25569) * 86400000).toISOString().split('T')[0];
}

function mapStatus(s: string): string {
  const map: Record<string, string> = {
    'Certified (Active)': 'active',
    'Expired': 'active',
    'Revoked': 'revoked',
    'Under Investigation': 'under_investigation',
    'Exam Failed': 'registered',
    'Exam Scheduled': 'registered',
    'Suspended': 'suspended',
    'Retired': 'retired',
  };
  return map[s] || 'registered';
}

function mapExamStatus(s: string): string {
  const map: Record<string, string> = {
    'Certified (Active)': 'passed',
    'Expired': 'passed',
    'Revoked': 'passed',
    'Under Investigation': 'passed',
    'Exam Failed': 'failed',
    'Exam Scheduled': 'scheduled',
    'Suspended': 'passed',
    'Retired': 'passed',
  };
  return map[s] || 'not_started';
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const wb = XLSX.read(buffer);
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) as Record<string, unknown>[];

    // Get existing doulas
    const { data: dbDoulas } = await supabase.from('doulas').select('id, doula_id_code, full_name, status, exam_status');
    const dbByCode: Record<string, Record<string, string>> = {};
    dbDoulas?.forEach(d => { dbByCode[d.doula_id_code] = d; });

    const results = { updated: 0, inserted: 0, skipped: 0, errors: [] as string[] };

    for (const row of rows) {
      const code = row['Doula ID'] as string;
      const name = row['Full Name'] as string;
      const certStatus = row['Certification Status'] as string;
      const status = mapStatus(certStatus);
      const examStatus = mapExamStatus(certStatus);
      const issued = excelDate(row['Certification Issued Date'] as number);
      const expiry = excelDate(row['Certification Expiry Date'] as number);

      if (!code || !name) continue;

      if (dbByCode[code]) {
        // Update existing
        const changes: Record<string, string | null> = {};
        const db = dbByCode[code];
        if (db.full_name !== name) changes.full_name = name;
        if (db.status !== status) changes.status = status;
        if (db.exam_status !== examStatus) changes.exam_status = examStatus;
        if (issued) changes.certification_date = issued;
        if (expiry) changes.expiration_date = expiry;

        if (Object.keys(changes).length > 0) {
          const { error } = await supabase.from('doulas').update(changes).eq('id', db.id);
          if (error) results.errors.push(`Update ${code}: ${error.message}`);
          else results.updated++;
        } else {
          results.skipped++;
        }
      } else {
        // Insert new
        const { error } = await supabase.from('doulas').insert({
          doula_id_code: code,
          full_name: name,
          status,
          exam_status: examStatus,
          certification_date: issued,
          expiration_date: expiry,
        });
        if (error) results.errors.push(`Insert ${code}: ${error.message}`);
        else results.inserted++;
      }
    }

    return NextResponse.json({
      ...results,
      total_excel: rows.length,
      total_db: (dbDoulas?.length || 0) + results.inserted,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

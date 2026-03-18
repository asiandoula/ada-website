/**
 * Seed script: imports doula records from ADA Excel registry into Supabase.
 *
 * Usage:
 *   npx tsx scripts/seed-from-excel.ts
 *
 * Requires:
 *   .env.local with SUPABASE_SERVICE_ROLE_KEY
 *   Excel file at ../data/ada-doula-registry.xlsx
 */
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role bypasses RLS
);

const STATUS_MAP: Record<string, string> = {
  'Certified (Active)': 'certified_active',
  'Exam Scheduled': 'exam_scheduled',
  'Exam Failed': 'exam_failed',
  'Expired': 'expired',
  'Under Investigation': 'under_investigation',
  'Suspended': 'suspended',
  'Revoked': 'revoked',
  'Retired': 'retired',
};

function computeProficiency(score: number | null): string | null {
  if (score === null || score === undefined) return null;
  if (score > 95) return 'Highly Proficient';
  if (score > 85) return 'Proficient';
  return 'Not Proficient';
}

function excelDateToISO(serial: number | string | null): string | null {
  if (serial === null || serial === undefined) return null;
  if (typeof serial === 'string') return serial;
  // Excel serial date → JS Date
  const utcDays = Math.floor(serial - 25569);
  const date = new Date(utcDays * 86400 * 1000);
  return date.toISOString().split('T')[0];
}

async function main() {
  const excelPath = path.resolve(
    __dirname,
    '../data/ada-doula-registry.xlsx'
  );

  // Note: seed script expects data file at project's data/ dir
  // Copy from: asiandoula-org/Projects/website-rebuild/data/ada-doula-registry.xlsx
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets['Registed ADA Doula'];
  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

  console.log(`Found ${rows.length} rows to import`);

  let imported = 0;
  let skipped = 0;

  for (const row of rows) {
    const doulaIdCode = row['Doula ID'];
    if (!doulaIdCode || !row['Full Name']) {
      skipped++;
      continue;
    }

    const status = STATUS_MAP[row['Certification Status']] || 'exam_scheduled';

    // Insert doula
    const { data: doula, error: doulaError } = await supabase
      .from('doulas')
      .upsert(
        {
          doula_id_code: doulaIdCode,
          full_name: row['Full Name'],
          email: row['Email'] || null,
          date_of_birth: excelDateToISO(row['Date of Birth']),
          certification_date: excelDateToISO(row['Certification Issued Date']),
          expiration_date: excelDateToISO(row['Certification Expiry Date']),
          status,
          training_provider: row['Training Institution / Program'] || null,
        },
        { onConflict: 'doula_id_code' }
      )
      .select('id')
      .single();

    if (doulaError) {
      console.error(`Error importing ${doulaIdCode}: ${doulaError.message}`);
      skipped++;
      continue;
    }

    // Insert exam result if overall score exists
    const overallScore = row['Overall Score'];
    if (overallScore !== null && overallScore !== undefined) {
      const { error: examError } = await supabase.from('exam_results').insert({
        doula_id: doula.id,
        exam_session: row['Exam ID'] || null,
        exam_date: excelDateToISO(row['Test Taken Date']),
        overall_score: overallScore,
        score_terminology: row['Terminology'] || null,
        score_newborn: row['Newborn'] || null,
        score_lactation: row['Lactation'] || null,
        score_emergency: row['Emergency'] || null,
        score_practical: row['Practical'] || null,
        score_postpartum: row['Postpartum'] || null,
        score_knowledge: row['Knowledge'] || null,
        score_ethics: row['Ethics'] || null,
        passed: status === 'certified_active' || status === 'expired' || status === 'retired',
        proficiency_level: computeProficiency(overallScore),
      });

      if (examError) {
        console.error(`Error importing exam for ${doulaIdCode}: ${examError.message}`);
      }
    }

    imported++;
  }

  console.log(`Done: ${imported} imported, ${skipped} skipped`);
}

main().catch(console.error);

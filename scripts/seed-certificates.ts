/**
 * Seed certificate records for all certified_active doulas.
 * Creates database records with verification codes.
 * Does NOT generate PDFs (too slow for batch — use admin UI for individual PDFs).
 *
 * Usage: npx tsx scripts/seed-certificates.ts
 */

import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  // Get all certified doulas who don't have a certificate yet
  const { data: doulas, error: doulasError } = await supabase
    .from('doulas')
    .select('id, doula_id_code, full_name, certification_date, expiration_date, status')
    .eq('status', 'certified_active');

  if (doulasError) {
    console.error('Error fetching doulas:', doulasError);
    process.exit(1);
  }

  console.log(`Found ${doulas.length} certified active doulas`);

  // Check which ones already have certificates
  const { data: existingCerts } = await supabase
    .from('certificates')
    .select('doula_id');

  const existingDoulaIds = new Set((existingCerts || []).map(c => c.doula_id));
  const needsCert = doulas.filter(d => !existingDoulaIds.has(d.id));

  console.log(`${needsCert.length} doulas need certificates (${existingDoulaIds.size} already have one)`);

  if (needsCert.length === 0) {
    console.log('Nothing to do!');
    return;
  }

  // Generate certificate records
  const year = new Date().getFullYear();
  let sequence = existingDoulaIds.size;

  const records = needsCert.map(doula => {
    sequence++;
    const certificateNumber = `ADA-PD-${year}-${sequence.toString().padStart(4, '0')}`;
    const verificationCode = nanoid(8);

    return {
      doula_id: doula.id,
      certificate_type: 'postpartum',
      certificate_number: certificateNumber,
      issued_date: doula.certification_date || new Date().toISOString().split('T')[0],
      expiration_date: doula.expiration_date || null,
      pdf_url: null, // PDF generated individually via admin
      verification_code: verificationCode,
    };
  });

  // Insert in batches of 50
  const batchSize = 50;
  let inserted = 0;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const { error } = await supabase.from('certificates').insert(batch);

    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
      continue;
    }

    inserted += batch.length;
    console.log(`Inserted ${inserted}/${records.length} certificates`);
  }

  console.log(`\nDone! ${inserted} certificate records created.`);
  console.log('Verification codes are ready — doulas can now be verified at /verify');
  console.log('PDFs can be generated individually via the admin panel.');

  // Print a few examples
  console.log('\nSample verification codes:');
  records.slice(0, 5).forEach(r => {
    const doula = needsCert.find(d => d.id === r.doula_id);
    console.log(`  ${doula?.full_name} → ${r.certificate_number} → /verify/${r.verification_code}`);
  });
}

main().catch(console.error);

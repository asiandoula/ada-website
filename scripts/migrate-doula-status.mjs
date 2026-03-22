/**
 * Migration script: Split doula status into status + exam_status
 *
 * Prerequisites: The `exam_status` column must already exist on the doulas table
 * with default 'not_started'. Run this SQL first via Supabase dashboard:
 *
 *   ALTER TABLE doulas ADD COLUMN IF NOT EXISTS exam_status text NOT NULL DEFAULT 'not_started';
 *
 * Status mapping:
 *   certified_active    → status=active,              exam_status=passed
 *   exam_scheduled      → status=registered,          exam_status=scheduled
 *   exam_failed         → status=registered,          exam_status=failed
 *   expired             → status=active,              exam_status=passed
 *   under_investigation → status=under_investigation, exam_status=passed
 *   suspended           → status=suspended,           exam_status=passed
 *   revoked             → status=revoked,             exam_status=passed
 *   retired             → status=retired,             exam_status=passed
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const STATUS_MAP = {
  certified_active:    { status: 'active',              exam_status: 'passed' },
  exam_scheduled:      { status: 'registered',          exam_status: 'scheduled' },
  exam_failed:         { status: 'registered',          exam_status: 'failed' },
  expired:             { status: 'active',              exam_status: 'passed' },
  under_investigation: { status: 'under_investigation', exam_status: 'passed' },
  suspended:           { status: 'suspended',           exam_status: 'passed' },
  revoked:             { status: 'revoked',             exam_status: 'passed' },
  retired:             { status: 'retired',             exam_status: 'passed' },
};

// Also update doula_credentials that used old status values
const CREDENTIAL_STATUS_MAP = {
  certified_active: 'active',
  expired: 'expired',
  exam_scheduled: 'active',
  exam_failed: 'active',
};

async function migrate() {
  // Verify exam_status column exists
  const { error: checkError } = await supabase.from('doulas').select('exam_status').limit(1);
  if (checkError && checkError.message.includes('does not exist')) {
    console.error('ERROR: exam_status column does not exist on the doulas table.');
    console.error('Please run this SQL in Supabase dashboard first:');
    console.error("  ALTER TABLE doulas ADD COLUMN IF NOT EXISTS exam_status text NOT NULL DEFAULT 'not_started';");
    process.exit(1);
  }

  console.log('Fetching all doulas...');
  const { data: doulas, error } = await supabase
    .from('doulas')
    .select('id, status, exam_status');

  if (error) {
    console.error('Failed to fetch doulas:', error.message);
    process.exit(1);
  }

  console.log(`Found ${doulas.length} doulas.`);

  let updated = 0;
  let skipped = 0;

  for (const doula of doulas) {
    const mapping = STATUS_MAP[doula.status];
    if (!mapping) {
      // Already using new status values
      console.log(`  [SKIP] ${doula.id} — status "${doula.status}" not in migration map (already migrated?)`);
      skipped++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('doulas')
      .update({
        status: mapping.status,
        exam_status: mapping.exam_status,
      })
      .eq('id', doula.id);

    if (updateError) {
      console.error(`  [ERROR] ${doula.id}: ${updateError.message}`);
    } else {
      console.log(`  [OK] ${doula.id}: ${doula.status} → status=${mapping.status}, exam_status=${mapping.exam_status}`);
      updated++;
    }
  }

  // Migrate credential statuses
  console.log('\nMigrating credential statuses...');
  for (const [oldStatus, newStatus] of Object.entries(CREDENTIAL_STATUS_MAP)) {
    const { data: creds, error: credError } = await supabase
      .from('doula_credentials')
      .select('id')
      .eq('status', oldStatus);

    if (credError) {
      console.error(`  [ERROR] fetching credentials with status "${oldStatus}":`, credError.message);
      continue;
    }

    if (creds && creds.length > 0) {
      const { error: updateError } = await supabase
        .from('doula_credentials')
        .update({ status: newStatus })
        .eq('status', oldStatus);

      if (updateError) {
        console.error(`  [ERROR] updating credentials "${oldStatus}" → "${newStatus}":`, updateError.message);
      } else {
        console.log(`  [OK] ${creds.length} credentials: ${oldStatus} → ${newStatus}`);
      }
    }
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
}

migrate().catch(console.error);

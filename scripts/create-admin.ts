/**
 * Create admin user in Supabase Auth.
 *
 * Usage: npx tsx scripts/create-admin.ts
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'dev@asiandoula.org',
    password: 'ada2026',
    email_confirm: true,
  });

  if (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }

  console.log('Admin user created:', data.user.email);
}

main().catch(console.error);

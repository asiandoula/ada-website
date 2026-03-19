import { Client } from 'pg';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: npx tsx scripts/run-single-migration.ts <path-to-sql>');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  const sql = fs.readFileSync(file, 'utf-8');
  console.log(`Running ${file}...`);
  await client.query(sql);
  console.log('Done');
  await client.end();
}

main().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});

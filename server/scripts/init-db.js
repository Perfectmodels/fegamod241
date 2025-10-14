import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const databaseUrl = process.env.DATABASE_URL || process.argv[2];
if (!databaseUrl) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function run() {
  try {
    const filePath = path.resolve(process.cwd(), 'server/db/init.sql');
    const ddl = fs.readFileSync(filePath, 'utf8');
    const statements = ddl
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    console.log(`Executing ${statements.length} SQL statements...`);
    for (const stmt of statements) {
      await sql.unsafe(stmt);
    }
    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Initialization failed:', err);
    process.exit(1);
  }
}

run();



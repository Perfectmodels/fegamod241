import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL || process.argv[2];
if (!url) {
  console.error('DATABASE_URL missing');
  process.exit(1);
}

const sql = neon(url);
(async () => {
  const rows = await sql`select schemaname, tablename from pg_tables where schemaname='public' order by tablename`;
  console.log(rows);
})();



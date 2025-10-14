import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const databaseUrl = process.env.DATABASE_URL || process.argv[2];
if (!databaseUrl) {
  console.error('DATABASE_URL is not set (env or arg)');
  process.exit(1);
}

const FIREBASE_DB_URL = 'https://dbfegamod-default-rtdb.firebaseio.com/public.json';

async function fetchFirebaseJson() {
  const res = await fetch(FIREBASE_DB_URL);
  if (!res.ok) throw new Error(`Failed to fetch Firebase: ${res.status}`);
  return res.json();
}

function normalizeArray(obj) {
  if (!obj || typeof obj !== 'object') return [];
  return Object.keys(obj).map((id) => ({ id, ...obj[id] }));
}

async function migrate() {
  const sql = neon(databaseUrl);
  // Ensure schema exists by executing init.sql
  const ddlPath = path.resolve(process.cwd(), 'server/db/init.sql');
  const ddl = fs.readFileSync(ddlPath, 'utf8');
  await sql.unsafe(ddl);
  const data = await fetchFirebaseJson();

  const members = normalizeArray(data.members);
  const events = normalizeArray(data.events);
  const articles = normalizeArray(data.articles);
  const founders = normalizeArray(data.founders);
  const partners = normalizeArray(data.partners);
  const fullMembers = normalizeArray(data.fullMembersData);
  const settings = data.settings ? [{ id: 1, ...data.settings }] : [];

  // Members
  for (const m of members) {
    await sql`insert into public.members (id, name, category, bio, image_url, socials)
              values (${m.id}, ${m.name}, ${m.category}, ${m.bio ?? ''}, ${m.imageUrl ?? ''}, ${m.socials ? JSON.stringify(m.socials) : null}::jsonb)
              on conflict (id) do update set
                name = excluded.name,
                category = excluded.category,
                bio = excluded.bio,
                image_url = excluded.image_url,
                socials = excluded.socials`;
  }

  // Events
  for (const e of events) {
    await sql`insert into public.events (id, title, date, location, description, image_url)
              values (${e.id}, ${e.title}, ${e.date ?? ''}, ${e.location ?? ''}, ${e.description ?? ''}, ${e.imageUrl ?? ''})
              on conflict (id) do update set
                title = excluded.title,
                date = excluded.date,
                location = excluded.location,
                description = excluded.description,
                image_url = excluded.image_url`;
  }

  // Articles
  for (const a of articles) {
    await sql`insert into public.articles (id, title, excerpt, content, image_url, category, date)
              values (${a.id}, ${a.title}, ${a.excerpt ?? ''}, ${a.content ?? ''}, ${a.imageUrl ?? ''}, ${a.category ?? ''}, ${a.date ?? ''})
              on conflict (id) do update set
                title = excluded.title,
                excerpt = excluded.excerpt,
                content = excluded.content,
                image_url = excluded.image_url,
                category = excluded.category,
                date = excluded.date`;
  }

  // Founders
  for (const f of founders) {
    await sql`insert into public.founders (id, name, title, image_url)
              values (${f.id}, ${f.name}, ${f.title ?? ''}, ${f.imageUrl ?? ''})
              on conflict (id) do update set
                name = excluded.name,
                title = excluded.title,
                image_url = excluded.image_url`;
  }

  // Partners
  for (const p of partners) {
    await sql`insert into public.partners (id, name, logo_url)
              values (${p.id}, ${p.name}, ${p.logoUrl ?? ''})
              on conflict (id) do update set
                name = excluded.name,
                logo_url = excluded.logo_url`;
  }

  // Settings (single row id=1)
  for (const s of settings) {
    await sql`insert into public.settings (id, email, phone, address)
              values (1, ${s.email ?? ''}, ${s.phone ?? ''}, ${s.address ?? ''})
              on conflict (id) do update set
                email = excluded.email,
                phone = excluded.phone,
                address = excluded.address`;
  }

  // Full Members Data
  for (const fm of fullMembers) {
    await sql`insert into public.full_members_data (id, name, gender, email, phone, age_range, nationality, city, association, category, revenue)
              values (${fm.id}, ${fm.name}, ${fm.gender ?? ''}, ${fm.email ?? ''}, ${fm.phone ?? ''}, ${fm.ageRange ?? ''}, ${fm.nationality ?? ''}, ${fm.city ?? ''}, ${fm.association ?? ''}, ${fm.category ?? ''}, ${fm.revenue ?? ''})
              on conflict (id) do update set
                name = excluded.name,
                gender = excluded.gender,
                email = excluded.email,
                phone = excluded.phone,
                age_range = excluded.age_range,
                nationality = excluded.nationality,
                city = excluded.city,
                association = excluded.association,
                category = excluded.category,
                revenue = excluded.revenue`;
  }

  console.log('Migration completed:', {
    members: members.length,
    events: events.length,
    articles: articles.length,
    founders: founders.length,
    partners: partners.length,
    settings: settings.length,
    fullMembers: fullMembers.length,
  });
}

migrate().catch((e) => {
  console.error('Migration failed:', e);
  process.exit(1);
});



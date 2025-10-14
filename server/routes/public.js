import { Router } from 'express';
import { neon } from '@neondatabase/serverless';

const router = Router();

const getSql = () => {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  return neon(url);
};

router.get('/members', async (_req, res) => {
  try {
    const sql = getSql();
    const rows = await sql`SELECT id, name, category, bio, image_url AS "imageUrl", socials FROM members ORDER BY name ASC`;
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load members' });
  }
});

router.get('/members/:id', async (req, res) => {
  try {
    const sql = getSql();
    const { id } = req.params;
    const rows = await sql`SELECT id, name, category, bio, image_url AS "imageUrl", socials FROM members WHERE id = ${id} LIMIT 1`;
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load member' });
  }
});

router.get('/events', async (_req, res) => {
  try {
    const sql = getSql();
    const rows = await sql`SELECT id, title, date, location, description, image_url AS "imageUrl" FROM events ORDER BY date DESC`;
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load events' });
  }
});

router.get('/articles', async (_req, res) => {
  try {
    const sql = getSql();
    const rows = await sql`SELECT id, title, excerpt, content, image_url AS "imageUrl", category, date FROM articles ORDER BY date DESC`;
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load articles' });
  }
});

export default router;



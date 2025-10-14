import { Member, Event, Article, Founder, Partner, FullMemberData, SiteSettings } from '../types';
import { 
    MOCK_FOUNDERS, 
    MOCK_FULL_MEMBER_DATA,
    MOCK_SETTINGS
} from './seed-data';

// Neon Data API (PostgREST)
// Vite defines import.meta.env at runtime; add fallbacks for typings and dev
const envAny = (import.meta as any).env || {};
const NEON_BASE = (envAny.VITE_NEON_REST_URL as string) || '';
const NEON_API_KEY = (envAny.VITE_NEON_API_KEY as string) || '';

const NEON_HEADERS: HeadersInit = {
    'Content-Type': 'application/json',
    'apikey': NEON_API_KEY || '',
    'Authorization': `Bearer ${NEON_API_KEY || ''}`,
};

const neonFetch = async (relative: string, init: RequestInit = {}) => {
    if (!NEON_BASE || !NEON_API_KEY) {
        throw new Error('Neon Data API non configuré. Définissez VITE_NEON_REST_URL et VITE_NEON_API_KEY.');
    }
    const url = `${NEON_BASE}${relative}`;
    const response = await fetch(url, { ...init, headers: { ...NEON_HEADERS, ...(init.headers || {}) } });
    if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error('Neon Data API error:', response.status, errorText);
        throw new Error('Erreur API Neon');
    }
    if (response.status === 204) return null;
    return response.json();
};

// --- Public Data Fetchers ---
export const getMembers = async (): Promise<Member[]> => {
    const rows = await neonFetch(`/members?select=id,name,category,bio,image_url,socials&order=name.asc`);
    return (rows as any[]).map((r) => ({ ...r, imageUrl: r.image_url }));
}

export const getMemberById = async (id: string): Promise<Member | null> => {
    const rows = await neonFetch(`/members?id=eq.${id}&select=id,name,category,bio,image_url,socials`);
    const m = (rows as any[])[0];
    return m ? { ...m, imageUrl: m.image_url } : null;
};

export const getEvents = async (): Promise<Event[]> => {
    const rows = await neonFetch(`/events?select=id,title,date,location,description,image_url&order=date.desc`);
    return (rows as any[]).map((r) => ({ ...r, imageUrl: r.image_url }));
}

export const getArticles = async (): Promise<Article[]> => {
    const rows = await neonFetch(`/articles?select=id,title,excerpt,content,image_url,category,date&order=date.desc`);
    const articles = (rows as any[]).map((r) => ({ ...r, imageUrl: r.image_url }));
    return articles;
};

export const getFounders = async (): Promise<Founder[]> => {
    const rows = await neonFetch(`/founders?select=id,name,title,image_url&order=name.asc`);
    return (rows as any[]).map((r) => ({ ...r, imageUrl: r.image_url }));
}

export const addFounder = async (founderData: Omit<Founder, 'id'>) => {
    const payload: any = { ...founderData, image_url: (founderData as any).imageUrl };
    delete payload.imageUrl;
    await neonFetch(`/founders`, { method: 'POST', body: JSON.stringify(payload) });
};

export const updateFounder = async (id: string, founderData: Founder) => {
    const payload: any = { ...founderData, image_url: (founderData as any).imageUrl };
    delete payload.id;
    delete payload.imageUrl;
    await neonFetch(`/founders?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
};

export const deleteFounder = async (id: string) => {
    await neonFetch(`/founders?id=eq.${id}`, { method: 'DELETE' });
};

export const seedDefaultBureau = async () => {
    const existing = await neonFetch(`/founders?select=id`);
    if (Array.isArray(existing) && existing.length > 0) return; // already has data
    const payload = [
        { id: 'fnd_presidente', name: 'Dona Pascale EYANG NDONG', title: 'Présidente', image_url: '' },
        { id: 'fnd_sg', name: 'Arland Narcisse ELLA', title: 'Secrétaire Général', image_url: '' },
        { id: 'fnd_rp', name: 'Yann TANDA', title: 'Relations Publiques', image_url: '' },
        { id: 'fnd_tresor', name: 'Vanessa IDIATA', title: 'Trésorerie', image_url: '' },
    ];
    await neonFetch(`/founders`, { method: 'POST', body: JSON.stringify(payload) });
};

export const getPartners = async (): Promise<Partner[]> => {
    const rows = await neonFetch(`/partners?select=id,name,logo_url&order=name.asc`);
    return (rows as any[]).map((r) => ({ ...r, logoUrl: r.logo_url }));
}

export const getSettings = async (): Promise<SiteSettings | null> => {
    const rows = await neonFetch(`/settings?id=eq.1&select=id,email,phone,address`);
    return (rows as any[])[0] || null;
}

// --- Admin Data Fetchers ---
export const getFullMembersData = async (): Promise<FullMemberData[]> => {
    const rows = await neonFetch(`/full_members_data?select=id,name,gender,email,phone,age_range,nationality,city,association,category,revenue&order=name.asc`);
    return (rows as any[]).map((r) => ({
        id: r.id,
        name: r.name,
        gender: r.gender,
        email: r.email,
        phone: r.phone,
        ageRange: r.age_range,
        nationality: r.nationality,
        city: r.city,
        association: r.association,
        category: r.category,
        revenue: r.revenue,
    }));
}

export const getFullMemberById = async (id: string): Promise<FullMemberData | null> => {
    const rows = await neonFetch(`/full_members_data?id=eq.${id}&select=id,name,gender,email,phone,age_range,nationality,city,association,category,revenue`);
    const r = (rows as any[])[0];
    return r
      ? {
            id: r.id,
            name: r.name,
            gender: r.gender,
            email: r.email,
            phone: r.phone,
            ageRange: r.age_range,
            nationality: r.nationality,
            city: r.city,
            association: r.association,
            category: r.category,
            revenue: r.revenue,
        }
      : null;
};

// --- Admin CRUD Operations: Articles ---
export const addArticle = async (articleData: Omit<Article, 'id'>) => {
    const payload = { ...articleData, image_url: (articleData as any).imageUrl };
    delete (payload as any).imageUrl;
    await neonFetch(`/articles`, { method: 'POST', body: JSON.stringify(payload) });
};

export const updateArticle = async (id: string, articleData: Article) => {
    const payload = { ...articleData, image_url: (articleData as any).imageUrl };
    delete (payload as any).id;
    delete (payload as any).imageUrl;
    await neonFetch(`/articles?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
};

export const deleteArticle = async (id: string) => {
    await neonFetch(`/articles?id=eq.${id}`, { method: 'DELETE' });
};

// --- Admin CRUD Operations: Events ---
export const addEvent = async (eventData: Omit<Event, 'id'>) => {
    const payload = { ...eventData, image_url: (eventData as any).imageUrl };
    delete (payload as any).imageUrl;
    await neonFetch(`/events`, { method: 'POST', body: JSON.stringify(payload) });
};

export const updateEvent = async (id: string, eventData: Event) => {
    const payload = { ...eventData, image_url: (eventData as any).imageUrl };
    delete (payload as any).id;
    delete (payload as any).imageUrl;
    await neonFetch(`/events?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
};

export const deleteEvent = async (id: string) => {
    await neonFetch(`/events?id=eq.${id}`, { method: 'DELETE' });
};

// --- Admin CRUD Operations: Partners ---
export const addPartner = async (partnerData: Omit<Partner, 'id'>) => {
    const payload = { ...partnerData, logo_url: (partnerData as any).logoUrl };
    delete (payload as any).logoUrl;
    await neonFetch(`/partners`, { method: 'POST', body: JSON.stringify(payload) });
};

export const updatePartner = async (id: string, partnerData: Partner) => {
    const payload = { ...partnerData, logo_url: (partnerData as any).logoUrl };
    delete (payload as any).id;
    delete (payload as any).logoUrl;
    await neonFetch(`/partners?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
};

export const deletePartner = async (id: string) => {
    await neonFetch(`/partners?id=eq.${id}`, { method: 'DELETE' });
};

// --- Admin Operations: Settings ---
export const updateSettings = async (settingsData: SiteSettings) => {
    await neonFetch(`/settings?id=eq.1`, { method: 'PATCH', body: JSON.stringify(settingsData) });
};

// --- Database Seeding ---
export const seedDatabase = async () => {
    console.warn('seedDatabase is not supported on the client (Neon).');
};


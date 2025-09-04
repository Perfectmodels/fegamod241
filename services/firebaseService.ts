import { Member, Event, Article, Founder, Partner, FullMemberData, SiteSettings } from '../types';
import { getAuthToken } from './authService';
import { 
    MOCK_MEMBERS, 
    MOCK_EVENTS, 
    MOCK_ARTICLES, 
    MOCK_FOUNDERS, 
    MOCK_PARTNERS,
    MOCK_FULL_MEMBER_DATA,
    MOCK_SETTINGS
} from './seed-data';

const DATABASE_URL = 'https://dbfegamod-default-rtdb.firebaseio.com/';

const firebaseFetch = async (path: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const url = new URL(`${DATABASE_URL}${path}`);
    if (token) {
        url.searchParams.append('auth', token);
    }

    const response = await fetch(url.toString(), options);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
        console.error('Firebase request failed:', errorData);
        throw new Error(`Firebase request failed: ${errorData.error || 'Unauthorized'}`);
    }
    if (response.status === 204) {
        return null;
    }
    return response.json();
};

const transformFirebaseData = <T extends { id: string }>(data: any): T[] => {
    if (!data || typeof data !== 'object') return [];
    return Object.keys(data).map(key => ({
        ...data[key],
        id: key,
    }));
};

// --- Public Data Fetchers ---
export const getMembers = async (): Promise<Member[]> => {
    const data = await firebaseFetch('public/members.json');
    return transformFirebaseData<Member>(data);
}

export const getMemberById = async (id: string): Promise<Member | null> => {
     return await firebaseFetch(`public/members/${id}.json`);
};

export const getEvents = async (): Promise<Event[]> => {
    const data = await firebaseFetch('public/events.json');
    return transformFirebaseData<Event>(data);
}

export const getArticles = async (): Promise<Article[]> => {
    const data = await firebaseFetch('public/articles.json');
    const articles = transformFirebaseData<Article>(data);
    if (!articles) return [];
    
    return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};


export const getFounders = async (): Promise<Founder[]> => {
    const data = await firebaseFetch('public/founders.json');
    return transformFirebaseData<Founder>(data);
}

export const getPartners = async (): Promise<Partner[]> => {
    const data = await firebaseFetch('public/partners.json');
    return transformFirebaseData<Partner>(data);
}

export const getSettings = async (): Promise<SiteSettings | null> => {
    return await firebaseFetch('public/settings.json');
}

// --- Admin Data Fetchers ---
export const getFullMembersData = async (): Promise<FullMemberData[]> => {
    const data = await firebaseFetch('public/fullMembersData.json');
    return transformFirebaseData<FullMemberData>(data);
}

export const getFullMemberById = async (id: string): Promise<FullMemberData | null> => {
    return await firebaseFetch(`public/fullMembersData/${id}.json`);
};

// --- Admin CRUD Operations: Articles ---
export const addArticle = async (articleData: Omit<Article, 'id'>) => {
    return await firebaseFetch('public/articles.json', {
        method: 'POST',
        body: JSON.stringify(articleData),
    });
};

export const updateArticle = async (id: string, articleData: Article) => {
    const dataToUpdate = { ...articleData };
    delete (dataToUpdate as any).id;
    return await firebaseFetch(`public/articles/${id}.json`, {
        method: 'PUT',
        body: JSON.stringify(dataToUpdate),
    });
};

export const deleteArticle = async (id: string) => {
    return await firebaseFetch(`public/articles/${id}.json`, { method: 'DELETE' });
};

// --- Admin CRUD Operations: Events ---
export const addEvent = async (eventData: Omit<Event, 'id'>) => {
    return await firebaseFetch('public/events.json', {
        method: 'POST',
        body: JSON.stringify(eventData),
    });
};

export const updateEvent = async (id: string, eventData: Event) => {
    const dataToUpdate = { ...eventData };
    delete (dataToUpdate as any).id;
    return await firebaseFetch(`public/events/${id}.json`, {
        method: 'PUT',
        body: JSON.stringify(dataToUpdate),
    });
};

export const deleteEvent = async (id: string) => {
    return await firebaseFetch(`public/events/${id}.json`, { method: 'DELETE' });
};

// --- Admin CRUD Operations: Partners ---
export const addPartner = async (partnerData: Omit<Partner, 'id'>) => {
    return await firebaseFetch('public/partners.json', {
        method: 'POST',
        body: JSON.stringify(partnerData),
    });
};

export const updatePartner = async (id: string, partnerData: Partner) => {
    const dataToUpdate = { ...partnerData };
    delete (dataToUpdate as any).id;
    return await firebaseFetch(`public/partners/${id}.json`, {
        method: 'PUT',
        body: JSON.stringify(dataToUpdate),
    });
};

export const deletePartner = async (id: string) => {
    return await firebaseFetch(`public/partners/${id}.json`, { method: 'DELETE' });
};

// --- Admin Operations: Settings ---
export const updateSettings = async (settingsData: SiteSettings) => {
    return await firebaseFetch('public/settings.json', {
        method: 'PUT',
        body: JSON.stringify(settingsData),
    });
};


// --- Database Seeding ---
export const seedDatabase = async () => {
    const dataToSeed = {
        members: MOCK_MEMBERS,
        fullMembersData: MOCK_FULL_MEMBER_DATA,
        events: MOCK_EVENTS,
        articles: MOCK_ARTICLES,
        founders: MOCK_FOUNDERS,
        partners: MOCK_PARTNERS,
        settings: MOCK_SETTINGS,
    };

    // This will overwrite all data under the 'public' node
    return await firebaseFetch('public.json', {
        method: 'PUT',
        body: JSON.stringify(dataToSeed),
    });
};
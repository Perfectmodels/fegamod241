// FIX: This file was incorrectly a copy of App.tsx. It has been replaced with the correct type definitions for the application.
export interface SiteSettings {
    email: string;
    phone: string;
    address: string;
}

export interface Partner {
    id: string;
    name: string;
    logoUrl: string;
}

export interface Founder {
    id: string;
    name: string;
    title: string;
    imageUrl: string;
}

export interface Article {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    category: string;
    date: string;
}

export interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    description: string;
    imageUrl: string;
}

export interface Member {
    id: string;
    name: string;
    category: string;
    bio: string;
    imageUrl: string;
    socials?: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
    };
}

export interface FullMemberData {
    id: string;
    name: string;
    gender: string;
    email: string;
    phone: string;
    ageRange: string;
    nationality: string;
    city: string;
    association: string;
    category: string;
    revenue: string;
}

export interface AdminUser {
    uid: string;
    email: string;
    role: 'Admin' | 'Éditeur' | 'Aucun';
}
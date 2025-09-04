
export interface Member {
  id: number;
  name: string;
  category: string;
  bio: string;
  imageUrl: string;
  socials: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
}

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  date: string;
}

export interface Partner {
  id: number;
  name: string;
  logoUrl: string;
}

export interface Founder {
    id: number;
    name: string;
    title: string;
    imageUrl: string;
}
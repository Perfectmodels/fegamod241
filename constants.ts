import { MOCK_GALLERY_IMAGES } from './gallery-constants';

export const NAV_LINKS = [
  { name: 'Accueil', path: '/' },
  { name: 'À propos', path: '/a-propos' },
  { name: 'Membres', path: '/membres' },
  { name: 'Événements', path: '/evenements' },
  { name: 'Actualités', path: '/actualites' },
  { name: 'Partenaires', path: '/partenaires' },
  { name: 'Galerie', path: '/galerie' },
  { name: 'Contact', path: '/contact' },
];

// Placeholder images for components that might need them before data loads
export const PLACEHOLDER_IMAGES = {
    event1: MOCK_GALLERY_IMAGES[6],
    event2: MOCK_GALLERY_IMAGES[7],
    event3: MOCK_GALLERY_IMAGES[8],
    article1: MOCK_GALLERY_IMAGES[9],
    article2: MOCK_GALLERY_IMAGES[10],
    article3: MOCK_GALLERY_IMAGES[11],
    founder1: MOCK_GALLERY_IMAGES[12],
    founder2: MOCK_GALLERY_IMAGES[13],
    founder4: MOCK_GALLERY_IMAGES[14],
};
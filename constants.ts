import { Member, Event, Article, Partner, Founder } from './types';
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

export const MOCK_MEMBERS: Member[] = [
  { id: 1, name: 'Grace Boungou', category: 'Styliste', bio: 'Créatrice visionnaire fusionnant tradition et modernité.', imageUrl: MOCK_GALLERY_IMAGES[0], socials: { instagram: '#' } },
  { id: 2, name: 'Jean-Luc Mpaga', category: 'Mannequin', bio: 'Visage emblématique des podiums internationaux.', imageUrl: MOCK_GALLERY_IMAGES[1], socials: { instagram: '#', facebook: '#' } },
  { id: 3, name: 'Amina Diallo', category: 'Créatrice de bijoux', bio: 'Artisane de l\'élégance, ses pièces racontent une histoire.', imageUrl: MOCK_GALLERY_IMAGES[2], socials: { twitter: '#' } },
  { id: 4, name: 'Kevin Nguema', category: 'Photographe de mode', bio: 'Capture l\'essence de la mode gabonaise avec un œil unique.', imageUrl: MOCK_GALLERY_IMAGES[3], socials: { instagram: '#', twitter: '#' } },
  { id: 5, name: 'Sarah Bongo', category: 'Styliste', bio: 'Spécialiste du prêt-à-porter de luxe aux inspirations locales.', imageUrl: MOCK_GALLERY_IMAGES[4], socials: { facebook: '#' } },
  { id: 6, name: 'Didier Obiang', category: 'Mannequin', bio: 'Charisme et prestance au service des plus grandes marques.', imageUrl: MOCK_GALLERY_IMAGES[5], socials: { instagram: '#' } },
];

export const MOCK_EVENTS: Event[] = [
  { id: 1, title: 'Libreville Fashion Week', date: '22-25 NOV 2024', location: 'Radisson Blu, Libreville', description: 'Le rendez-vous incontournable de la mode gabonaise.', imageUrl: MOCK_GALLERY_IMAGES[6] },
  { id: 2, title: 'Workshop: De la création à la commercialisation', date: '15 OCT 2024', location: 'Institut Français, Libreville', description: 'Apprenez les clés du succès pour votre marque de mode.', imageUrl: MOCK_GALLERY_IMAGES[7] },
  { id: 3, title: 'Salon des Créateurs Émergents', date: '05 DÉC 2024', location: 'Jardin Botanique, Libreville', description: 'Découvrez les talents de demain et leurs créations uniques.', imageUrl: MOCK_GALLERY_IMAGES[8] },
];

export const MOCK_ARTICLES: Article[] = [
  { id: 1, title: 'Tendance 2024: Le retour du pagne tissé', excerpt: 'Explorez comment les designers gabonais réinventent cet héritage textile avec audace et modernité.', content: '<p>Explorez comment les designers gabonais réinventent cet héritage textile avec audace et modernité.</p>', imageUrl: MOCK_GALLERY_IMAGES[9], category: 'Tendances', date: '12 JUIL 2024' },
  { id: 2, title: 'Interview avec Franck Evina, icône de la mode', excerpt: 'Le fondateur de la marque "Racines" partage son parcours inspirant et sa vision pour l\'avenir de la mode africaine.', content: '<p>Le fondateur de la marque "Racines" partage son parcours inspirant et sa vision pour l\'avenir de la mode africaine.</p>', imageUrl: MOCK_GALLERY_IMAGES[10], category: 'Interviews', date: '08 JUIL 2024' },
  { id: 3, title: 'FEGAMOD annonce ses nouveaux partenariats', excerpt: 'La fédération s\'associe à des acteurs majeurs pour renforcer le soutien aux créateurs locaux et leur visibilité.', content: '<p>La fédération s\'associe à des acteurs majeurs pour renforcer le soutien aux créateurs locaux et leur visibilité.</p>', imageUrl: MOCK_GALLERY_IMAGES[11], category: 'Communiqués', date: '01 JUIL 2024' },
];

export const MOCK_FOUNDERS: Founder[] = [
    { id: 1, name: 'Ali Bongo Ondimba', title: 'Président d\'Honneur', imageUrl: MOCK_GALLERY_IMAGES[12] },
    { id: 2, name: 'Sylvia Bongo Ondimba', title: 'Marraine de la FEGAMOD', imageUrl: MOCK_GALLERY_IMAGES[13] },
    { id: 3, name: 'Franck Sima', title: 'Président', imageUrl: 'https://scontent.flbv4-1.fna.fbcdn.net/v/t39.30808-6/473677977_9128296503952662_8897451079006998067_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeF15cwlhZa3g07xq8eJZJn_0kSjya3bNOHSRKPJrds04ShhLQu6TtldL5jFLqDcu7ESrlXo6BRF8_GsYUW-19SI&_nc_ohc=YqYKcRYF5DAQ7kNvwHWSaUe&_nc_oc=Adned4RCPgvNp4Q5mvomLWNxgz2jSsDHSMXjFHVXZYcxS6lOSlxFdEbJXvHsH700q30&_nc_zt=23&_nc_ht=scontent.flbv4-1.fna&_nc_gid=tAF9UE47VMF8_0c2QO1M2g&oh=00_AfYfSzd3BQt0PGZwDFqjM-hYsZviBMMzICyf6U-AtKE1yA&oe=68BECA2C' },
    { id: 4, name: 'Jessica Moubamba', title: 'Vice-Présidente', imageUrl: MOCK_GALLERY_IMAGES[14] },
];

export const MOCK_PARTNERS: Partner[] = [
  { id: 1, name: 'Gabon Telecom', logoUrl: MOCK_GALLERY_IMAGES[15] },
  { id: 2, name: 'Airtel Gabon', logoUrl: MOCK_GALLERY_IMAGES[16] },
  { id: 3, name: 'BGFI Bank', logoUrl: MOCK_GALLERY_IMAGES[17] },
  { id: 4, name: 'Ministère de la Culture', logoUrl: MOCK_GALLERY_IMAGES[18] },
  { id: 5, name: 'Institut Français', logoUrl: MOCK_GALLERY_IMAGES[19] },
];
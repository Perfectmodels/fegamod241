import React from 'react';

export const AdminMediaPage: React.FC = () => (
    <div>
        <h1 className="font-serif text-4xl font-bold text-deep-black mb-8">Médiathèque</h1>
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-deep-black">Gestion des Médias</h2>
            <p className="mt-2 text-gray-600">Uploadez et gérez les images et vidéos pour la galerie et les articles.</p>
        </div>
    </div>
);

export const AdminPartnersPage: React.FC = () => (
     <div>
        <h1 className="font-serif text-4xl font-bold text-deep-black mb-8">Gestion des Partenaires</h1>
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-deep-black">Gestion des Partenaires et Sponsors</h2>
            <p className="mt-2 text-gray-600">Ajoutez, modifiez ou supprimez les logos et informations des partenaires.</p>
        </div>
    </div>
);

export const AdminUsersPage: React.FC = () => (
     <div>
        <h1 className="font-serif text-4xl font-bold text-deep-black mb-8">Gestion des Utilisateurs</h1>
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-deep-black">Gestion des Rôles et Accès</h2>
            <p className="mt-2 text-gray-600">Gérez les comptes administrateurs et leurs permissions.</p>
        </div>
    </div>
);

export const AdminSettingsPage: React.FC = () => (
    <div>
        <h1 className="font-serif text-4xl font-bold text-deep-black mb-8">Paramètres du Site</h1>
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-deep-black">Configurations Générales</h2>
            <p className="mt-2 text-gray-600">Modifiez les informations de contact, les menus et autres configurations du site.</p>
        </div>
    </div>
);

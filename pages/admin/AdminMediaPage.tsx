import React from 'react';
import { MOCK_GALLERY_IMAGES } from '../../gallery-constants';

const AdminMediaPage: React.FC = () => (
    <div>
        <h1 className="font-serif text-4xl font-bold text-deep-black mb-8">Médiathèque</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-deep-black">Aperçu de la Galerie</h2>
                 <button className="px-4 py-2 bg-emerald text-white font-semibold rounded-md hover:bg-emerald/90 transition-colors" disabled>
                    Uploader une image
                </button>
            </div>
            <p className="mb-6 text-gray-600">
                Voici les images actuellement affichées sur la page galerie du site. Pour une gestion dynamique (ajout/suppression), l'intégration d'un service de stockage de fichiers comme Firebase Storage est nécessaire.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {MOCK_GALLERY_IMAGES.map((src, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img src={src} alt={`Galerie ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default AdminMediaPage;
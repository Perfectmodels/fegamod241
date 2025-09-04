import React from 'react';

const AdminNewsPage: React.FC = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-4xl font-bold text-deep-black">Gestion des Actualités</h1>
                <button className="px-4 py-2 bg-emerald text-white font-semibold rounded-md hover:bg-emerald/90 transition-colors">
                    Rédiger un article
                </button>
            </div>
            <p className="text-gray-600 mb-8">Gérez les articles du blog, les interviews et les communiqués de presse.</p>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-center text-gray-500">L'interface de gestion des articles sera affichée ici, avec un éditeur de texte riche et des options de publication.</p>
            </div>
        </div>
    );
};

export default AdminNewsPage;

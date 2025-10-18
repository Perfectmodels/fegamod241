import React from 'react';
import { usePartners, useArticles, useCurrentUserRole } from '../../services/convexService';
import Loading from '../../components/Loading';

const RelationsPubliquesDashboard: React.FC = () => {
    const partners = usePartners();
    const articles = useArticles();
    const role = useCurrentUserRole();

    if (role === undefined) {
        return <Loading message="Vérification des permissions..." />;
    }

    if (role !== 'Relations Publiques') {
        return <p className="text-red-500">Accès refusé. Vous n'avez pas les permissions nécessaires.</p>;
    }

    if (partners === undefined || articles === undefined) {
        return <Loading message="Chargement du tableau de bord..." />;
    }

    return (
        <div>
            <h1 className="font-serif text-4xl font-bold text-deep-black mb-8">Tableau de Bord - Relations Publiques</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="font-serif text-xl font-bold mb-4">Partenaires</h2>
                    <p className="text-2xl font-bold text-emerald">{partners.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="font-serif text-xl font-bold mb-4">Articles</h2>
                    <p className="text-2xl font-bold text-emerald">{articles.length}</p>
                </div>
            </div>
        </div>
    );
};

export default RelationsPubliquesDashboard;

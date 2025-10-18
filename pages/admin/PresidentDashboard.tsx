import React from 'react';
import { useMembers, useEvents, useArticles, useCurrentUserRole } from '../../services/convexService';
import Loading from '../../components/Loading';

const PresidentDashboard: React.FC = () => {
    const members = useMembers();
    const events = useEvents();
    const articles = useArticles();
    const role = useCurrentUserRole();

    if (role === undefined) {
        return <Loading message="Vérification des permissions..." />;
    }

    if (role !== 'Présidente') {
        return <p className="text-red-500">Accès refusé. Vous n'avez pas les permissions nécessaires.</p>;
    }

    if (members === undefined || events === undefined || articles === undefined) {
        return <Loading message="Chargement du tableau de bord..." />;
    }

    return (
        <div>
            <h1 className="font-serif text-4xl font-bold text-deep-black mb-8">Tableau de Bord - Présidente</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="font-serif text-xl font-bold mb-4">Membres</h2>
                    <p className="text-2xl font-bold text-emerald">{members.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="font-serif text-xl font-bold mb-4">Événements</h2>
                    <p className="text-2xl font-bold text-emerald">{events.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="font-serif text-xl font-bold mb-4">Articles</h2>
                    <p className="text-2xl font-bold text-emerald">{articles.length}</p>
                </div>
            </div>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="font-serif text-xl font-bold mb-4">Rapport Général</h2>
                <p>Gestion complète de la fédération.</p>
            </div>
        </div>
    );
};

export default PresidentDashboard;

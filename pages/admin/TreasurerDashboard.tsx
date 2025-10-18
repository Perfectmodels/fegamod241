import React from 'react';
import { useMembers, useCurrentUserRole } from '../../services/convexService';
import Loading from '../../components/Loading';

const TreasurerDashboard: React.FC = () => {
    const members = useMembers();
    const role = useCurrentUserRole();

    if (role === undefined) {
        return <Loading message="Vérification des permissions..." />;
    }

    if (role !== 'Trésorerie') {
        return <p className="text-red-500">Accès refusé. Vous n'avez pas les permissions nécessaires.</p>;
    }

    if (members === undefined) {
        return <Loading message="Chargement du tableau de bord..." />;
    }

    const revenueStats = members.reduce((acc, member) => {
        acc[member.revenue] = (acc[member.revenue] || 0) + 1;
        return acc;
    }, {});

    return (
        <div>
            <h1 className="font-serif text-4xl font-bold text-deep-black mb-8">Tableau de Bord - Trésorerie</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="font-serif text-xl font-bold mb-4">Rapport Financier</h2>
                <p>Total Membres: {members.length}</p>
                <p>Revenus: {JSON.stringify(revenueStats)}</p>
            </div>
        </div>
    );
};

export default TreasurerDashboard;

import React from 'react';
import { useEvents, useAddEvent, useUpdateEvent, useDeleteEvent, useCurrentUserRole } from '../../services/convexService';
import Loading from '../../components/Loading';

const SecretaryGeneralDashboard: React.FC = () => {
    const events = useEvents();
    const addEvent = useAddEvent();
    const updateEvent = useUpdateEvent();
    const deleteEvent = useDeleteEvent();
    const role = useCurrentUserRole();

    if (role === undefined) {
        return <Loading message="Vérification des permissions..." />;
    }

    if (role !== 'Secrétaire Général') {
        return <p className="text-red-500">Accès refusé. Vous n'avez pas les permissions nécessaires.</p>;
    }

    if (events === undefined) {
        return <Loading message="Chargement du tableau de bord..." />;
    }

    return (
        <div>
            <h1 className="font-serif text-4xl font-bold text-deep-black mb-8">Tableau de Bord - Secrétaire Général</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="font-serif text-xl font-bold mb-4">Gestion des Événements</h2>
                <p>Nombre d'événements: {events.length}</p>
                {/* Add form for events */}
            </div>
        </div>
    );
};

export default SecretaryGeneralDashboard;

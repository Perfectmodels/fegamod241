import React from 'react';
import { MOCK_EVENTS } from '../../constants';

const AdminEventsPage: React.FC = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-4xl font-bold text-deep-black">Gestion des Événements</h1>
                <button className="px-4 py-2 bg-emerald text-white font-semibold rounded-md hover:bg-emerald/90 transition-colors">
                    Créer un Événement
                </button>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-gray-200">
                            <tr>
                                <th className="p-3 text-sm font-semibold tracking-wide">Titre</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Date</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Lieu</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_EVENTS.map(event => (
                                <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-3 font-bold">{event.title}</td>
                                    <td className="p-3 text-gray-700">{event.date}</td>
                                    <td className="p-3 text-gray-700">{event.location}</td>
                                    <td className="p-3">
                                        <div className="flex space-x-2">
                                            <button className="text-gray-500 hover:text-emerald">Éditer</button>
                                            <button className="text-gray-500 hover:text-red-600">Supprimer</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminEventsPage;

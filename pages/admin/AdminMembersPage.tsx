import React from 'react';
import { FULL_MEMBER_DATA } from './member-data';

const AdminMembersPage: React.FC = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-4xl font-bold text-deep-black">Gestion des Membres</h1>
                <button className="px-4 py-2 bg-emerald text-white font-semibold rounded-md hover:bg-emerald/90 transition-colors">
                    Ajouter un Membre
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-gray-200">
                            <tr>
                                <th className="p-3 text-sm font-semibold tracking-wide">Nom</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Catégorie</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Ville</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Tranche d'âge</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Revenu Annuel</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {FULL_MEMBER_DATA.map((member, index) => (
                                <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-3">
                                        <span className="font-bold">{member.name}</span>
                                    </td>
                                    <td className="p-3 text-gray-700">{member.category}</td>
                                    <td className="p-3 text-gray-700">{member.city}</td>
                                     <td className="p-3 text-gray-700">{member.ageRange}</td>
                                     <td className="p-3 text-gray-700">{member.revenue}</td>
                                    <td className="p-3">
                                        <div className="flex space-x-2">
                                            <button className="text-gray-500 hover:text-emerald text-sm">Voir</button>
                                            <button className="text-gray-500 hover:text-red-600 text-sm">Supprimer</button>
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

export default AdminMembersPage;
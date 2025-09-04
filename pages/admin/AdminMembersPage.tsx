import React from 'react';
import { MOCK_MEMBERS } from '../../constants';

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
                                <th className="p-3 text-sm font-semibold tracking-wide">Statut</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_MEMBERS.map((member, index) => (
                                <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-3">
                                        <div className="flex items-center space-x-3">
                                            <img src={member.imageUrl} alt={member.name} className="w-10 h-10 rounded-full object-cover"/>
                                            <span className="font-bold">{member.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-3 text-gray-700">{member.category}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${index % 2 === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {index % 2 === 0 ? 'Approuvé' : 'En attente'}
                                        </span>
                                    </td>
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

export default AdminMembersPage;

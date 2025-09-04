import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFullMembersData } from '../../services/firebaseService';
import { FullMemberData } from '../../types';
import Loading from '../../components/Loading';

const AdminMembersPage: React.FC = () => {
    const [members, setMembers] = useState<FullMemberData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getFullMembersData();
                setMembers(data);
            } catch (err) {
                setError("Impossible de charger la liste des membres.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-4xl font-bold text-deep-black">Gestion des Membres</h1>
                <button className="px-4 py-2 bg-emerald text-white font-semibold rounded-md hover:bg-emerald/90 transition-colors">
                    Ajouter un Membre
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                {loading ? (
                    <Loading message="Chargement des membres..." />
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
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
                                {members.map((member) => (
                                    <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-3">
                                            <span className="font-bold">{member.name}</span>
                                        </td>
                                        <td className="p-3 text-gray-700">{member.category}</td>
                                        <td className="p-3 text-gray-700">{member.city}</td>
                                        <td className="p-3 text-gray-700">{member.ageRange}</td>
                                        <td className="p-3 text-gray-700">{member.revenue}</td>
                                        <td className="p-3">
                                            <div className="flex space-x-4">
                                                <Link to={`/admin/members/${member.id}`} className="text-gray-500 hover:text-emerald text-sm font-semibold">Voir</Link>
                                                <button className="text-gray-500 hover:text-red-600 text-sm font-semibold">Supprimer</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMembersPage;
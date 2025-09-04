import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFullMemberById } from '../../services/firebaseService';
import { FullMemberData } from '../../types';
import Loading from '../../components/Loading';

const DetailItem: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || 'N/A'}</dd>
    </div>
);

const AdminMemberDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [member, setMember] = useState<FullMemberData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const loadMember = async () => {
                try {
                    const data = await getFullMemberById(id);
                    setMember(data);
                } catch (err) {
                    setError("Impossible de trouver ce membre.");
                } finally {
                    setLoading(false);
                }
            };
            loadMember();
        }
    }, [id]);

    if (loading) {
        return <Loading message="Chargement de la fiche membre..." />;
    }

    if (error || !member) {
        return (
            <div className="text-center">
                <h1 className="font-serif text-2xl font-bold text-red-600">{error || 'Membre non trouvé'}</h1>
                <Link to="/admin/members" className="mt-4 inline-block text-emerald hover:underline">
                    Retour à la liste des membres
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-4xl font-bold text-deep-black">Fiche Membre</h1>
                <Link to="/admin/members" className="flex items-center space-x-2 text-gray-600 hover:text-emerald transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Retour à la liste</span>
                </Link>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold font-serif text-deep-black">{member.name}</h2>
                            <p className="text-md text-emerald font-semibold">{member.category}</p>
                        </div>
                        <div className="flex space-x-2">
                             <button className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors text-sm">
                                Modifier
                            </button>
                             <button className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-md hover:bg-red-200 transition-colors text-sm">
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <dl className="divide-y divide-gray-200">
                        <DetailItem label="Email" value={member.email} />
                        <DetailItem label="Téléphone" value={member.phone} />
                        <DetailItem label="Genre" value={member.gender} />
                        <DetailItem label="Tranche d'âge" value={member.ageRange} />
                        <DetailItem label="Nationalité" value={member.nationality} />
                        <DetailItem label="Ville de résidence" value={member.city} />
                        <DetailItem label="Association / Structure" value={member.association} />
                        <DetailItem label="Revenu Annuel Estimé (FCFA)" value={member.revenue} />
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default AdminMemberDetailPage;
import React, { useState, useEffect, useCallback } from 'react';
import { usePartners, useAddPartner, useUpdatePartner, useDeletePartner } from '../../services/convexService';
import { Partner } from '../../types';
import Loading from '../../components/Loading';
import AdminModal from '../../components/admin/AdminModal';

const AdminPartnersPage: React.FC = () => {
    const partners = usePartners();
    const addPartner = useAddPartner();
    const updatePartner = useUpdatePartner();
    const deletePartner = useDeletePartner();
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPartner, setCurrentPartner] = useState<Omit<Partner, 'id'> | Partner | null>(null);

    const fetchPartners = useCallback(async () => {
        // Partners are now handled by the usePartners hook
    }, []);

    useEffect(() => {
        fetchPartners();
    }, [fetchPartners]);

    const openModal = (partner: Omit<Partner, 'id'> | Partner | null = null) => {
        if (partner) {
            setCurrentPartner(partner);
        } else {
            setCurrentPartner({ name: '', logoUrl: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentPartner(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!currentPartner) return;
        const { name, value } = e.target;
        setCurrentPartner({ ...currentPartner, [name]: value });
    };

    const handleSave = async () => {
        if (!currentPartner) return;
        try {
            if ('id' in currentPartner) {
                await updatePartner({ id: currentPartner.id, ...currentPartner });
            } else {
                await addPartner(currentPartner);
            }
            closeModal();
        } catch (err) {
            alert("Erreur lors de l'enregistrement du partenaire.");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce partenaire?")) {
            try {
                await deletePartner(id);
            } catch (err) {
                alert("Erreur lors de la suppression du partenaire.");
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-4xl font-bold text-deep-black">Gestion des Partenaires</h1>
                <button onClick={() => openModal()} className="px-4 py-2 bg-emerald text-white font-semibold rounded-md hover:bg-emerald/90 transition-colors">
                    Ajouter un Partenaire
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {partners ? (
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-gray-200">
                            <tr>
                                <th className="p-3 text-sm font-semibold tracking-wide">Logo</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Nom</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partners.map(partner => (
                                <tr key={partner.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-3">
                                        <img src={partner.logoUrl} alt={partner.name} className="h-10 w-24 object-contain" />
                                    </td>
                                    <td className="p-3 font-bold">{partner.name}</td>
                                    <td className="p-3">
                                        <div className="flex space-x-4">
                                            <button onClick={() => openModal(partner)} className="text-gray-500 hover:text-emerald font-semibold">Éditer</button>
                                            <button onClick={() => handleDelete(partner.id)} className="text-gray-500 hover:text-red-600 font-semibold">Supprimer</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <Loading message="Chargement..." />
                )}
            </div>
            
            <AdminModal isOpen={isModalOpen} onClose={closeModal} title={currentPartner && 'id' in currentPartner ? 'Modifier le Partenaire' : 'Ajouter un Partenaire'}>
                {currentPartner && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du partenaire</label>
                            <input type="text" name="name" value={currentPartner.name} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL du logo</label>
                            <input type="text" name="logoUrl" value={currentPartner.logoUrl} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div className="flex justify-end space-x-4 pt-4">
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400 transition-colors">Annuler</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-emerald text-white font-semibold rounded-md hover:bg-emerald/90 transition-colors">Enregistrer</button>
                        </div>
                    </div>
                )}
            </AdminModal>
        </div>
    );
};

export default AdminPartnersPage;
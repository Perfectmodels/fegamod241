import React, { useState, useEffect, useCallback } from 'react';
import { useEvents, useAddEvent, useUpdateEvent, useDeleteEvent } from '../../services/convexService';
import { Event } from '../../types';
import Loading from '../../components/Loading';
import AdminModal from '../../components/admin/AdminModal';

const AdminEventsPage: React.FC = () => {
    const events = useEvents();
    const addEvent = useAddEvent();
    const updateEvent = useUpdateEvent();
    const deleteEvent = useDeleteEvent();
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<Omit<Event, 'id'> | Event | null>(null);

    const fetchEvents = useCallback(async () => {
        // Events are now handled by the useEvents hook
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const openModal = (event: Omit<Event, 'id'> | Event | null = null) => {
        if (event) {
            setCurrentEvent(event);
        } else {
            setCurrentEvent({
                title: '',
                date: '',
                location: '',
                description: '',
                imageUrl: 'https://scontent.flbv4-1.fna.fbcdn.net/v/t39.30808-6/489381885_1213327847460237_8920034819320699571_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGxwK5FVkHl1_y81R1gf5bEE6ufwKSbD-sTq5_ApJsP69LBzf29JHUqS5l014hwyy578S9k8SfdctDbRlOStJQD&_nc_ohc=nB3CXxs00JoQ7kNvwGMa4Fs&nc_oc=AdmCUba0DblxbS4Z1GqLZtxiC574V_QOCPlP4o6I1ZpA2jcbR8O0_j4sidMndGsJ6nE&nc_zt=23&_nc_ht=scontent.flbv4-1.fna&_nc_gid=35f6JIFPKnx4AGV_h4GM4A&oh=00_AfYFWLspFBAvoJGTQWTQjv5rjDw7ckTOP67EHabo7cyQMg&oe=68BECC75'
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentEvent(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!currentEvent) return;
        const { name, value } = e.target;
        setCurrentEvent({ ...currentEvent, [name]: value });
    };

    const handleSave = async () => {
        if (!currentEvent) return;
        try {
            if ('id' in currentEvent) {
                await updateEvent({ id: currentEvent.id, ...currentEvent });
            } else {
                await addEvent(currentEvent);
            }
            closeModal();
        } catch (err) {
            alert("Erreur lors de l'enregistrement de l'événement.");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement?")) {
            try {
                await deleteEvent(id);
            } catch (err) {
                alert("Erreur lors de la suppression de l'événement.");
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-4xl font-bold text-deep-black">Gestion des Événements</h1>
                <button onClick={() => openModal()} className="px-4 py-2 bg-emerald text-white font-semibold rounded-md hover:bg-emerald/90 transition-colors">
                    Créer un Événement
                </button>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md">
                {events ? (
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
                                {events.map(event => (
                                    <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-3 font-bold">{event.title}</td>
                                        <td className="p-3 text-gray-700">{event.date}</td>
                                        <td className="p-3 text-gray-700">{event.location}</td>
                                        <td className="p-3">
                                            <div className="flex space-x-4">
                                                <button onClick={() => openModal(event)} className="text-gray-500 hover:text-emerald font-semibold">Éditer</button>
                                                <button onClick={() => handleDelete(event.id)} className="text-gray-500 hover:text-red-600 font-semibold">Supprimer</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <Loading message="Chargement..." />
                )}
            </div>
            
            <AdminModal isOpen={isModalOpen} onClose={closeModal} title={currentEvent && 'id' in currentEvent ? 'Modifier l\'Événement' : 'Créer un Événement'}>
                {currentEvent && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                            <input type="text" name="title" value={currentEvent.title} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date (ex: 15-18 DÉC 2024)</label>
                            <input type="text" name="date" value={currentEvent.date} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                            <input type="text" name="location" value={currentEvent.location} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea name="description" value={currentEvent.description} onChange={handleInputChange} rows={4} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input type="text" name="imageUrl" value={currentEvent.imageUrl} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
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

export default AdminEventsPage;
import React, { useState, useEffect, useCallback } from 'react';
import { createUserWithEmail, setUserRole, listUsers } from '../../services/authService';
import { AdminUser } from '../../types';
import Loading from '../../components/Loading';
import AdminModal from '../../components/admin/AdminModal';

const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // State for the new user form
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState<'Admin' | 'Éditeur'>('Éditeur');
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const userList = await listUsers();
            setUsers(userList);
            setError(null);
        } catch (err: any) {
            console.error(err);
            if (err.message.includes('permission-denied') || err.message.includes('non autoris')) {
                 setError("Accès non autorisé. Seuls les administrateurs peuvent voir la liste des utilisateurs.");
            } else {
                 setError("Impossible de charger la liste des utilisateurs. La Cloud Function 'listUsers' est peut-être manquante ou non déployée.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        // Reset form
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserRole('Éditeur');
        setFormError(null);
        setFormSuccess(null);
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError(null);
        setFormSuccess(null);

        if (newUserPassword.length < 6) {
            setFormError("Le mot de passe doit contenir au moins 6 caractères.");
            setIsSubmitting(false);
            return;
        }

        try {
            // Step 1: Create user in Firebase Auth
            await createUserWithEmail(newUserEmail, newUserPassword);
            
            // Step 2: Set user role via Cloud Function
            await setUserRole(newUserEmail, newUserRole);

            setFormSuccess(`Utilisateur ${newUserEmail} créé avec le rôle ${newUserRole}.`);
            await fetchUsers(); // Refresh the user list
            setTimeout(closeModal, 2000); // Close modal after 2s on success

        } catch (err: any) {
            console.error(err);
            if (err.message.includes("permission-denied")) {
                setFormError("Action non autorisée. Seul un administrateur peut assigner des rôles.");
            } else if (err.message.includes("EMAIL_EXISTS")) {
                setFormError("Cet email est déjà utilisé par un autre compte.");
            } else {
                 setFormError(err.message || "Une erreur est survenue. Assurez-vous que la Cloud Function 'setUserRole' est bien déployée.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-4xl font-bold text-deep-black">Gestion des Utilisateurs</h1>
                <button onClick={openModal} className="px-4 py-2 bg-emerald text-white font-semibold rounded-md hover:bg-emerald/90 transition-colors">
                    Créer un Utilisateur
                </button>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
                <div className="flex">
                    <div className="py-1">
                        <svg className="h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <div>
                        <p className="font-bold">Déploiement Backend Requis</p>
                        <p className="text-sm">Pour que la création d'utilisateurs et la gestion des rôles fonctionnent, vous devez déployer les **Cloud Functions** fournies dans votre projet Firebase. C'est l'unique manière sécurisée de gérer les permissions.</p>
                    </div>
                </div>
            </div>

             <div className="bg-white p-6 rounded-lg shadow-md">
                {loading ? (
                    <Loading message="Chargement des utilisateurs..." />
                ) : error ? (
                    <p className="text-center text-red-500 font-semibold p-4 bg-red-50 rounded-md">{error}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b-2 border-gray-200">
                                <tr>
                                    <th className="p-3 text-sm font-semibold tracking-wide">Email</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide">Rôle</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide">UID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.uid} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-3 font-semibold">{user.email}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'Admin' ? 'bg-emerald/20 text-emerald' : 'bg-gray-200 text-gray-700'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-3 text-gray-500 text-sm">{user.uid}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <AdminModal isOpen={isModalOpen} onClose={closeModal} title="Créer un nouvel utilisateur">
                <form onSubmit={handleCreateUser} className="space-y-4">
                    {formError && <p className="text-red-500 text-center font-semibold p-2 bg-red-50 rounded-md">{formError}</p>}
                    {formSuccess && <p className="text-green-600 text-center font-semibold p-2 bg-green-50 rounded-md">{formSuccess}</p>}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe (6 caractères min.)</label>
                        <input type="password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                        <select value={newUserRole} onChange={e => setNewUserRole(e.target.value as any)} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                            <option value="Éditeur">Éditeur</option>
                            <option value="Admin">Admin</option>
                        </select>
                         <p className="text-xs text-gray-500 mt-1">Les **Admins** peuvent tout gérer, y compris les utilisateurs. Les **Éditeurs** peuvent gérer le contenu (articles, événements) mais pas les utilisateurs ou les paramètres.</p>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400 transition-colors">Annuler</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-emerald text-white font-semibold rounded-md hover:bg-emerald/90 transition-colors disabled:bg-emerald/50">
                            {isSubmitting ? 'Création...' : 'Créer l\'utilisateur'}
                        </button>
                    </div>
                </form>
            </AdminModal>
        </div>
    );
};

export default AdminUsersPage;
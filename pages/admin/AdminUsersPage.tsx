import React, { useState } from 'react';
import { useUsers, useAddUser, useDeleteUser, useUpdateUser } from '../../services/convexService';
import Loading from '../../components/Loading';

const AdminUsersPage: React.FC = () => {
    const users = useUsers();
    const addUser = useAddUser();
    const deleteUser = useDeleteUser();
    const updateUser = useUpdateUser();
    const [newUser, setNewUser] = useState({ email: '', role: 'Présidente' as const, name: '', isActive: true });
    const [editingUser, setEditingUser] = useState<any>(null);

    if (users === undefined) {
        return <Loading message="Chargement des utilisateurs..." />;
    }

    const handleAddUser = async () => {
        try {
            await addUser(newUser);
            setNewUser({ email: '', role: 'Présidente', name: '', isActive: true });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${name}" ?`)) {
            try {
                await deleteUser({ id });
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleEdit = (user: any) => {
        setEditingUser(user);
    };

    const handleUpdateUser = async () => {
        try {
            await updateUser({ id: editingUser.id, ...editingUser });
            setEditingUser(null);
        } catch (err) {
            console.error(err);
        }
    };

    const roles = ["Présidente", "Secrétaire Général", "Relations Publiques", "Trésorerie", "Admin"];

    return (
        <div>
            <h1 className="font-serif text-4xl font-bold text-deep-black mb-8">Gestion des Utilisateurs</h1>

            {/* Add User Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="font-serif text-2xl font-bold mb-4">Ajouter un Utilisateur</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Nom"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="p-2 border rounded"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="p-2 border rounded"
                    />
                    <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                        className="p-2 border rounded"
                    >
                        {roles.map(role => <option key={role}>{role}</option>)}
                    </select>
                    <button onClick={handleAddUser} className="px-4 py-2 bg-emerald text-white rounded">Ajouter</button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead className="border-b-2 border-gray-200">
                        <tr>
                            <th className="p-3">Nom</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Rôle</th>
                            <th className="p-3">Actif</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-gray-100">
                                <td className="p-3">{user.name}</td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">{user.role}</td>
                                <td className="p-3">{user.isActive ? 'Oui' : 'Non'}</td>
                                <td className="p-3">
                                    <button onClick={() => handleEdit(user)} className="text-blue-500 mr-2">Modifier</button>
                                    <button onClick={() => handleDelete(user.id, user.name)} className="text-red-500">Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="font-serif text-2xl font-bold mb-4">Modifier Utilisateur</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nom"
                                value={editingUser.name}
                                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={editingUser.email}
                                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                            <select
                                value={editingUser.role}
                                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                className="w-full p-2 border rounded"
                            >
                                {roles.map(role => <option key={role}>{role}</option>)}
                            </select>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={editingUser.isActive}
                                    onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.checked })}
                                    className="mr-2"
                                />
                                Actif
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button onClick={() => setEditingUser(null)} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
                                <button onClick={handleUpdateUser} className="px-4 py-2 bg-emerald text-white rounded">Sauvegarder</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersPage;
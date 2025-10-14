import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import { Founder } from '../../types';
import { getFounders, addFounder, updateFounder, deleteFounder, seedDefaultBureau } from '../../services/neonService';

const AdminBureauPage: React.FC = () => {
    const [founders, setFounders] = useState<Founder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState<Founder | null>(null);
    const [form, setForm] = useState<Omit<Founder, 'id'>>({ name: '', title: '', imageUrl: '' });

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const rows = await getFounders();
            setFounders(rows);
        } catch (e) {
            setError("Impossible de charger le bureau.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleSeed = async () => {
        try {
            await seedDefaultBureau();
            await load();
        } catch (e) {
            setError("Échec de l'initialisation du bureau.");
        }
    };

    const startCreate = () => {
        setEditing(null);
        setForm({ name: '', title: '', imageUrl: '' });
    };

    const startEdit = (f: Founder) => {
        setEditing(f);
        setForm({ name: f.name, title: f.title, imageUrl: f.imageUrl });
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editing) {
                await updateFounder(editing.id, { ...editing, ...form });
            } else {
                const newId = `fnd_${Date.now()}`;
                await addFounder({ ...form } as any);
            }
            setEditing(null);
            setForm({ name: '', title: '', imageUrl: '' });
            await load();
        } catch (e) {
            setError('Enregistrement échoué.');
        }
    };

    const onDelete = async (id: string) => {
        if (!window.confirm('Supprimer cet élément ?')) return;
        try { await deleteFounder(id); await load(); } catch { setError('Suppression échouée.'); }
    };

    if (loading) return <Loading message="Chargement du bureau..." />;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Bureau de la FEGAMOD</h1>
                <div className="flex gap-2">
                    <button onClick={handleSeed} className="px-3 py-2 bg-emerald text-white rounded">Initialiser les 4 postes</button>
                    <button onClick={startCreate} className="px-3 py-2 bg-black text-white rounded">Nouveau</button>
                </div>
            </div>
            {error && <div className="mb-4 text-red-600">{error}</div>}

            <form onSubmit={onSubmit} className="bg-white shadow p-4 rounded mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <input name="name" value={form.name} onChange={onChange} placeholder="Nom" className="border p-2 rounded" />
                <input name="title" value={form.title} onChange={onChange} placeholder="Poste (ex: Présidente)" className="border p-2 rounded" />
                <input name="imageUrl" value={form.imageUrl} onChange={onChange} placeholder="Image URL (optionnel)" className="border p-2 rounded" />
                <button type="submit" className="px-3 py-2 bg-emerald text-white rounded">{editing ? 'Mettre à jour' : 'Ajouter'}</button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {founders.map((f) => (
                    <div key={f.id} className="bg-white shadow rounded p-4 flex items-center gap-4">
                        <img src={f.imageUrl || 'https://via.placeholder.com/80'} alt={f.name} className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                            <div className="font-semibold">{f.name}</div>
                            <div className="text-sm text-gray-600">{f.title}</div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => startEdit(f)} className="px-3 py-2 bg-black text-white rounded">Éditer</button>
                            <button onClick={() => onDelete(f.id)} className="px-3 py-2 bg-red-600 text-white rounded">Supprimer</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminBureauPage;



import React, { useState, useEffect, useCallback } from 'react';
import { getSettings, updateSettings } from '../../services/firebaseService';
import { SiteSettings } from '../../types';
import Loading from '../../components/Loading';

const AdminSettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<SiteSettings>({ email: '', phone: '', address: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getSettings();
            if (data) {
                setSettings(data);
            }
        } catch (err) {
            setError("Impossible de charger les paramètres.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);
        try {
            await updateSettings(settings);
            setSuccess("Paramètres enregistrés avec succès !");
        } catch (err) {
            setError("Erreur lors de l'enregistrement des paramètres.");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loading message="Chargement des paramètres..." />;

    return (
        <div>
            <h1 className="font-serif text-4xl font-bold text-deep-black mb-8">Paramètres du Site</h1>
            <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl">
                <h2 className="text-2xl font-bold text-deep-black mb-6">Informations de Contact</h2>
                <p className="text-gray-600 mb-6">
                    Les informations que vous modifiez ici seront automatiquement mises à jour sur l'ensemble du site, notamment dans le pied de page et la page de contact.
                </p>

                {error && <p className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
                {success && <p className="mb-4 text-center text-green-600 bg-green-100 p-3 rounded-md">{success}</p>}

                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email de contact public
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={settings.email}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald focus:border-emerald"
                            placeholder="contact@fegamod.ga"
                        />
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Téléphone de contact
                        </label>
                        <input
                            type="text"
                            name="phone"
                            id="phone"
                            value={settings.phone}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald focus:border-emerald"
                            placeholder="+241 01 23 45 67"
                        />
                    </div>
                     <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Adresse du siège
                        </label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            value={settings.address}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald focus:border-emerald"
                            placeholder="Libreville, Gabon"
                        />
                    </div>
                    <div className="flex justify-end">
                         <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald hover:bg-emerald/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald disabled:bg-emerald/50"
                        >
                            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
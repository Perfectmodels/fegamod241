import React, { useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import { seedDatabase } from '../services/neonService';

const FirebasePage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSeedDatabase = async () => {
        if (!window.confirm("Êtes-vous sûr ? Cette action écrasera toutes les données existantes dans la section 'public' de votre base de données.")) {
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await seedDatabase();
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue lors de la migration.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <SectionTitle subtitle="Panneau de Contrôle">Gestion des Données Firebase</SectionTitle>

            <div className="max-w-3xl mx-auto text-center text-lg text-gray-700 mb-12">
                <p>
                    Utilisez cet outil pour peupler ou réinitialiser la base de données de votre site avec les données de démonstration.
                </p>
                <p className="mt-2 text-sm text-red-600 font-semibold">
                    Attention : Cette action est irréversible et remplacera toutes les données existantes.
                </p>
            </div>

            <div className="text-center">
                <button 
                    onClick={handleSeedDatabase} 
                    disabled={loading}
                    className="inline-flex items-center space-x-2 px-8 py-4 rounded-md font-bold text-lg bg-emerald text-white hover:bg-emerald/90 transition-transform transform hover:scale-105 duration-300 shadow-lg disabled:bg-emerald/50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7a8 8 0 0116 0M12 11a4 4 0 100-8 4 4 0 000 8z" /></svg>
                    )}
                    <span>{loading ? 'Migration en cours...' : 'Peupler / Réinitialiser la base de données'}</span>
                </button>

                {success && (
                    <p className="mt-4 text-green-600 font-bold">
                        La base de données a été peuplée avec succès ! Le site est maintenant à jour.
                    </p>
                )}
                {error && (
                     <p className="mt-4 text-red-600 font-bold">
                        Erreur : {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default FirebasePage;
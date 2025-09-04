import React, { useEffect, useRef, useState } from 'react';
import { getFullMembersData } from '../../services/firebaseService';
import { FullMemberData } from '../../types';
import Loading from '../../components/Loading';

// This Chart type definition is needed because we're using a CDN
declare global {
    interface Window { Chart: any; }
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-emerald/10 text-emerald p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-deep-black">{value}</p>
        </div>
    </div>
);

const DashboardCharts: React.FC<{ members: FullMemberData[] }> = ({ members }) => {
    const categoryChartRef = useRef<HTMLCanvasElement | null>(null);
    const revenueChartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstances = useRef<{ category?: any; revenue?: any }>({});

    useEffect(() => {
        if (!members.length) return;

        const categoryCounts: { [key: string]: number } = members.reduce((acc, member) => {
            const category = member.category || 'Non spécifié';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });

        const revenueCounts: { [key: string]: number } = members.reduce((acc, member) => {
            const revenue = member.revenue || 'Non spécifié';
            acc[revenue] = (acc[revenue] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });
        
        // Destroy previous charts if they exist
        if (chartInstances.current.category) chartInstances.current.category.destroy();
        if (chartInstances.current.revenue) chartInstances.current.revenue.destroy();

        if (categoryChartRef.current && window.Chart) {
            const categoryCtx = categoryChartRef.current.getContext('2d');
            if (categoryCtx) {
                chartInstances.current.category = new window.Chart(categoryCtx, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(categoryCounts),
                        datasets: [{
                            label: 'Membres par Métier',
                            data: Object.values(categoryCounts),
                            backgroundColor: '#007F5C',
                            borderColor: '#004c37',
                            borderWidth: 1,
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true } }
                    }
                });
            }
        }
        
        if (revenueChartRef.current && window.Chart) {
            const revenueCtx = revenueChartRef.current.getContext('2d');
            const revenueLabels = Object.keys(revenueCounts);
            const revenueData = Object.values(revenueCounts);
            const backgroundColors = [
                '#007F5C', '#F5C518', '#0047AB', '#D4AF37', '#5E2CA5',
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
            ];

            if (revenueCtx) {
                 chartInstances.current.revenue = new window.Chart(revenueCtx, {
                    type: 'doughnut',
                    data: {
                        labels: revenueLabels,
                        datasets: [{
                            label: 'Membres par Revenu Annuel',
                            data: revenueData,
                            backgroundColor: backgroundColors.slice(0, revenueLabels.length),
                            hoverOffset: 4
                        }]
                    },
                    options: { responsive: true, plugins: { legend: { position: 'top' } } }
                });
            }
        }

        // Cleanup function
        return () => {
            if (chartInstances.current.category) chartInstances.current.category.destroy();
            if (chartInstances.current.revenue) chartInstances.current.revenue.destroy();
        };

    }, [members]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="font-serif text-xl font-bold text-deep-black mb-4">Répartition par Métier</h2>
                <canvas ref={categoryChartRef}></canvas>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="font-serif text-xl font-bold text-deep-black mb-4">Répartition par Revenu Annuel</h2>
                <canvas ref={revenueChartRef}></canvas>
            </div>
        </div>
    );
};


const AdminDashboardPage: React.FC = () => {
    const [members, setMembers] = useState<FullMemberData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getFullMembersData();
                setMembers(data);
            } catch (err) {
                setError("Impossible de charger les données du tableau de bord.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <Loading message="Chargement du tableau de bord..." />;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h1 className="font-serif text-4xl font-bold text-deep-black mb-8">Tableau de bord</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard 
                    title="Membres Actifs" 
                    value={members.length.toString()} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 006-6v-1a6 6 0 00-9-5.197" /></svg>} 
                />
                 <StatCard 
                    title="Événements à venir" 
                    value="3" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} 
                />
                 <StatCard 
                    title="Articles Publiés" 
                    value="3" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h.01M17 17h.01" /></svg>} 
                />
                 <StatCard 
                    title="Nouveaux Messages" 
                    value="0" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} 
                />
            </div>
            
            <DashboardCharts members={members} />

            <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
                <h2 className="font-serif text-2xl font-bold text-deep-black mb-4">Activité Récente</h2>
                <p className="text-gray-600">Le journal des activités récentes apparaîtra ici...</p>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
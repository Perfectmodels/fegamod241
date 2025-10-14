import React, { useState, useEffect } from 'react';
import { getMembers } from '../services/neonService';

const FashionActorsMarquee: React.FC = () => {
    const [memberNames, setMemberNames] = useState<string[]>([]);

    useEffect(() => {
        const loadNames = async () => {
            try {
                const members = await getMembers();
                setMemberNames(members.map(m => m.name));
            } catch (error) {
                console.error("Failed to load member names for marquee:", error);
                // Can set a default list of names here if needed
            }
        };
        loadNames();
    }, []);

    if (!memberNames.length) {
        return null; // Or a loading state
    }

    return (
        <section className="py-20 bg-deep-black text-off-white overflow-hidden">
            <div className="text-center mb-12">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-off-white">Les acteurs de la Mode Gabonaise</h2>
                <div className="mt-4 h-1 w-24 bg-gradient-to-r from-metallic-gold to-golden-yellow mx-auto rounded-full"></div>
            </div>
            <div className="relative flex overflow-hidden">
                <div className="flex whitespace-nowrap" style={{ animation: 'marquee 150s linear infinite' }}>
                    {/* Render list twice for seamless loop */}
                    {[...memberNames, ...memberNames].map((name, index) => (
                        <div key={index} className="flex items-center">
                            <span className="text-2xl font-serif mx-8">{name}</span>
                            <span className="text-metallic-gold text-2xl font-serif">◆</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FashionActorsMarquee;
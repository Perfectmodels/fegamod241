import React, { useState, useEffect } from 'react';
import { useMembers } from '../services/convexService';

const FashionActorsMarquee: React.FC = () => {
    const members = useMembers();

    useEffect(() => {
        // Members are now handled by the useMembers hook
    }, []);

    if (!members || !members.length) {
        return null; // Or a loading state
    }

    const memberNames = members.map(m => m.name);

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
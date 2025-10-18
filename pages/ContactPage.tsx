import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import { useSettings } from '../services/convexService';
import { SiteSettings } from '../types';

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-emerald text-white">
            {icon}
        </div>
        <h3 className="font-serif text-xl font-bold mb-2">{title}</h3>
        <div className="text-gray-600">{children}</div>
    </div>
);


const ContactPage: React.FC = () => {
    const settings = useSettings();

  return (
    <div className="bg-off-white py-20 bg-pattern">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="Prenons contact">Contactez-nous</SectionTitle>
        <p className="text-center max-w-3xl mx-auto text-gray-700 text-lg mb-12">
            Une question, une proposition de collaboration ou une demande d'information? Notre équipe est à votre écoute.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h3 className="font-serif text-2xl font-bold mb-6">Envoyer un message</h3>
            <form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <input type="text" placeholder="Nom complet" className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald" />
                <input type="email" placeholder="Adresse email" className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald" />
              </div>
              <div className="mb-6">
                 <input type="text" placeholder="Sujet" className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald" />
              </div>
              <div className="mb-6">
                <textarea rows={5} placeholder="Votre message" className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald"></textarea>
              </div>
              <button type="submit" className="w-full px-8 py-3 rounded-md font-bold text-lg bg-emerald text-white hover:bg-emerald/90 transition-all duration-300 shadow-lg">
                Envoyer
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-8">
            <InfoCard title="Adresse du Siège" icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}>
                <p>{settings?.address || 'Centre-ville, Libreville, Gabon'}</p>
            </InfoCard>
            <InfoCard title="Email & Téléphone" icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}>
                <p>{settings?.email || 'contact@fegamod.ga'}</p>
                <p>{settings?.phone || '+241 01 23 45 67'}</p>
            </InfoCard>
             <div className="h-64 bg-gray-300 rounded-lg shadow-md flex items-center justify-center text-gray-500">
                Emplacement de la carte Google Maps
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
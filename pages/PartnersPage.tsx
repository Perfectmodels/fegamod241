import React, { useState, useEffect } from 'react';
import { usePartners } from '../services/convexService';
import { Partner } from '../types';
import SectionTitle from '../components/SectionTitle';
import Loading from '../components/Loading';

const PartnerLogo: React.FC<{ partner: Partner }> = ({ partner }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden grayscale hover:grayscale-0 transition-all duration-300">
    <img src={partner.logoUrl} alt={partner.name} className="w-full h-32 object-cover" />
  </div>
);

const PartnersPage: React.FC = () => {
  const partners = usePartners();
  const loading = !partners;

  return (
    <div className="bg-off-white py-20 bg-pattern">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="Nos Alliés">Partenaires & Sponsors</SectionTitle>
        <p className="text-center max-w-3xl mx-auto text-gray-700 text-lg mb-12">
            La réussite de nos actions repose sur le soutien précieux de nos partenaires institutionnels et privés. Nous les remercions pour leur confiance et leur engagement à nos côtés.
        </p>

        {loading ? (
          <Loading message="Chargement des partenaires..." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {partners.map(partner => (
              <PartnerLogo key={partner.id} partner={partner} />
            ))}
          </div>
        )}
        
        <section className="mt-24 py-16 bg-white rounded-lg shadow-xl">
            <div className="container mx-auto px-4 text-center">
                <h2 className="font-serif text-4xl font-bold text-deep-black mb-4">Devenez Partenaire</h2>
                <p className="max-w-3xl mx-auto mb-8 text-gray-700">
                    Associez votre image à l'excellence, à la créativité et au dynamisme de la mode gabonaise. En devenant partenaire de FEGAMOD, vous soutenez un secteur en pleine croissance et bénéficiez d'une visibilité unique auprès d'un public passionné et influent.
                </p>
                <a href="mailto:partenariats@fegamod.ga" className="inline-block px-10 py-4 rounded-md font-bold text-lg bg-emerald text-white hover:bg-emerald/90 transition-transform transform hover:scale-105 duration-300 shadow-lg">
                    Contactez-nous
                </a>
            </div>
        </section>

      </div>
    </div>
  );
};

export default PartnersPage;
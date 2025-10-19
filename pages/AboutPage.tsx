import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import { useFounders } from '../services/convexService';
import { MOCK_GALLERY_IMAGES } from '../gallery-constants';
import { Founder } from '../types';
import Loading from '../components/Loading';

const FounderCard: React.FC<{ founder: Founder }> = ({ founder }) => (
    <div className="text-center">
        <div className="relative w-48 h-48 mx-auto mb-4">
            <img src={founder.imageUrl} alt={founder.name} className="rounded-full w-full h-full object-cover shadow-lg"/>
            <div className="absolute inset-0 rounded-full border-4 border-metallic-gold/50 transform scale-105"></div>
        </div>
        <h3 className="text-xl font-bold font-serif text-deep-black">{founder.name}</h3>
        <p className="text-emerald">{founder.title}</p>
    </div>
);


const AboutPage: React.FC = () => {
  const founders = useFounders();
  const loading = !founders;

  return (
    <div className="bg-off-white py-20 bg-pattern">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="Notre Fédération">À Propos de FEGAMOD</SectionTitle>

        <div className="max-w-4xl mx-auto text-center text-lg text-gray-700 mb-20">
          <p>
            Fondée sur une passion commune pour l'art et l'élégance, la Fédération Gabonaise de la Mode est une organisation dédiée à la promotion et à la structuration du secteur de la mode au Gabon. Nous œuvrons pour la reconnaissance internationale de nos créateurs et pour le développement d'un écosystème durable et prospère.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-16 mb-20 items-center">
          <div>
            <h3 className="font-serif text-3xl font-bold text-deep-black mb-4">Notre Mission</h3>
            <p className="text-gray-700 mb-4">
              Fédérer l'ensemble des acteurs de la mode gabonaise, des stylistes aux mannequins, en passant par les artisans et les photographes. Nous créons des synergies, offrons des formations et mettons en place des plateformes pour valoriser chaque talent.
            </p>
            <ul className="list-disc list-inside space-y-2 text-emerald">
                <li>Soutenir la créativité et l'innovation.</li>
                <li>Faciliter l'accès aux marchés locaux et internationaux.</li>
                <li>Préserver et moderniser les savoir-faire traditionnels.</li>
                <li>Promouvoir une mode éthique et durable.</li>
            </ul>
          </div>
          <div>
            <img src={MOCK_GALLERY_IMAGES[1]} alt="Atelier de couture" className="rounded-lg shadow-xl w-full h-auto object-cover" loading="lazy" decoding="async"/>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div className="md:order-2">
            <h3 className="font-serif text-3xl font-bold text-deep-black mb-4">Notre Vision</h3>
            <p className="text-gray-700">
              Positionner le Gabon comme une capitale incontournable de la mode en Afrique. Nous aspirons à une industrie où l'authenticité culturelle gabonaise s'exprime avec un langage universel, où nos marques deviennent des symboles de prestige et de qualité sur la scène mondiale.
            </p>
          </div>
          <div className="md:order-1">
             <img src={MOCK_GALLERY_IMAGES[2]} alt="Défilé de mode" className="rounded-lg shadow-xl w-full h-auto object-cover" loading="lazy" decoding="async"/>
          </div>
        </div>

        {/* Organigramme */}
        <section className="text-center">
          <SectionTitle subtitle="Notre Équipe">Organigramme</SectionTitle>
          {loading ? (
            <Loading message="Chargement de l'équipe..." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {founders.map(founder => (
                <FounderCard key={founder.id} founder={founder} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
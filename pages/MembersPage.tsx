import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMembers } from '../services/convexService';
import { Member } from '../types';
import SectionTitle from '../components/SectionTitle';
import Loading from '../components/Loading';

const MembersPage: React.FC = () => {
  const members = useMembers();
  const [activeCategory, setActiveCategory] = useState('Tous les membres');

  if (members === undefined) {
    return <Loading message="Chargement des membres..." />;
  }

  const categories = ['Tous les membres', ...Array.from(new Set(members.map(m => m.category))).sort()];

  const filteredMembers = activeCategory === 'Tous les membres'
    ? members
    : members.filter(member => member.category === activeCategory);

  return (
    <div className="bg-off-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="Nos Talents">Annuaire des Membres</SectionTitle>
        <p className="text-center max-w-3xl mx-auto text-gray-700 text-lg mb-12">
            Découvrez les visages qui façonnent la mode gabonaise. Filtrez par catégorie pour explorer notre réseau de professionnels passionnés.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                activeCategory === category
                  ? 'bg-emerald text-white shadow-lg'
                  : 'bg-white text-deep-black hover:bg-gray-200 shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {filteredMembers.map(member => (
            <Link to={`/membres/${member.id}`} key={member.id} className="group block overflow-hidden rounded-lg shadow-lg relative aspect-[4/5]">
              <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-3 w-full">
                <h3 className="font-serif text-sm md:text-base font-bold text-white truncate">{member.name}</h3>
                <p className="text-metallic-gold/80 text-xs md:text-sm font-semibold truncate">{member.category}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Adhesion Section */}
        <section className="mt-24 py-16 bg-deep-black rounded-lg text-off-white bg-pattern">
            <div className="container mx-auto px-4 text-center">
                <h2 className="font-serif text-4xl font-bold mb-4">Rejoignez la Fédération</h2>
                <p className="max-w-2xl mx-auto mb-8 text-off-white/80">
                    Vous êtes un professionnel de la mode au Gabon? Devenez membre de FEGAMOD pour bénéficier d'un réseau solide, d'opportunités uniques et contribuer à l'essor de notre industrie.
                </p>
                <form className="max-w-xl mx-auto">
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <input type="text" placeholder="Votre nom complet" className="w-full p-3 rounded-md bg-off-white/90 text-deep-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-metallic-gold"/>
                        <input type="email" placeholder="Votre email" className="w-full p-3 rounded-md bg-off-white/90 text-deep-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-metallic-gold"/>
                    </div>
                    <select className="w-full p-3 rounded-md bg-off-white/90 text-deep-black mb-4 focus:outline-none focus:ring-2 focus:ring-metallic-gold">
                        <option>Choisir votre catégorie...</option>
                        {categories.slice(1).map(cat => <option key={cat}>{cat}</option>)}
                        <option>Autre</option>
                    </select>
                    <button type="submit" className="w-full px-8 py-3 rounded-md font-bold text-lg bg-emerald text-white hover:bg-emerald/90 transition-all duration-300 shadow-lg">
                        Soumettre ma candidature
                    </button>
                </form>
            </div>
        </section>
      </div>
    </div>
  );
};

export default MembersPage;
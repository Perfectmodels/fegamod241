

import React from 'react';
import { MOCK_MEMBERS } from '../constants';
import { Member } from '../types';
import SectionTitle from '../components/SectionTitle';

const SocialIcon: React.FC<{ platform: 'instagram' | 'facebook' | 'twitter'; href?: string }> = ({ platform, href }) => {
  if (!href) return null;
  const icons = {
    instagram: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.644-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg>,
    twitter: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.793 4.649-.65.177-1.354.23-2.074.084.607 1.882 2.373 3.256 4.466 3.293-1.728 1.354-3.895 2.111-6.266 2.111-.408 0-.81-.023-1.206-.07z"/></svg>,
    facebook: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"/></svg>,
  };
  return <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-metallic-gold transition-colors">{icons[platform]}</a>;
};

const MemberCard: React.FC<{ member: Member }> = ({ member }) => (
  <div className="group relative overflow-hidden rounded-lg shadow-lg aspect-[3/4]">
    <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-transparent to-deep-black/20"></div>
    <div className="absolute bottom-0 left-0 p-6 w-full">
      <h3 className="font-serif text-2xl font-bold text-white">{member.name}</h3>
      <p className="text-metallic-gold font-semibold">{member.category}</p>
      <div className="flex space-x-3 mt-4">
        <SocialIcon platform="instagram" href={member.socials.instagram} />
        <SocialIcon platform="facebook" href={member.socials.facebook} />
        <SocialIcon platform="twitter" href={member.socials.twitter} />
      </div>
    </div>
  </div>
);

const MembersPage: React.FC = () => {
  const categories = [...new Set(MOCK_MEMBERS.map(member => member.category))].sort();

  return (
    <div className="bg-off-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="Nos Talents">Annuaire des Membres</SectionTitle>
        <p className="text-center max-w-3xl mx-auto text-gray-700 text-lg mb-12">
            Découvrez les visages qui façonnent la mode gabonaise. Stylistes, mannequins, créateurs et photographes, explorez notre réseau de professionnels passionnés.
        </p>
        
        <div className="space-y-16">
          {categories.map(category => (
            <section key={category}>
              <h2 className="font-serif text-3xl font-bold text-deep-black mb-8 pb-2 border-b-2 border-emerald">{category}s</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {MOCK_MEMBERS
                  .filter(member => member.category === category)
                  .map(member => (
                    <MemberCard key={member.id} member={member} />
                  ))}
              </div>
            </section>
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
                        <option>Styliste</option>
                        <option>Mannequin</option>
                        <option>Photographe</option>
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
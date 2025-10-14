import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMemberById } from '../services/neonService';
import { Member } from '../types';
import { MOCK_GALLERY_IMAGES } from '../gallery-constants';
import SectionTitle from '../components/SectionTitle';
import Loading from '../components/Loading';

const SocialIcon: React.FC<{ platform: 'instagram' | 'facebook' | 'twitter'; href?: string }> = ({ platform, href }) => {
  // Use a placeholder if no link is provided, to maintain UI consistency.
  const finalHref = href || "#";
  const icons = {
    instagram: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.644-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg>,
    twitter: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.793 4.649-.65.177-1.354.23-2.074.084.607 1.882 2.373 3.256 4.466 3.293-1.728 1.354-3.895 2.111-6.266 2.111-.408 0-.81-.023-1.206-.07z"/></svg>,
    facebook: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"/></svg>,
  };
  return <a href={finalHref} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-metallic-gold transition-colors">{icons[platform]}</a>;
};


const MemberDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [member, setMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const loadMember = async () => {
                try {
                    const data = await getMemberById(id);
                    setMember(data);
                } catch (err) {
                    setError("Impossible de trouver ce membre.");
                } finally {
                    setLoading(false);
                }
            };
            loadMember();
        }
    }, [id]);

    if (loading) {
        return <div className="py-20"><Loading message="Chargement du profil..." /></div>;
    }

    if (error || !member) {
        return (
            <div className="py-20 text-center">
                <h1 className="font-serif text-2xl font-bold text-red-600">{error || 'Membre non trouvé'}</h1>
                <Link to="/membres" className="mt-4 inline-block text-emerald hover:underline">
                    Retour à l'annuaire
                </Link>
            </div>
        );
    }

    const portfolioImages = [...MOCK_GALLERY_IMAGES].sort(() => 0.5 - Math.random()).slice(0, 4);

    return (
        <div className="bg-off-white py-20 bg-pattern">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <Link to="/membres" className="flex items-center space-x-2 text-gray-600 hover:text-emerald transition-colors font-semibold">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            <span>Retour à l'annuaire</span>
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                        <div className="md:flex">
                            <div className="md:w-1/3">
                                <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover"/>
                            </div>
                            <div className="md:w-2/3 p-8 flex flex-col justify-center">
                                <h1 className="font-serif text-4xl font-bold text-deep-black">{member.name}</h1>
                                <p className="text-xl text-emerald font-semibold mt-1 mb-4">{member.category}</p>
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    {member.bio}
                                </p>
                                <div className="flex space-x-4">
                                    <SocialIcon platform="instagram" href={member.socials?.instagram} />
                                    <SocialIcon platform="facebook" href={member.socials?.facebook} />
                                    <SocialIcon platform="twitter" href={member.socials?.twitter} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16">
                        <SectionTitle subtitle="Son Univers">Portfolio</SectionTitle>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {portfolioImages.map((src, index) => (
                                <div key={index} className="overflow-hidden rounded-lg shadow-md aspect-[1/1]">
                                    <img src={src} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover"/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberDetailPage;
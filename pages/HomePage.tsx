import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, getArticles } from '../services/neonService';
import { Event, Article } from '../types';
import { MOCK_GALLERY_IMAGES } from '../gallery-constants';
import SectionTitle from '../components/SectionTitle';
import FashionActorsMarquee from '../components/FashionActorsMarquee';
import Loading from '../components/Loading';

const Hero: React.FC = () => (
  <div className="relative h-[85vh] min-h-[600px] flex items-center justify-center text-center text-white bg-deep-black">
    <div 
      className="absolute inset-0 bg-cover bg-center opacity-40" 
      style={{backgroundImage: `url('${MOCK_GALLERY_IMAGES[20]}')`}}
    ></div>
    <div className="relative z-10 p-4">
      <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black mb-4 animate-fade-in-down">
        L'Élégance Gabonaise en Mouvement
      </h1>
      <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 animate-fade-in-up">
        FEGAMOD: Unir, Inspirer et Propulser la mode du Gabon sur la scène mondiale.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up animation-delay-300">
        <Link to="/membres" className="px-8 py-3 rounded-md font-bold text-lg bg-emerald text-white hover:bg-emerald/90 transition-transform transform hover:scale-105 duration-300 shadow-lg">
          Devenir Membre
        </Link>
        <Link to="/evenements" className="px-8 py-3 rounded-md font-bold text-lg bg-transparent border-2 border-metallic-gold text-metallic-gold hover:bg-metallic-gold hover:text-deep-black transition-all duration-300 shadow-lg">
          Voir l'Agenda
        </Link>
      </div>
    </div>
  </div>
);

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, articlesData] = await Promise.all([
          getEvents(),
          getArticles()
        ]);
        setEvents(eventsData);
        setArticles(articlesData);
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-off-white">
      <Hero />

      {/* About Section */}
      <section className="py-20 bg-pattern">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-4 text-deep-black">Notre Vision pour la Mode</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-metallic-gold to-golden-yellow mb-6"></div>
              <p className="text-lg mb-4 text-gray-700">
                La Fédération Gabonaise de la Mode (FEGAMOD) est le cœur battant de la créativité et de l'innovation dans l'industrie de la mode au Gabon. Notre mission est de fédérer les talents, de structurer le secteur et de faire rayonner l'identité unique de la mode gabonaise à travers le monde.
              </p>
              <Link to="/a-propos" className="inline-block mt-4 font-bold text-emerald hover:text-metallic-gold transition-colors duration-300 group">
                En savoir plus
                <span className="inline-block transition-transform group-hover:translate-x-2 ml-2">→</span>
              </Link>
            </div>
            <div className="relative h-96">
                <img src={MOCK_GALLERY_IMAGES[21]} alt="Fashion" className="absolute w-[80%] h-full object-cover rounded-lg shadow-2xl top-0 left-0"/>
                <img src={MOCK_GALLERY_IMAGES[22]} alt="Style" className="absolute w-[50%] h-[70%] object-cover rounded-lg shadow-2xl bottom-0 right-0 border-8 border-off-white"/>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle="Calendrier">Événements à Venir</SectionTitle>
          {loading ? <Loading message="Chargement..." /> : (
            <div className="grid md:grid-cols-3 gap-8">
              {events.slice(0, 3).map(event => (
                <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
                  <img src={event.imageUrl} alt={event.title} className="w-full h-56 object-cover"/>
                  <div className="p-6">
                    <p className="text-sm text-emerald font-semibold mb-2">{event.date} • {event.location}</p>
                    <h3 className="font-serif text-2xl font-bold mb-3">{event.title}</h3>
                    <Link to="/evenements" className="font-bold text-deep-black hover:text-metallic-gold transition-colors duration-300 group-hover:text-metallic-gold">
                      Voir les détails <span className="inline-block transition-transform group-hover:translate-x-2 ml-1">→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest News */}
      <section className="py-20 bg-gray-50 bg-pattern">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle="Notre Blog">Actualités de la Mode</SectionTitle>
           {loading ? <Loading message="Chargement..." /> : (
            <div className="grid lg:grid-cols-3 gap-8">
              {articles.slice(0, 3).map(article => (
                <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden group">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-56 object-cover"/>
                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-2">{article.category} • {article.date}</p>
                    <h3 className="font-serif text-xl font-bold mb-4 h-16">{article.title}</h3>
                    <Link to="/actualites" className="font-bold text-emerald hover:text-metallic-gold transition-colors duration-300">
                      Lire la suite <span className="inline-block transition-transform group-hover:translate-x-2 ml-1">→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
           )}
        </div>
      </section>

      <FashionActorsMarquee />
    </div>
  );
};

export default HomePage;
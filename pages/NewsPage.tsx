import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../services/firebaseService';
import { Article } from '../types';
import SectionTitle from '../components/SectionTitle';
import Loading from '../components/Loading';

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden group flex flex-col">
    <div className="overflow-hidden">
        <img src={article.imageUrl} alt={article.title} className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"/>
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <p className="text-sm text-gray-500 mb-2">{article.category} • {article.date}</p>
      <h3 className="font-serif text-xl font-bold text-deep-black mb-3 flex-grow">{article.title}</h3>
      <p className="text-gray-700 mb-4">{article.excerpt}</p>
      <Link to="#" className="font-bold text-emerald hover:text-metallic-gold transition-colors duration-300 self-start">
        Lire la suite <span className="inline-block transition-transform group-hover:translate-x-2 ml-1">→</span>
      </Link>
    </div>
  </div>
);

const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await getArticles();
        setArticles(data);
      } catch (err) {
        setError("Impossible de charger les actualités.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  return (
    <div className="bg-off-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="Le Blog">Actualités & Tendances</SectionTitle>
         <p className="text-center max-w-3xl mx-auto text-gray-700 text-lg mb-12">
            Plongez au cœur de la mode gabonaise avec nos articles, interviews et communiqués de presse. Restez informé des dernières tendances et des nouvelles de la fédération.
        </p>
        {loading ? (
          <Loading message="Chargement des actualités..." />
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
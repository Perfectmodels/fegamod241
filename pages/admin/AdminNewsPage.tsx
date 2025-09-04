import React, { useState, useEffect } from 'react';
import { MOCK_ARTICLES } from '../../constants';
import { Article } from '../../types';

declare global {
  interface Window { tinymce: any; }
}

const AdminNewsPage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
    const [view, setView] = useState<'list' | 'editor'>('list');
    const [currentArticle, setCurrentArticle] = useState<Article | null>(null);

    useEffect(() => {
        if (view === 'editor') {
            window.tinymce?.init({
                selector: '#article-editor',
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                height: 500,
                menubar: false,
                skin: "oxide-dark",
                content_css: "dark"
            });
        } else {
            window.tinymce?.get('article-editor')?.remove();
        }

        return () => {
            window.tinymce?.get('article-editor')?.remove();
        };
    }, [view]);

    const handleAddNew = () => {
        setCurrentArticle({
            id: Date.now(),
            title: '',
            excerpt: '',
            content: '',
            category: 'Tendances',
            date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase().replace('.', ''),
            imageUrl: 'https://scontent.flbv4-1.fna.fbcdn.net/v/t39.30808-6/490469159_1224589963000817_3167865212737796030_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_aid=0&_nc_eui2=AeEaBiDVPubknWTbZaeXpgWj6bdtgCz18Y_pt22ALPXxj4W_vC2McEi5Ek_kl9WezO3oDuFK7t_zdbdKVt0K0i3c&_nc_ohc=SYpdFCz4B80Q7kNvwEza7Ra&_nc_oc=AdnY1MPXt9kwrZwZrStBHGmotJO2ctQ3CkFPA7QaFsp9gArj1ieOzpkUZsc3fAdd600&_nc_zt=23&_nc_ht=scontent.flbv4-1.fna&_nc_gid=sId8jkgdlx2a92NCaHKprQ&oh=00_AfaCSbZoBD8swRXA9_ZElW16lzdCLwUI77WK6khxZKX74Q&oe=68BEE8F4',
        });
        setView('editor');
    };

    const handleEdit = (article: Article) => {
        setCurrentArticle(article);
        setView('editor');
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article?')) {
            setArticles(prev => prev.filter(a => a.id !== id));
        }
    };
    
    const handleSave = () => {
        if (!currentArticle) return;
        
        const editorContent = window.tinymce.get('article-editor').getContent();
        const articleToSave = { ...currentArticle, content: editorContent };

        const index = articles.findIndex(a => a.id === articleToSave.id);
        if (index > -1) {
            const updatedArticles = [...articles];
            updatedArticles[index] = articleToSave;
            setArticles(updatedArticles);
        } else {
            setArticles([articleToSave, ...articles]);
        }
        setView('list');
        setCurrentArticle(null);
    };

    const handleCancel = () => {
        setView('list');
        setCurrentArticle(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!currentArticle) return;
        const { name, value } = e.target;
        setCurrentArticle({ ...currentArticle, [name]: value });
    };

    if (view === 'editor' && currentArticle) {
        return (
            <div>
                <h1 className="font-serif text-4xl font-bold text-deep-black mb-8">
                    {articles.some(a => a.id === currentArticle.id) ? 'Modifier l\'article' : 'Rédiger un article'}
                </h1>
                <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                        <input type="text" name="title" value={currentArticle.title} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Extrait (résumé court)</label>
                        <textarea name="excerpt" value={currentArticle.excerpt} onChange={handleInputChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                        <select name="category" value={currentArticle.category} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md">
                            <option>Tendances</option>
                            <option>Interviews</option>
                            <option>Communiqués</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input type="text" name="imageUrl" value={currentArticle.imageUrl} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contenu de l'article</label>
                        <textarea id="article-editor" defaultValue={currentArticle.content}></textarea>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button onClick={handleCancel} className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400 transition-colors">Annuler</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-emerald text-white font-semibold rounded-md hover:bg-emerald/90 transition-colors">Enregistrer</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-4xl font-bold text-deep-black">Gestion des Actualités</h1>
                <button onClick={handleAddNew} className="px-4 py-2 bg-emerald text-white font-semibold rounded-md hover:bg-emerald/90 transition-colors">
                    Rédiger un article
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead className="border-b-2 border-gray-200">
                        <tr>
                            <th className="p-3 text-sm font-semibold tracking-wide">Titre</th>
                            <th className="p-3 text-sm font-semibold tracking-wide">Catégorie</th>
                            <th className="p-3 text-sm font-semibold tracking-wide">Date</th>
                            <th className="p-3 text-sm font-semibold tracking-wide">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map(article => (
                            <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-3 font-bold">{article.title}</td>
                                <td className="p-3 text-gray-700">{article.category}</td>
                                <td className="p-3 text-gray-700">{article.date}</td>
                                <td className="p-3">
                                    <div className="flex space-x-4">
                                        <button onClick={() => handleEdit(article)} className="text-gray-500 hover:text-emerald">Éditer</button>
                                        <button onClick={() => handleDelete(article.id)} className="text-gray-500 hover:text-red-600">Supprimer</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminNewsPage;
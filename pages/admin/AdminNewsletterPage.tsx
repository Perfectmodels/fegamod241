import React, { useState, useEffect } from 'react';
import { NewsletterContact } from '../../types/newsletter';
import { fetchAllContacts, fetchContactsFromFirestore, fetchMembersAsContacts } from '../../services/firestoreContacts';
import { 
  sendBulkEmailsWithRateLimit, 
  getRateLimitStats, 
  updateRateLimitConfig,
  resetRateLimitCounters,
  canSendEmail
} from '../../services/brevoService';
import Loading from '../../components/Loading';

const AdminNewsletterPage: React.FC = () => {
  // États pour les contacts
  const [contacts, setContacts] = useState<NewsletterContact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [contactSource, setContactSource] = useState<'all' | 'subscribers' | 'members'>('all');
  
  // États pour le contenu de la newsletter
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState(getDefaultTemplate());
  const [senderEmail, setSenderEmail] = useState('contact@fegamod.ga');
  const [senderName, setSenderName] = useState('FEGAMOD');
  
  // États pour la prévisualisation
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  // États pour l'envoi
  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState({ current: 0, total: 0 });
  const [sendResult, setSendResult] = useState<{
    success: boolean;
    message: string;
    details?: string;
  } | null>(null);
  
  // États pour le rate limiting
  const [rateLimitStats, setRateLimitStats] = useState(getRateLimitStats());
  const [rateLimitConfig, setRateLimitConfig] = useState({
    maxEmailsPerDay: 300,
    maxEmailsPerHour: 50,
    delayBetweenEmails: 1000,
  });
  const [showRateLimitConfig, setShowRateLimitConfig] = useState(false);

  // Charger les stats de rate limit au montage
  useEffect(() => {
    setRateLimitStats(getRateLimitStats());
    const interval = setInterval(() => {
      setRateLimitStats(getRateLimitStats());
    }, 60000); // Mise à jour toutes les minutes
    return () => clearInterval(interval);
  }, []);

  // Fonction pour récupérer les contacts depuis Firestore
  const handleFetchContacts = async () => {
    setLoadingContacts(true);
    setSendResult(null);
    
    try {
      let fetchedContacts: NewsletterContact[] = [];
      
      switch (contactSource) {
        case 'subscribers':
          fetchedContacts = await fetchContactsFromFirestore('newsletter_subscribers', true);
          break;
        case 'members':
          fetchedContacts = await fetchMembersAsContacts();
          break;
        case 'all':
        default:
          fetchedContacts = await fetchAllContacts();
          break;
      }
      
      setContacts(fetchedContacts);
      setSelectedContacts(new Set(fetchedContacts.map(c => c.id)));
      
      setSendResult({
        success: true,
        message: `${fetchedContacts.length} contact(s) récupéré(s) avec succès depuis Firestore.`,
      });
    } catch (error) {
      setSendResult({
        success: false,
        message: 'Erreur lors de la récupération des contacts.',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    } finally {
      setLoadingContacts(false);
    }
  };

  // Gestion de la sélection des contacts
  const toggleContactSelection = (id: string) => {
    const newSelection = new Set(selectedContacts);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedContacts(newSelection);
  };

  const selectAllContacts = () => {
    setSelectedContacts(new Set(contacts.map(c => c.id)));
  };

  const deselectAllContacts = () => {
    setSelectedContacts(new Set());
  };

  // Envoi de la newsletter
  const handleSendNewsletter = async () => {
    const selectedContactsList = contacts.filter(c => selectedContacts.has(c.id));
    
    if (selectedContactsList.length === 0) {
      setSendResult({
        success: false,
        message: 'Veuillez sélectionner au moins un contact.',
      });
      return;
    }
    
    if (!subject.trim()) {
      setSendResult({
        success: false,
        message: 'Veuillez saisir un sujet pour la newsletter.',
      });
      return;
    }
    
    if (!htmlContent.trim()) {
      setSendResult({
        success: false,
        message: 'Veuillez saisir le contenu de la newsletter.',
      });
      return;
    }
    
    // Vérifier le rate limit avant de commencer
    const canSend = canSendEmail();
    if (!canSend.allowed) {
      setSendResult({
        success: false,
        message: 'Envoi impossible : ' + canSend.reason,
        details: canSend.waitTime 
          ? `Réessayez dans ${Math.ceil(canSend.waitTime / 60000)} minutes.`
          : undefined,
      });
      return;
    }
    
    if (!window.confirm(
      `Êtes-vous sûr de vouloir envoyer cette newsletter à ${selectedContactsList.length} contact(s) ?\n\n` +
      `Sujet : ${subject}\n\n` +
      `Cette action ne peut pas être annulée.`
    )) {
      return;
    }
    
    setSending(true);
    setSendProgress({ current: 0, total: selectedContactsList.length });
    setSendResult(null);
    
    try {
      const result = await sendBulkEmailsWithRateLimit(
        selectedContactsList,
        subject,
        htmlContent,
        senderEmail,
        senderName,
        (current, total) => {
          setSendProgress({ current, total });
        }
      );
      
      setRateLimitStats(getRateLimitStats());
      
      setSendResult({
        success: result.successful > 0,
        message: `Envoi terminé : ${result.successful} réussi(s), ${result.failed} échoué(s), ${result.rateLimited} limité(s) par rate limit.`,
        details: result.rateLimited > 0 
          ? 'Certains emails n\'ont pas été envoyés en raison des limites de débit. Réessayez plus tard.'
          : undefined,
      });
    } catch (error) {
      setSendResult({
        success: false,
        message: 'Erreur lors de l\'envoi de la newsletter.',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    } finally {
      setSending(false);
    }
  };

  // Mise à jour de la configuration du rate limit
  const handleUpdateRateLimitConfig = () => {
    updateRateLimitConfig(rateLimitConfig);
    setRateLimitStats(getRateLimitStats());
    setShowRateLimitConfig(false);
    setSendResult({
      success: true,
      message: 'Configuration des limites de débit mise à jour.',
    });
  };

  // Réinitialisation des compteurs de rate limit
  const handleResetRateLimitCounters = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser les compteurs ? Cela pourrait entraîner des dépassements de limites Brevo.')) {
      resetRateLimitCounters();
      setRateLimitStats(getRateLimitStats());
      setSendResult({
        success: true,
        message: 'Compteurs de rate limit réinitialisés.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-4xl font-bold text-deep-black">Gestion Newsletter</h1>
      
      {/* Messages de résultat */}
      {sendResult && (
        <div className={`p-4 rounded-lg ${sendResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="font-semibold">{sendResult.message}</p>
          {sendResult.details && <p className="mt-1 text-sm">{sendResult.details}</p>}
        </div>
      )}
      
      {/* Statistiques de rate limit */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-deep-black">Limites d&apos;envoi Brevo</h2>
          <button
            onClick={() => setShowRateLimitConfig(!showRateLimitConfig)}
            className="text-emerald hover:text-emerald/80 text-sm font-medium"
          >
            {showRateLimitConfig ? 'Masquer config' : 'Configurer'}
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Emails aujourd&apos;hui</p>
            <p className="text-2xl font-bold text-deep-black">
              {rateLimitStats.dailyUsed} / {rateLimitStats.dailyLimit}
            </p>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald rounded-full h-2 transition-all"
                style={{ width: `${(rateLimitStats.dailyUsed / rateLimitStats.dailyLimit) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Emails cette heure</p>
            <p className="text-2xl font-bold text-deep-black">
              {rateLimitStats.hourlyUsed} / {rateLimitStats.hourlyLimit}
            </p>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 rounded-full h-2 transition-all"
                style={{ width: `${(rateLimitStats.hourlyUsed / rateLimitStats.hourlyLimit) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Restant (jour)</p>
            <p className="text-2xl font-bold text-emerald">{rateLimitStats.dailyRemaining}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Restant (heure)</p>
            <p className="text-2xl font-bold text-blue-500">{rateLimitStats.hourlyRemaining}</p>
          </div>
        </div>
        
        {/* Configuration du rate limit */}
        {showRateLimitConfig && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold mb-4">Configuration des limites</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max emails/jour
                </label>
                <input
                  type="number"
                  value={rateLimitConfig.maxEmailsPerDay}
                  onChange={(e) => setRateLimitConfig({
                    ...rateLimitConfig,
                    maxEmailsPerDay: parseInt(e.target.value) || 300,
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max emails/heure
                </label>
                <input
                  type="number"
                  value={rateLimitConfig.maxEmailsPerHour}
                  onChange={(e) => setRateLimitConfig({
                    ...rateLimitConfig,
                    maxEmailsPerHour: parseInt(e.target.value) || 50,
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Délai entre emails (ms)
                </label>
                <input
                  type="number"
                  value={rateLimitConfig.delayBetweenEmails}
                  onChange={(e) => setRateLimitConfig({
                    ...rateLimitConfig,
                    delayBetweenEmails: parseInt(e.target.value) || 1000,
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleUpdateRateLimitConfig}
                className="px-4 py-2 bg-emerald text-white rounded-md hover:bg-emerald/90"
              >
                Enregistrer
              </button>
              <button
                onClick={handleResetRateLimitCounters}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Réinitialiser compteurs
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Section récupération des contacts */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-deep-black mb-4">
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Contacts depuis Firestore
          </span>
        </h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source des contacts
            </label>
            <select
              value={contactSource}
              onChange={(e) => setContactSource(e.target.value as 'all' | 'subscribers' | 'members')}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald focus:border-emerald"
            >
              <option value="all">Tous (abonnés + membres)</option>
              <option value="subscribers">Abonnés newsletter uniquement</option>
              <option value="members">Membres uniquement</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleFetchContacts}
              disabled={loadingContacts}
              className="inline-flex items-center px-6 py-3 bg-emerald text-white rounded-md hover:bg-emerald/90 disabled:bg-emerald/50 transition-colors"
            >
              {loadingContacts ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Chargement...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Récupérer les contacts
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Liste des contacts */}
        {contacts.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {selectedContacts.size} / {contacts.length} contact(s) sélectionné(s)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={selectAllContacts}
                  className="text-sm text-emerald hover:underline"
                >
                  Tout sélectionner
                </button>
                <button
                  onClick={deselectAllContacts}
                  className="text-sm text-red-500 hover:underline"
                >
                  Tout désélectionner
                </button>
              </div>
            </div>
            
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      <input
                        type="checkbox"
                        checked={selectedContacts.size === contacts.length}
                        onChange={() => selectedContacts.size === contacts.length ? deselectAllContacts() : selectAllContacts()}
                        className="rounded border-gray-300 text-emerald focus:ring-emerald"
                      />
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedContacts.has(contact.id)}
                          onChange={() => toggleContactSelection(contact.id)}
                          className="rounded border-gray-300 text-emerald focus:ring-emerald"
                        />
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">{contact.name || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{contact.email}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          contact.source === 'members' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {contact.source === 'members' ? 'Membre' : 'Abonné'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Section composition de la newsletter */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-deep-black mb-4">Composer la Newsletter</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l&apos;expéditeur
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald focus:border-emerald"
              placeholder="FEGAMOD"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email de l&apos;expéditeur
            </label>
            <input
              type="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald focus:border-emerald"
              placeholder="contact@fegamod.ga"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sujet de la newsletter
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald focus:border-emerald"
            placeholder="Newsletter FEGAMOD - Actualités du mois"
          />
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Contenu HTML
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setHtmlContent(getDefaultTemplate())}
                className="text-sm text-emerald hover:underline"
              >
                Réinitialiser template
              </button>
            </div>
          </div>
          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            rows={15}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald focus:border-emerald font-mono text-sm"
            placeholder="<html>...</html>"
          />
        </div>
        
        {/* Boutons d'action */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Prévisualiser
          </button>
          
          <button
            onClick={handleSendNewsletter}
            disabled={sending || selectedContacts.size === 0}
            className="inline-flex items-center px-6 py-3 bg-emerald text-white rounded-md hover:bg-emerald/90 disabled:bg-emerald/50 transition-colors"
          >
            {sending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi en cours ({sendProgress.current}/{sendProgress.total})...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Envoyer ({selectedContacts.size} destinataire{selectedContacts.size > 1 ? 's' : ''})
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Modal de prévisualisation */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold">Prévisualisation de la newsletter</h3>
              <div className="flex items-center gap-4">
                <div className="flex rounded-md overflow-hidden border border-gray-300">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`px-3 py-1 text-sm ${previewMode === 'desktop' ? 'bg-emerald text-white' : 'bg-white text-gray-700'}`}
                  >
                    Desktop
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`px-3 py-1 text-sm ${previewMode === 'mobile' ? 'bg-emerald text-white' : 'bg-white text-gray-700'}`}
                  >
                    Mobile
                  </button>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-gray-100 border-b border-gray-200">
              <p className="text-sm">
                <span className="font-semibold">De :</span> {senderName} &lt;{senderEmail}&gt;
              </p>
              <p className="text-sm">
                <span className="font-semibold">Sujet :</span> {subject || '(Aucun sujet)'}
              </p>
            </div>
            
            <div className="flex-1 overflow-auto p-4 bg-gray-200 flex justify-center">
              <div 
                className={`bg-white shadow-lg transition-all ${
                  previewMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-[800px]'
                }`}
              >
                <iframe
                  srcDoc={htmlContent}
                  title="Newsletter Preview"
                  className="w-full h-[600px] border-0"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  handleSendNewsletter();
                }}
                disabled={selectedContacts.size === 0}
                className="px-4 py-2 bg-emerald text-white rounded-md hover:bg-emerald/90 disabled:bg-emerald/50"
              >
                Envoyer la newsletter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Template HTML par défaut
function getDefaultTemplate(): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter FEGAMOD</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #007F5C;
      padding: 30px;
      text-align: center;
    }
    .header img {
      max-width: 150px;
      height: auto;
    }
    .header h1 {
      color: #ffffff;
      margin: 20px 0 0;
      font-size: 24px;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #007F5C;
      font-size: 22px;
      margin-bottom: 20px;
    }
    .content p {
      line-height: 1.6;
      margin-bottom: 15px;
    }
    .cta-button {
      display: inline-block;
      background-color: #007F5C;
      color: #ffffff !important;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin: 20px 0;
    }
    .cta-button:hover {
      background-color: #006347;
    }
    .section {
      padding: 20px 0;
      border-bottom: 1px solid #eee;
    }
    .footer {
      background-color: #1a1a1a;
      color: #999;
      padding: 30px;
      text-align: center;
      font-size: 12px;
    }
    .footer a {
      color: #007F5C;
      text-decoration: none;
    }
    .social-links {
      margin: 20px 0;
    }
    .social-links a {
      display: inline-block;
      margin: 0 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>FEGAMOD</h1>
      <p style="color: #fff; margin: 10px 0 0;">Fédération Gabonaise de la Mode</p>
    </div>
    
    <!-- Content -->
    <div class="content">
      <h2>Bonjour !</h2>
      
      <p>
        Bienvenue dans la newsletter de la FEGAMOD. Nous sommes ravis de partager avec vous 
        les dernières actualités de la mode gabonaise.
      </p>
      
      <div class="section">
        <h3 style="color: #007F5C;">📰 Actualités</h3>
        <p>
          Découvrez les derniers événements et activités de la fédération. 
          La mode gabonaise continue de rayonner à l'international !
        </p>
      </div>
      
      <div class="section">
        <h3 style="color: #007F5C;">📅 Événements à venir</h3>
        <p>
          Ne manquez pas nos prochains événements. Consultez notre calendrier 
          pour rester informé des défilés, ateliers et rencontres.
        </p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://fegamod.ga" class="cta-button">
          Visiter notre site
        </a>
      </div>
      
      <p>
        Merci de votre fidélité et à très bientôt !
      </p>
      
      <p>
        <strong>L'équipe FEGAMOD</strong>
      </p>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>
        © 2024 FEGAMOD - Fédération Gabonaise de la Mode<br>
        Libreville, Gabon
      </p>
      <p>
        <a href="mailto:contact@fegamod.ga">contact@fegamod.ga</a>
      </p>
      <p style="margin-top: 20px;">
        <a href="#">Se désabonner</a> | 
        <a href="https://fegamod.ga">Voir en ligne</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

export default AdminNewsletterPage;

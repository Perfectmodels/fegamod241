import { collection, getDocs, query, where, DocumentData } from 'firebase/firestore';
import { getFirebaseDb } from './firebaseConfig';
import { NewsletterContact } from '../types/newsletter';

/**
 * Récupère les contacts depuis Firestore
 * @param collectionName - Nom de la collection Firestore contenant les contacts
 * @param subscribedOnly - Si true, ne récupère que les contacts abonnés
 */
export const fetchContactsFromFirestore = async (
  collectionName: string = 'newsletter_subscribers',
  subscribedOnly: boolean = true
): Promise<NewsletterContact[]> => {
  try {
    const db = getFirebaseDb();
    const contactsRef = collection(db, collectionName);
    
    let contactsQuery;
    if (subscribedOnly) {
      contactsQuery = query(contactsRef, where('subscribed', '==', true));
    } else {
      contactsQuery = contactsRef;
    }
    
    const snapshot = await getDocs(contactsQuery);
    
    const contacts: NewsletterContact[] = snapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        email: data.email || '',
        name: data.name || data.displayName || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        subscribed: data.subscribed !== false, // Default to true if not specified
        subscribedAt: data.subscribedAt?.toDate?.() || data.createdAt?.toDate?.() || new Date(),
        source: data.source || 'firestore',
        tags: data.tags || [],
      };
    });
    
    return contacts;
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts Firestore:', error);
    throw error;
  }
};

/**
 * Récupère les membres depuis la collection members de Firestore
 */
export const fetchMembersAsContacts = async (): Promise<NewsletterContact[]> => {
  try {
    const db = getFirebaseDb();
    const membersRef = collection(db, 'members');
    const snapshot = await getDocs(membersRef);
    
    const contacts: NewsletterContact[] = snapshot.docs
      .map((doc) => {
        const data = doc.data() as DocumentData;
        if (!data.email) return null;
        
        return {
          id: doc.id,
          email: data.email,
          name: data.name || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          subscribed: true,
          source: 'members',
          tags: ['member', data.category || ''].filter(Boolean),
        };
      })
      .filter((contact): contact is NewsletterContact => contact !== null);
    
    return contacts;
  } catch (error) {
    console.error('Erreur lors de la récupération des membres:', error);
    throw error;
  }
};

/**
 * Récupère tous les contacts (abonnés + membres)
 */
export const fetchAllContacts = async (): Promise<NewsletterContact[]> => {
  try {
    const [subscribers, members] = await Promise.all([
      fetchContactsFromFirestore('newsletter_subscribers', true).catch(() => []),
      fetchMembersAsContacts().catch(() => []),
    ]);
    
    // Dédupliquer par email
    const emailMap = new Map<string, NewsletterContact>();
    
    [...subscribers, ...members].forEach((contact) => {
      const email = contact.email.toLowerCase();
      if (!emailMap.has(email)) {
        emailMap.set(email, contact);
      } else {
        // Fusionner les tags si le contact existe déjà
        const existing = emailMap.get(email)!;
        existing.tags = [...new Set([...(existing.tags || []), ...(contact.tags || [])])];
      }
    });
    
    return Array.from(emailMap.values());
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les contacts:', error);
    throw error;
  }
};

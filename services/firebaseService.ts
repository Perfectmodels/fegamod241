import { useState, useEffect, useCallback } from 'react';
import { getFirebaseDb } from './firebaseConfig';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';

// Types
export interface Member {
  _id: string;
  name: string;
  category: string;
  specialty?: string;
  city?: string;
  country?: string;
  image?: string;
  description?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  isFounder?: boolean;
  createdAt?: Date;
}

export interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  description?: string;
  image?: string;
  category?: string;
  status?: 'upcoming' | 'past' | 'ongoing';
}

export interface Article {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  author?: string;
  date: string;
  category?: string;
  tags?: string[];
}

export interface Partner {
  _id: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  category?: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: Date;
}

export interface Settings {
  _id: string;
  siteName?: string;
  description?: string;
  contactEmail?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

// Generic hook for real-time Firestore collection
function useFirestoreCollection<T extends { _id: string }>(
  collectionName: string,
  queryConstraints?: any[]
): T[] | undefined {
  const [data, setData] = useState<T[] | undefined>(undefined);

  useEffect(() => {
    try {
      const db = getFirebaseDb();
      const collectionRef = collection(db, collectionName);
      
      const unsubscribe = onSnapshot(
        collectionRef,
        (snapshot) => {
          const items: T[] = snapshot.docs.map((doc) => ({
            _id: doc.id,
            ...doc.data(),
          })) as T[];
          setData(items);
        },
        (error) => {
          console.error(`Error fetching ${collectionName}:`, error);
          setData([]);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error(`Error setting up ${collectionName} listener:`, error);
      setData([]);
    }
  }, [collectionName]);

  return data;
}

// Generic hook for single document
function useFirestoreDocument<T extends { _id: string }>(
  collectionName: string,
  docId: string | null
): T | undefined | null {
  const [data, setData] = useState<T | undefined | null>(undefined);

  useEffect(() => {
    if (!docId) {
      setData(null);
      return;
    }

    try {
      const db = getFirebaseDb();
      const docRef = doc(db, collectionName, docId);

      const unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setData({
              _id: snapshot.id,
              ...snapshot.data(),
            } as T);
          } else {
            setData(null);
          }
        },
        (error) => {
          console.error(`Error fetching ${collectionName}/${docId}:`, error);
          setData(null);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error(`Error setting up document listener:`, error);
      setData(null);
    }
  }, [collectionName, docId]);

  return data;
}

// Members hooks
export const useMembers = (): Member[] | undefined => {
  return useFirestoreCollection<Member>('members');
};

export const useMemberById = (id: string): Member | undefined | null => {
  return useFirestoreDocument<Member>('members', id);
};

export const useAddMember = () => {
  return useCallback(async (memberData: Omit<Member, '_id'>) => {
    const db = getFirebaseDb();
    const docRef = await addDoc(collection(db, 'members'), {
      ...memberData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  }, []);
};

export const useUpdateMember = () => {
  return useCallback(async ({ id, ...data }: { id: string } & Partial<Member>) => {
    const db = getFirebaseDb();
    const docRef = doc(db, 'members', id);
    await updateDoc(docRef, data);
  }, []);
};

export const useDeleteMember = () => {
  return useCallback(async ({ id }: { id: string }) => {
    const db = getFirebaseDb();
    const docRef = doc(db, 'members', id);
    await deleteDoc(docRef);
  }, []);
};

// Events hooks
export const useEvents = (): Event[] | undefined => {
  return useFirestoreCollection<Event>('events');
};

export const useAddEvent = () => {
  return useCallback(async (eventData: Omit<Event, '_id'>) => {
    const db = getFirebaseDb();
    const docRef = await addDoc(collection(db, 'events'), eventData);
    return docRef.id;
  }, []);
};

export const useUpdateEvent = () => {
  return useCallback(async ({ id, ...data }: { id: string } & Partial<Event>) => {
    const db = getFirebaseDb();
    const docRef = doc(db, 'events', id);
    await updateDoc(docRef, data);
  }, []);
};

export const useDeleteEvent = () => {
  return useCallback(async ({ id }: { id: string }) => {
    const db = getFirebaseDb();
    const docRef = doc(db, 'events', id);
    await deleteDoc(docRef);
  }, []);
};

// Articles hooks
export const useArticles = (): Article[] | undefined => {
  return useFirestoreCollection<Article>('articles');
};

export const useAddArticle = () => {
  return useCallback(async (articleData: Omit<Article, '_id'>) => {
    const db = getFirebaseDb();
    const docRef = await addDoc(collection(db, 'articles'), articleData);
    return docRef.id;
  }, []);
};

export const useUpdateArticle = () => {
  return useCallback(async ({ id, ...data }: { id: string } & Partial<Article>) => {
    const db = getFirebaseDb();
    const docRef = doc(db, 'articles', id);
    await updateDoc(docRef, data);
  }, []);
};

export const useDeleteArticle = () => {
  return useCallback(async ({ id }: { id: string }) => {
    const db = getFirebaseDb();
    const docRef = doc(db, 'articles', id);
    await deleteDoc(docRef);
  }, []);
};

// Founders hooks
export const useFounders = (): Member[] | undefined => {
  const [data, setData] = useState<Member[] | undefined>(undefined);

  useEffect(() => {
    try {
      const db = getFirebaseDb();
      const collectionRef = collection(db, 'members');
      
      const unsubscribe = onSnapshot(
        collectionRef,
        (snapshot) => {
          const items: Member[] = snapshot.docs
            .map((doc) => ({
              _id: doc.id,
              ...doc.data(),
            }) as Member)
            .filter((member) => member.isFounder === true);
          setData(items);
        },
        (error) => {
          console.error('Error fetching founders:', error);
          setData([]);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up founders listener:', error);
      setData([]);
    }
  }, []);

  return data;
};

export const useAddFounder = () => {
  return useCallback(async (founderData: Omit<Member, '_id'>) => {
    const db = getFirebaseDb();
    const docRef = await addDoc(collection(db, 'members'), {
      ...founderData,
      isFounder: true,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  }, []);
};

export const useUpdateFounder = () => {
  return useUpdateMember();
};

export const useDeleteFounder = () => {
  return useDeleteMember();
};

// Partners hooks
export const usePartners = (): Partner[] | undefined => {
  return useFirestoreCollection<Partner>('partners');
};

export const useAddPartner = () => {
  return useCallback(async (partnerData: Omit<Partner, '_id'>) => {
    const db = getFirebaseDb();
    const docRef = await addDoc(collection(db, 'partners'), partnerData);
    return docRef.id;
  }, []);
};

export const useUpdatePartner = () => {
  return useCallback(async ({ id, ...data }: { id: string } & Partial<Partner>) => {
    const db = getFirebaseDb();
    const docRef = doc(db, 'partners', id);
    await updateDoc(docRef, data);
  }, []);
};

export const useDeletePartner = () => {
  return useCallback(async ({ id }: { id: string }) => {
    const db = getFirebaseDb();
    const docRef = doc(db, 'partners', id);
    await deleteDoc(docRef);
  }, []);
};

// Settings hooks
export const useSettings = (): Settings | undefined => {
  const [data, setData] = useState<Settings | undefined>(undefined);

  useEffect(() => {
    try {
      const db = getFirebaseDb();
      const docRef = doc(db, 'settings', 'main');

      const unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setData({
              _id: snapshot.id,
              ...snapshot.data(),
            } as Settings);
          } else {
            // Return default settings if none exist
            setData({
              _id: 'main',
              siteName: 'FEGAMOD',
              description: 'Federation Gabonaise de la Mode',
            });
          }
        },
        (error) => {
          console.error('Error fetching settings:', error);
          setData({
            _id: 'main',
            siteName: 'FEGAMOD',
            description: 'Federation Gabonaise de la Mode',
          });
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up settings listener:', error);
      setData({
        _id: 'main',
        siteName: 'FEGAMOD',
        description: 'Federation Gabonaise de la Mode',
      });
    }
  }, []);

  return data;
};

// Users hooks
export const useUsers = (): User[] | undefined => {
  return useFirestoreCollection<User>('users');
};

export const useUserByEmail = (email: string): User | undefined | null => {
  const [data, setData] = useState<User | undefined | null>(undefined);

  useEffect(() => {
    if (!email) {
      setData(null);
      return;
    }

    try {
      const db = getFirebaseDb();
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            setData({
              _id: doc.id,
              ...doc.data(),
            } as User);
          } else {
            setData(null);
          }
        },
        (error) => {
          console.error('Error fetching user by email:', error);
          setData(null);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up user listener:', error);
      setData(null);
    }
  }, [email]);

  return data;
};

export const useAddUser = () => {
  return useCallback(async (userData: Omit<User, '_id'>) => {
    const db = getFirebaseDb();
    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  }, []);
};

export const useUpdateUser = () => {
  return useCallback(async ({ id, ...data }: { id: string } & Partial<User>) => {
    const db = getFirebaseDb();
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, data);
  }, []);
};

export const useDeleteUser = () => {
  return useCallback(async ({ id }: { id: string }) => {
    const db = getFirebaseDb();
    const docRef = doc(db, 'users', id);
    await deleteDoc(docRef);
  }, []);
};

export const useCurrentUserRole = (): string | null => {
  const users = useUsers();
  // For demo purposes, assume the first user. In production, integrate with auth.
  return users?.[0]?.role || null;
};

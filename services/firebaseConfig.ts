import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Configuration Firebase - remplacer par vos valeurs
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let app: FirebaseApp;
let db: Firestore;

export const initializeFirebase = (): { app: FirebaseApp; db: Firestore } => {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } else {
    app = getApps()[0];
    db = getFirestore(app);
  }
  return { app, db };
};

export const getFirebaseDb = (): Firestore => {
  if (!db) {
    initializeFirebase();
  }
  return db;
};

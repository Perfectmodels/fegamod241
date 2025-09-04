import { AdminUser } from "../types";

// IMPORTANT: This configuration needs to be filled with your actual Firebase project details.
// You can find this in your Firebase project settings under "General".
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyB5TA9Z6zmEgQB7_qjuD1LgIu9WXyDvd5Q", // This is public and safe to include here
  authDomain: "dbfegamod.firebaseapp.com",
  projectId: "dbfegamod",
  storageBucket: "dbfegamod.appspot.com",
  messagingSenderId: "SENDER_ID", // Find in Firebase project settings
  appId: "APP_ID", // Find in Firebase project settings
};

const AUTH_API_URL = `https://identitytoolkit.googleapis.com/v1/accounts:`;
const FUNCTIONS_API_URL = `https://us-central1-${FIREBASE_CONFIG.projectId}.cloudfunctions.net/`;

const SESSION_TOKEN_KEY = 'firebaseAuthToken';

const getApiKey = () => {
    if (!FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey.startsWith("AIza")) {
        return FIREBASE_CONFIG.apiKey;
    }
    throw new Error("Clé API Firebase non configurée. Veuillez l'ajouter dans `services/authService.ts`.");
}

export const signInWithEmail = async (email: string, password: string): Promise<void> => {
    const response = await fetch(`${AUTH_API_URL}signInWithPassword?key=${getApiKey()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    const data = await response.json();

    if (!response.ok) {
        const errorMessage = data.error?.message === 'INVALID_LOGIN_CREDENTIALS' 
            ? 'Email ou mot de passe incorrect.' 
            : 'Une erreur est survenue.';
        throw new Error(errorMessage);
    }
    
    sessionStorage.setItem(SESSION_TOKEN_KEY, data.idToken);
};

export const signOutUser = (): void => {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
    return !!sessionStorage.getItem(SESSION_TOKEN_KEY);
};

export const getAuthToken = (): string | null => {
    return sessionStorage.getItem(SESSION_TOKEN_KEY);
};

// --- Functions requiring authentication and backend interaction ---

const callFirebaseFunction = async (functionName: string, payload: object) => {
    const token = getAuthToken();
    if (!token) {
        throw new Error("Authentification requise.");
    }

    const response = await fetch(`${FUNCTIONS_API_URL}${functionName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ data: payload })
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error?.message || `Erreur lors de l'appel à la fonction ${functionName}.`);
    }
    return result.result;
};


export const createUserWithEmail = async (email: string, password: string): Promise<any> => {
     // This first call only creates the user in Firebase Auth.
     // It does NOT grant any special permissions or roles.
    const response = await fetch(`${AUTH_API_URL}signUp?key=${getApiKey()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    const data = await response.json();

    if (!response.ok) {
       const errorMessage = data.error?.message === 'EMAIL_EXISTS'
            ? 'Cet email est déjà utilisé.'
            : 'Erreur lors de la création du compte.';
        throw new Error(errorMessage);
    }
    return data;
};

export const setUserRole = async (email: string, role: 'Admin' | 'Éditeur'): Promise<any> => {
    return callFirebaseFunction('setUserRole', { email, role });
}

export const listUsers = async (): Promise<AdminUser[]> => {
    return callFirebaseFunction('listUsers', {});
}
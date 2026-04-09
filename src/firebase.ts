import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, collection, addDoc, serverTimestamp, query, orderBy, limit, where, getDocs, deleteDoc } from 'firebase/firestore';

// Import the default Firebase configuration
import defaultFirebaseConfig from '../firebase-applet-config.json';

// Determine which config to use
let firebaseConfig = defaultFirebaseConfig;
try {
  const customConfig = localStorage.getItem('customFirebaseConfig');
  if (customConfig) {
    firebaseConfig = JSON.parse(customConfig);
  }
} catch (e) {
  console.error("Failed to parse custom Firebase config from localStorage", e);
}

// Initialize Firebase SDK
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Auth helper
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

// Firestore helpers
export { doc, getDoc, setDoc, onSnapshot, collection, addDoc, serverTimestamp, query, orderBy, limit, where, getDocs, deleteDoc };

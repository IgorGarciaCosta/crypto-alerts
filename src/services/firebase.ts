import {initializeApp} from "firebase/app";
import { updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import {
getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from "firebase/auth";

/* --- config via .env --- */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app  = initializeApp(firebaseConfig);   // ⬅ exporta app
export const auth = getAuth(app);
export const db   = getFirestore(app);               // ⬅ exporta db

/* ---------- helpers simples ---------- */
export function listenAuth(cb: (u: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

export async function signup(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function logout() {
  return signOut(auth);
}

export async function setDisplayName(name: string) {
  if (auth.currentUser)
    return updateProfile(auth.currentUser, { displayName: name });
}
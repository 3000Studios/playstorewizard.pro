"use client";

/**
 * Firebase Web Client SDK initialization.
 * Only used in client components — never import this in server components
 * or API routes (Cloudflare Workers runtime doesn't support Firebase Admin).
 *
 * All credentials are PUBLIC web SDK values — safe as NEXT_PUBLIC_ vars.
 * Fallbacks are hardcoded since these are public config, not secrets.
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyC2VCBOszos800f-m8inp7XhJkLH4KFkKs",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "gen-lang-client-0914367944.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "gen-lang-client-0914367944",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "gen-lang-client-0914367944.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "76706851259",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:76706851259:web:bc534d20b8152cd7d93c9e",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-DH1WBK8YWK",
};

// Singleton — Next.js hot reload can re-run this module; avoid duplicate apps.
export const firebaseApp: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const firebaseAuth: Auth = getAuth(firebaseApp);
export const firebaseDb: Firestore = getFirestore(firebaseApp);

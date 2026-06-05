"use client";

/**
 * Firebase Auth helpers — client-side only.
 * Never import in server components or API routes.
 */

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { firebaseAuth } from "./client";

const googleProvider = new GoogleAuthProvider();

/** Sign in with Google popup. Returns the Firebase User on success. */
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(firebaseAuth, googleProvider);
  return result.user;
}

/** Sign in with email + password. Returns the Firebase User on success. */
export async function signInWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
  return result.user;
}

/** Create a new account with email + password. Returns the Firebase User on success. */
export async function signUpWithEmail(email: string, password: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  return result.user;
}

/** Sign out the current user. */
export async function signOut(): Promise<void> {
  await firebaseSignOut(firebaseAuth);
}

/** Subscribe to auth state changes. Returns the unsubscribe function. */
export function onAuthStateChanged(callback: (user: User | null) => void): Unsubscribe {
  return firebaseOnAuthStateChanged(firebaseAuth, callback);
}

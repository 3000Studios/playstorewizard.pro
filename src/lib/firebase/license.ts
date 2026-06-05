"use client";

/**
 * Firestore license persistence — client-side only.
 * Saves and reads signed licenses to/from `licenses/{uid}` in Firestore.
 * Never import in server components or API routes.
 */

import { doc, setDoc, getDoc } from "firebase/firestore";
import { firebaseDb } from "./client";
import type { SignedLicense } from "@/lib/pro/tiers";

const COLLECTION = "licenses";

/**
 * Persist a signed license to Firestore under `licenses/{uid}`.
 * Call this after a successful checkout when the user is authenticated.
 */
export async function saveLicenseToFirestore(
  uid: string,
  signedLicense: SignedLicense
): Promise<void> {
  const ref = doc(firebaseDb, COLLECTION, uid);
  await setDoc(ref, {
    payload: signedLicense.payload,
    signature: signedLicense.signature,
    savedAt: new Date().toISOString(),
  });
}

/**
 * Read a signed license from Firestore for the given uid.
 * Returns null if no license exists or if the document is malformed.
 */
export async function getLicenseFromFirestore(uid: string): Promise<SignedLicense | null> {
  try {
    const ref = doc(firebaseDb, COLLECTION, uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data();
    if (!data?.payload || !data?.signature) return null;

    return {
      payload: data.payload as SignedLicense["payload"],
      signature: data.signature as string,
    };
  } catch {
    return null;
  }
}

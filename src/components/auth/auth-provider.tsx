"use client";

/**
 * Auth Provider — wraps the app with Firebase auth state.
 * On sign-in, loads the user's Firestore license and seeds the Zustand store.
 * Only runs on the client (Firebase Web SDK requirement).
 */

import * as React from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "@/lib/firebase/auth";
import { getLicenseFromFirestore } from "@/lib/firebase/license";
import { useLicense } from "@/lib/license-store";

// -------------------------------------------------------------------------
//  Context
// -------------------------------------------------------------------------

interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContextValue>({
  user: null,
  loading: true,
});

// -------------------------------------------------------------------------
//  Provider
// -------------------------------------------------------------------------

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  const setLicense = useLicense((s) => s.setLicense);
  const clearLicense = useLicense((s) => s.clear);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        // Attempt to load license from Firestore and seed the store.
        try {
          const stored = await getLicenseFromFirestore(firebaseUser.uid);
          if (stored) {
            await setLicense(stored);
          }
        } catch {
          // Non-fatal — user can still use the app; license stays as-is.
        }
      } else {
        // Signed out — don't clear local license automatically; user may have
        // a valid local license from a direct checkout without signing in.
      }
    });

    return unsubscribe;
  }, [setLicense, clearLicense]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// -------------------------------------------------------------------------
//  Hook
// -------------------------------------------------------------------------

export function useAuth(): AuthContextValue {
  return React.useContext(AuthContext);
}

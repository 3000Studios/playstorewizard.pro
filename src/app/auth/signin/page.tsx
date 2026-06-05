"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/lib/firebase/auth";
import { useAuth } from "@/components/auth/auth-provider";

// Google "G" SVG — official brand colour mark, inline so no external fetch.
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

type Mode = "signin" | "signup";

export default function SignInPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [mode, setMode] = React.useState<Mode>("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Already signed in — bounce to dashboard.
  React.useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  function clearError() {
    if (error) setError(null);
  }

  function friendlyError(err: unknown): string {
    if (err instanceof Error) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        return "Incorrect email or password.";
      }
      if (code === "auth/email-already-in-use") return "That email is already registered. Sign in instead.";
      if (code === "auth/weak-password") return "Password must be at least 6 characters.";
      if (code === "auth/invalid-email") return "Please enter a valid email address.";
      if (code === "auth/popup-closed-by-user") return "Sign-in popup was closed. Try again.";
      if (code === "auth/network-request-failed") return "Network error — check your connection.";
      return err.message;
    }
    return "Something went wrong. Try again.";
  }

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-border bg-bg-1/60 backdrop-blur-xl shadow-[0_24px_64px_rgba(0,0,0,0.55)] p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="h-12 w-12 rounded-xl bg-grad-aurora mx-auto mb-4 grid place-items-center shadow-[0_0_24px_rgba(99,102,241,0.5)]">
              <span className="text-white text-xl font-bold select-none">W</span>
            </div>
            <h1 className="font-display font-bold text-2xl tracking-tight text-text">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1.5 text-sm text-text-muted">
              {mode === "signin"
                ? "Sign in to access your wizard and licenses."
                : "Start publishing better Play Store listings."}
            </p>
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className={cn(
              "w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-border-strong bg-bg-2 hover:bg-bg-3 text-text text-[15px] font-medium transition-all duration-200",
              "hover:border-indigo-300/50 hover:shadow-[0_0_18px_-4px_rgba(165,180,252,0.4)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-0",
              "disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
            )}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="h-5 w-5 flex-shrink-0" />
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-bg-1 px-3 text-xs text-text-dim">or continue with email</span>
            </div>
          </div>

          {/* Email / password form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm text-text-muted mb-1.5 font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  placeholder="you@example.com"
                  className={cn(
                    "w-full h-11 rounded-xl border bg-bg-2 pl-10 pr-4 text-[15px] text-text placeholder:text-text-dim",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-bg-0 transition-all",
                    error ? "border-red-500/70" : "border-border-strong hover:border-indigo-300/40"
                  )}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-text-muted mb-1.5 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  required
                  minLength={mode === "signup" ? 6 : undefined}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  placeholder={mode === "signup" ? "Min. 6 characters" : "••••••••"}
                  className={cn(
                    "w-full h-11 rounded-xl border bg-bg-2 pl-10 pr-4 text-[15px] text-text placeholder:text-text-dim",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-bg-0 transition-all",
                    error ? "border-red-500/70" : "border-border-strong hover:border-indigo-300/40"
                  )}
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-300">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="aurora"
              size="md"
              className="w-full mt-1"
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          {/* Toggle mode */}
          <p className="mt-5 text-center text-sm text-text-muted">
            {mode === "signin" ? (
              <>
                No account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setError(null); }}
                  className="text-indigo-300 hover:text-indigo-200 font-medium underline underline-offset-2 transition-colors"
                >
                  Create one free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("signin"); setError(null); }}
                  className="text-indigo-300 hover:text-indigo-200 font-medium underline underline-offset-2 transition-colors"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        {/* Footer note */}
        <p className="mt-5 text-center text-xs text-text-dim">
          By continuing you agree to our{" "}
          <Link href="/terms" className="hover:text-text-muted transition-colors underline underline-offset-2">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="hover:text-text-muted transition-colors underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

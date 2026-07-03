import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Page not found</h1>
      <p className="mt-3 text-zinc-400">
        That route does not exist. Head back to the Play Store Wizard home page.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-white px-5 py-2 text-sm font-medium text-black"
      >
        Go home
      </Link>
    </main>
  );
}
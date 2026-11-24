import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión | Parley CRM",
  description: "Accede o crea tu cuenta en Parley CRM con correo y contraseña.",
};

type LoginSearchParams = Promise<{
  error?: string;
  message?: string;
  next?: string;
}>;

async function LoginFormLoader({
  searchParams,
  isSupabaseConfigured,
}: {
  searchParams: LoginSearchParams;
  isSupabaseConfigured: boolean;
}) {
  const params = await searchParams;

  return (
    <LoginForm
      isSupabaseConfigured={isSupabaseConfigured}
      initialError={params.error}
      initialMessage={params.message}
      nextPath={params.next}
    />
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: LoginSearchParams;
}) {
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12">
      {/* Subtle ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center overflow-hidden blur-3xl"
      >
        <div className="h-72 w-[36rem] rounded-full bg-gradient-to-tr from-emerald-500/20 via-teal-400/15 to-sky-500/20 opacity-70 dark:opacity-40" />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-sm font-bold text-white shadow-xs dark:bg-white dark:text-zinc-900">
              P
            </span>
            <span className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Parley CRM
            </span>
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="h-[420px] w-full animate-pulse rounded-2xl border border-zinc-200/80 bg-white/60 dark:border-zinc-800/80 dark:bg-zinc-900/50" />
          }
        >
          <LoginFormLoader
            searchParams={searchParams}
            isSupabaseConfigured={isSupabaseConfigured}
          />
        </Suspense>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            &larr; Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

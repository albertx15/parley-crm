import Link from "next/link";

export default function Home() {
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  const stackItems = [
    {
      name: "Next.js App Router",
      detail: "Renderizado híbrido con Server Components y rutas modernas.",
      badge: "v16",
    },
    {
      name: "Tailwind CSS",
      detail: "Sistema de estilos utilitario rápido y adaptable a modo oscuro.",
      badge: "v4",
    },
    {
      name: "TypeScript",
      detail: "Tipado estricto de extremo a extremo para mayor seguridad.",
      badge: "TS",
    },
    {
      name: "Supabase SSR",
      detail:
        "Clientes listos para navegador, servidor y proxy de actualización de sesión.",
      badge: "Auth & DB",
    },
  ];

  const supabaseFiles = [
    {
      path: "src/utils/supabase/client.ts",
      role: "Cliente de Supabase para Client Components",
    },
    {
      path: "src/utils/supabase/server.ts",
      role: "Cliente de Supabase para Server Components y Route Handlers",
    },
    {
      path: "src/proxy.ts",
      role: "Proxy de Next.js para refrescar sesiones automáticamente",
    },
    {
      path: ".env.local",
      role: "Variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY",
    },
  ];

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Subtle ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center overflow-hidden blur-3xl"
      >
        <div className="h-72 w-[42rem] rounded-full bg-gradient-to-tr from-emerald-500/20 via-teal-400/15 to-sky-500/20 opacity-70 dark:opacity-40" />
      </div>

      {/* Top navigation */}
      <header className="border-b border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/70">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-sm font-bold text-white dark:bg-white dark:text-zinc-900">
              P
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Parley CRM
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium sm:flex dark:border-zinc-800 dark:bg-zinc-900">
              <span
                className={`h-2 w-2 rounded-full ${
                  isSupabaseConfigured
                    ? "bg-emerald-500"
                    : "bg-amber-500 animate-pulse"
                }`}
              />
              <span className="text-zinc-700 dark:text-zinc-300">
                {isSupabaseConfigured
                  ? "Supabase conectado"
                  : "Supabase pendiente en .env.local"}
              </span>
            </div>

            <Link
              href="/login"
              className="rounded-lg bg-zinc-950 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-12 px-6 py-16 sm:py-24">
        <section className="max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            Base lista para producción
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
            Tu aplicación moderna con{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
              Next.js &amp; Supabase
            </span>
          </h1>
          <p className="text-base leading-7 text-zinc-600 sm:text-lg dark:text-zinc-400">
            Proyecto inicializado con App Router, Tailwind CSS, TypeScript y las
            librerías oficiales de Supabase (
            <code className="rounded bg-zinc-200/70 px-1.5 py-0.5 font-mono text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
              @supabase/supabase-js
            </code>{" "}
            y{" "}
            <code className="rounded bg-zinc-200/70 px-1.5 py-0.5 font-mono text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
              @supabase/ssr
            </code>
            ).
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-zinc-800 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400"
            >
              Ir a /login
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Ir a /dashboard
            </Link>
          </div>
        </section>

        {/* Stack grid */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stackItems.map((item) => (
            <div
              key={item.name}
              className="group rounded-2xl border border-zinc-200/80 bg-white/80 p-5 shadow-xs transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:hover:border-zinc-700"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {item.name}
                </h2>
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {item.badge}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {item.detail}
              </p>
            </div>
          ))}
        </section>

        {/* Supabase integration checklist */}
        <section className="rounded-2xl border border-zinc-200/80 bg-white/80 p-6 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Configuración de Supabase
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Agrega tus credenciales en{" "}
                <code className="font-mono text-xs text-zinc-800 dark:text-zinc-200">
                  .env.local
                </code>{" "}
                para activar la conexión con tu proyecto.
              </p>
            </div>
          </div>

          <div className="divide-y divide-zinc-200/70 rounded-xl border border-zinc-200/70 bg-zinc-50/70 dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950/60">
            {supabaseFiles.map((file) => (
              <div
                key={file.path}
                className="flex flex-col justify-between gap-1 px-4 py-3 sm:flex-row sm:items-center"
              >
                <code className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  {file.path}
                </code>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  {file.role}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200/80 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-400">
        Parley CRM &middot; Next.js App Router + Tailwind CSS + TypeScript +
        Supabase
      </footer>
    </div>
  );
}

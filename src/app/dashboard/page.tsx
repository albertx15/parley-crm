import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { signout } from "@/app/auth/actions";
import { createClient } from "@/utils/supabase/server";
import { ClienteForm } from "./cliente-form";
import { ClientesTable } from "./clientes-table";
import type { Cliente } from "./types";

export const metadata: Metadata = {
  title: "Dashboard | Parley CRM",
  description:
    "Panel protegido para gestionar clientes con Next.js y Supabase.",
};

async function DashboardShell() {
  await connection();

  let user: { id: string; email?: string } | null = null;
  let clientes: Cliente[] = [];
  let fetchError: string | undefined;

  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    user = authData.user;

    if (user) {
      const orderedResult = await supabase
        .from("clientes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (
        orderedResult.error &&
        orderedResult.error.message.toLowerCase().includes("created_at")
      ) {
        const fallbackResult = await supabase
          .from("clientes")
          .select("*")
          .eq("user_id", user.id);

        if (fallbackResult.error) {
          fetchError = fallbackResult.error.message;
        } else {
          clientes = (fallbackResult.data as Cliente[]) ?? [];
        }
      } else if (orderedResult.error) {
        fetchError = orderedResult.error.message;
      } else {
        clientes = (orderedResult.data as Cliente[]) ?? [];
      }
    }
  } catch {
    user = null;
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Top bar with user email and sign-out button */}
      <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <div className="mx-auto flex min-h-16 max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-2.5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-sm font-bold text-white dark:bg-white dark:text-zinc-900">
              P
            </span>
            <span className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Parley CRM
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="max-w-[200px] truncate sm:max-w-xs">
                {user.email}
              </span>
            </div>

            <form action={signout}>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950 cursor-pointer dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Cerrar Sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
        <ClienteForm />
        <ClientesTable clientes={clientes} fetchError={fetchError} />
      </main>
    </div>
  );
}

function DashboardFallback() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-200/80 bg-white/80 dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="h-6 w-28 animate-pulse rounded-lg bg-zinc-200/80 dark:bg-zinc-800" />
          <div className="flex items-center gap-3">
            <div className="h-7 w-40 animate-pulse rounded-full bg-zinc-200/80 dark:bg-zinc-800" />
            <div className="h-8 w-24 animate-pulse rounded-xl bg-zinc-200/80 dark:bg-zinc-800" />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
        <div className="h-44 animate-pulse rounded-2xl border border-zinc-200/80 bg-white/60 dark:border-zinc-800/80 dark:bg-zinc-900/50" />
        <div className="h-72 animate-pulse rounded-2xl border border-zinc-200/80 bg-white/60 dark:border-zinc-800/80 dark:bg-zinc-900/50" />
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardShell />
    </Suspense>
  );
}

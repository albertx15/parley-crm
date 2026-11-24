"use client";

import { useActionState, useEffect, useRef } from "react";
import { createCliente, type ClienteFormState } from "./actions";
import { CLIENTE_ESTADOS } from "./types";

const initialState: ClienteFormState = {};

export function ClienteForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    createCliente,
    initialState,
  );

  useEffect(() => {
    if (state.submittedCount) {
      formRef.current?.reset();
    }
  }, [state.submittedCount]);

  return (
    <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/70">
      <div className="mb-5 flex flex-col gap-1">
        <h1 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Agregar cliente rápido
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Registra un nuevo cliente en tu cartera. Se asociará automáticamente a
          tu cuenta.
        </p>
      </div>

      {state.error && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300"
        >
          {state.error}
        </div>
      )}

      {state.success && (
        <div
          role="status"
          className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-300"
        >
          {state.success}
        </div>
      )}

      <form
        ref={formRef}
        action={formAction}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12"
      >
        <div className="space-y-1.5 lg:col-span-4">
          <label
            htmlFor="nombre"
            className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            placeholder="Ej. Laura Martínez"
            disabled={isPending}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-950 placeholder:text-zinc-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
        </div>

        <div className="space-y-1.5 lg:col-span-4">
          <label
            htmlFor="empresa"
            className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            Empresa
          </label>
          <input
            id="empresa"
            name="empresa"
            type="text"
            required
            placeholder="Ej. Estudio Norte"
            disabled={isPending}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-950 placeholder:text-zinc-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
        </div>

        <div className="space-y-1.5 lg:col-span-2">
          <label
            htmlFor="estado"
            className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            defaultValue={CLIENTE_ESTADOS[0]}
            disabled={isPending}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-950 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
          >
            {CLIENTE_ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end lg:col-span-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 text-sm font-medium text-white shadow-xs transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400"
          >
            {isPending ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Guardando...
              </>
            ) : (
              "Agregar"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

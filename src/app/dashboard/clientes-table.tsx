"use client";

import { useState, useTransition } from "react";
import { deleteCliente, updateClienteEstado } from "./actions";
import {
  getEstadoBadgeClasses,
  getNextEstado,
  type Cliente,
} from "./types";

type ClientesTableProps = {
  clientes: Cliente[];
  fetchError?: string;
};

type PendingAction = {
  id: string | number;
  type: "status" | "delete";
} | null;

export function ClientesTable({ clientes, fetchError }: ClientesTableProps) {
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isPending, startTransition] = useTransition();

  const handleToggleEstado = (cliente: Cliente) => {
    setActionError(null);
    setPendingAction({ id: cliente.id, type: "status" });

    startTransition(async () => {
      const result = await updateClienteEstado(cliente.id, cliente.estado);
      if (result.error) {
        setActionError(result.error);
      }
      setPendingAction(null);
    });
  };

  const handleDelete = (cliente: Cliente) => {
    setActionError(null);
    setPendingAction({ id: cliente.id, type: "delete" });

    startTransition(async () => {
      const result = await deleteCliente(cliente.id);
      if (result.error) {
        setActionError(result.error);
      }
      setPendingAction(null);
    });
  };

  const activeCount = clientes.filter(
    (c) => c.estado.trim().toLowerCase() === "activo",
  ).length;
  const inProgressCount = clientes.filter((c) => {
    const estado = c.estado.trim().toLowerCase();
    return estado === "en progreso" || estado === "en proceso";
  }).length;

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/70">
      <div className="flex flex-col justify-between gap-3 border-b border-zinc-200/80 px-6 py-5 sm:flex-row sm:items-center dark:border-zinc-800/80">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Clientes guardados
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Administra el estado de tus clientes o elimina registros en tiempo
            real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            Total: {clientes.length}
          </span>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-300">
            Activos: {activeCount}
          </span>
          <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-sky-700 dark:text-sky-300">
            En progreso: {inProgressCount}
          </span>
        </div>
      </div>

      {(fetchError || actionError) && (
        <div
          role="alert"
          className="mx-6 mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300"
        >
          {actionError ?? fetchError}
        </div>
      )}

      {clientes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Todavía no hay clientes registrados
          </p>
          <p className="max-w-sm text-xs text-zinc-500 dark:text-zinc-400">
            Usa el formulario superior para añadir tu primer cliente y empezar a
            gestionar tu cartera.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200/80 bg-zinc-50/70 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-950/50 dark:text-zinc-400">
                <th className="px-6 py-3.5">Nombre</th>
                <th className="px-6 py-3.5">Empresa</th>
                <th className="px-6 py-3.5">Estado</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-800/70">
              {clientes.map((cliente) => {
                const badgeStyle = getEstadoBadgeClasses(cliente.estado);
                const nextEstado = getNextEstado(cliente.estado);
                const isRowBusy =
                  isPending && pendingAction?.id === cliente.id;
                const isUpdatingStatus =
                  isRowBusy && pendingAction?.type === "status";
                const isDeleting =
                  isRowBusy && pendingAction?.type === "delete";

                return (
                  <tr
                    key={cliente.id}
                    className="transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/35"
                  >
                    <td className="px-6 py-4 font-medium text-zinc-950 dark:text-zinc-100">
                      {cliente.nombre}
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                      {cliente.empresa}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${badgeStyle.badge}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${badgeStyle.dot}`}
                        />
                        {cliente.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleEstado(cliente)}
                          disabled={isPending}
                          title={`Cambiar estado a ${nextEstado}`}
                          className="inline-flex items-center rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-emerald-500/40 dark:hover:text-emerald-300"
                        >
                          {isUpdatingStatus
                            ? "Actualizando..."
                            : "Cambiar estado"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cliente)}
                          disabled={isPending}
                          className="inline-flex items-center rounded-lg border border-rose-200 bg-rose-50/70 px-3 py-1.5 text-xs font-medium text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:border-rose-800 dark:hover:bg-rose-950/70"
                        >
                          {isDeleting ? "Eliminando..." : "Eliminar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export const CLIENTE_ESTADOS = [
  "Prospecto",
  "En progreso",
  "Activo",
  "Inactivo",
] as const;

export type ClienteEstado = (typeof CLIENTE_ESTADOS)[number];

export type Cliente = {
  id: string | number;
  nombre: string;
  empresa: string;
  estado: string;
  user_id: string;
  created_at?: string | null;
};

export function getNextEstado(currentEstado: string): ClienteEstado {
  const index = CLIENTE_ESTADOS.findIndex(
    (estado) => estado.toLowerCase() === currentEstado.trim().toLowerCase(),
  );

  if (index === -1) {
    return "Activo";
  }

  return CLIENTE_ESTADOS[(index + 1) % CLIENTE_ESTADOS.length];
}

export function getEstadoBadgeClasses(estado: string): {
  badge: string;
  dot: string;
} {
  const normalized = estado.trim().toLowerCase();

  if (normalized === "activo") {
    return {
      badge:
        "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      dot: "bg-emerald-500",
    };
  }

  if (normalized === "en progreso" || normalized === "en proceso") {
    return {
      badge: "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
      dot: "bg-sky-500",
    };
  }

  if (normalized === "inactivo") {
    return {
      badge:
        "border-zinc-400/30 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
      dot: "bg-zinc-400",
    };
  }

  return {
    badge:
      "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  };
}

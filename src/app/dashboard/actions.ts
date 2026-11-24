"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { CLIENTE_ESTADOS, getNextEstado } from "./types";

export type ClienteFormState = {
  error?: string;
  success?: string;
  submittedCount?: number;
};

export type ClienteMutationResult = {
  error?: string;
};

function mapDatabaseError(message: string): string {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("relation") &&
    normalized.includes("clientes") &&
    normalized.includes("does not exist")
  ) {
    return 'La tabla "clientes" aún no existe en tu proyecto de Supabase.';
  }
  if (normalized.includes("row-level security")) {
    return "Permiso denegado por las políticas RLS de Supabase en la tabla clientes.";
  }

  return message;
}

export async function createCliente(
  prevState: ClienteFormState,
  formData: FormData,
): Promise<ClienteFormState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const empresa = String(formData.get("empresa") ?? "").trim();
  const estadoRaw = String(formData.get("estado") ?? "").trim();
  const estado = estadoRaw || CLIENTE_ESTADOS[0];

  if (!nombre) {
    return { error: "El nombre del cliente es obligatorio." };
  }

  if (!empresa) {
    return { error: "La empresa es obligatoria." };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Tu sesión expiró. Inicia sesión nuevamente." };
    }

    const { error } = await supabase.from("clientes").insert({
      nombre,
      empresa,
      estado,
      user_id: user.id,
    });

    if (error) {
      return { error: mapDatabaseError(error.message) };
    }
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "No se pudo guardar el cliente en Supabase.";
    return { error: mapDatabaseError(message) };
  }

  revalidatePath("/dashboard");

  return {
    success: `Cliente "${nombre}" agregado correctamente.`,
    submittedCount: (prevState.submittedCount ?? 0) + 1,
  };
}

export async function updateClienteEstado(
  id: string | number,
  currentEstado: string,
): Promise<ClienteMutationResult> {
  const nextEstado = getNextEstado(currentEstado);

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Tu sesión expiró. Inicia sesión nuevamente." };
    }

    const { error } = await supabase
      .from("clientes")
      .update({ estado: nextEstado })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return { error: mapDatabaseError(error.message) };
    }
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "No se pudo actualizar el estado del cliente.";
    return { error: mapDatabaseError(message) };
  }

  revalidatePath("/dashboard");
  return {};
}

export async function deleteCliente(
  id: string | number,
): Promise<ClienteMutationResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Tu sesión expiró. Inicia sesión nuevamente." };
    }

    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return { error: mapDatabaseError(error.message) };
    }
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "No se pudo eliminar el registro.";
    return { error: mapDatabaseError(message) };
  }

  revalidatePath("/dashboard");
  return {};
}

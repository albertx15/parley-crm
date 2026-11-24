"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type AuthActionState = {
  error?: string;
  success?: string;
};

function getSafeRedirectPath(nextPath: string | null): string {
  if (nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")) {
    return nextPath;
  }
  return "/dashboard";
}

function mapSupabaseAuthError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Correo electrónico o contraseña incorrectos.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Tu correo aún no está confirmado. Revisa tu bandeja de entrada.";
  }
  if (normalized.includes("user already registered")) {
    return "Ya existe una cuenta registrada con este correo electrónico.";
  }
  if (normalized.includes("password should be at least")) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }
  if (normalized.includes("unable to validate email address")) {
    return "Ingresa un correo electrónico válido.";
  }
  if (normalized.includes("rate limit") || normalized.includes("too many")) {
    return "Demasiados intentos. Espera un momento e inténtalo nuevamente.";
  }
  if (normalized.includes("missing next_public_supabase")) {
    return "Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local.";
  }

  return message;
}

function validateCredentials(formData: FormData):
  | { ok: true; email: string; password: string }
  | { ok: false; error: string } {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !email.includes("@")) {
    return { ok: false, error: "Ingresa un correo electrónico válido." };
  }

  if (password.length < 6) {
    return {
      ok: false,
      error: "La contraseña debe tener al menos 6 caracteres.",
    };
  }

  return { ok: true, email, password };
}

export async function login(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = validateCredentials(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const nextPath = getSafeRedirectPath(
    formData.get("next") ? String(formData.get("next")) : null,
  );

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.email,
      password: parsed.password,
    });

    if (error) {
      return { error: mapSupabaseAuthError(error.message) };
    }
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "No se pudo conectar con Supabase.";
    return { error: mapSupabaseAuthError(message) };
  }

  revalidatePath("/", "layout");
  redirect(nextPath);
}

export async function signup(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = validateCredentials(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  let hasImmediateSession = false;

  try {
    const supabase = await createClient();
    const headerStore = await headers();
    const origin =
      headerStore.get("origin") ??
      (headerStore.get("host") ? `http://${headerStore.get("host")}` : "");

    const { data, error } = await supabase.auth.signUp({
      email: parsed.email,
      password: parsed.password,
      options: origin
        ? {
            emailRedirectTo: `${origin}/auth/confirm`,
          }
        : undefined,
    });

    if (error) {
      return { error: mapSupabaseAuthError(error.message) };
    }

    // When email confirmation is enabled and the user already exists,
    // Supabase returns a user with an empty identities array.
    if (data.user && data.user.identities?.length === 0) {
      return {
        error: "Ya existe una cuenta registrada con este correo electrónico.",
      };
    }

    hasImmediateSession = Boolean(data.session);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "No se pudo conectar con Supabase.";
    return { error: mapSupabaseAuthError(message) };
  }

  if (hasImmediateSession) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  return {
    success:
      "Cuenta creada correctamente. Revisa tu correo electrónico para confirmar tu cuenta antes de iniciar sesión.",
  };
}

export async function signout(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore errors when signing out without credentials configured.
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

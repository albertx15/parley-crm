"use client";

import { useActionState, useState } from "react";
import { login, signup, type AuthActionState } from "@/app/auth/actions";

type AuthMode = "login" | "signup";

type LoginFormProps = {
  isSupabaseConfigured: boolean;
  initialError?: string;
  initialMessage?: string;
  nextPath?: string;
};

const initialState: AuthActionState = {};

export function LoginForm({
  isSupabaseConfigured,
  initialError,
  initialMessage,
  nextPath,
}: LoginFormProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);

  const [loginState, loginAction, isLoginPending] = useActionState(
    login,
    initialState,
  );
  const [signupState, signupAction, isSignupPending] = useActionState(
    signup,
    initialState,
  );

  const isLogin = mode === "login";
  const isPending = isLogin ? isLoginPending : isSignupPending;
  const activeState = isLogin ? loginState : signupState;
  const formAction = isLogin ? loginAction : signupAction;

  const errorMessage = activeState.error ?? initialError;
  const successMessage = activeState.success ?? initialMessage;

  return (
    <div className="w-full rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/75">
      {/* Mode switcher */}
      <div
        role="tablist"
        aria-label="Modo de autenticación"
        className="mb-6 grid grid-cols-2 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-950"
      >
        <button
          type="button"
          role="tab"
          aria-selected={isLogin}
          onClick={() => setMode("login")}
          disabled={isPending}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer ${
            isLogin
              ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-800 dark:text-zinc-50"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!isLogin}
          onClick={() => setMode("signup")}
          disabled={isPending}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer ${
            !isLogin
              ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-800 dark:text-zinc-50"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          Registrarse
        </button>
      </div>

      {/* Header copy */}
      <div className="mb-6 space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {isLogin
            ? "Ingresa tu correo y contraseña para acceder a tu panel."
            : "Regístrate con tu correo y una contraseña de al menos 6 caracteres."}
        </p>
      </div>

      {/* Missing env warning */}
      {!isSupabaseConfigured && (
        <div className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
          Configura{" "}
          <code className="font-mono font-semibold">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          y{" "}
          <code className="font-mono font-semibold">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          en <code className="font-mono font-semibold">.env.local</code> para
          habilitar el inicio de sesión.
        </div>
      )}

      {/* Feedback alerts */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300"
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-300"
        >
          {successMessage}
        </div>
      )}

      {/* Auth form */}
      <form action={formAction} className="space-y-4">
        {nextPath && <input type="hidden" name="next" value={nextPath} />}

        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="tu@correo.com"
            disabled={isPending}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-950 placeholder:text-zinc-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              autoComplete={isLogin ? "current-password" : "new-password"}
              placeholder="••••••••"
              disabled={isPending}
              className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-3.5 pr-11 text-sm text-zinc-950 placeholder:text-zinc-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 transition-colors hover:text-zinc-600 cursor-pointer dark:hover:text-zinc-200"
            >
              {showPassword ? (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400"
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {isLogin ? "Iniciando sesión..." : "Creando cuenta..."}
            </>
          ) : isLogin ? (
            "Iniciar sesión"
          ) : (
            "Crear cuenta"
          )}
        </button>
      </form>

      {/* Secondary switcher prompt */}
      <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        {isLogin ? "¿Aún no tienes cuenta? " : "¿Ya tienes una cuenta? "}
        <button
          type="button"
          onClick={() => setMode(isLogin ? "signup" : "login")}
          disabled={isPending}
          className="font-medium text-emerald-600 hover:text-emerald-500 cursor-pointer dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          {isLogin ? "Regístrate aquí" : "Inicia sesión"}
        </button>
      </p>
    </div>
  );
}

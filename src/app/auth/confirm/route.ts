import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const rawNext = searchParams.get("next");
  const next =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/dashboard";

  const redirectTo = request.nextUrl.clone();
  redirectTo.search = "";

  if (token_hash && type) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });

      if (!error) {
        redirectTo.pathname = next;
        return NextResponse.redirect(redirectTo);
      }
    } catch {
      // Fall through to login error redirect.
    }
  }

  redirectTo.pathname = "/login";
  redirectTo.searchParams.set(
    "error",
    "El enlace de verificación no es válido o expiró. Intenta nuevamente.",
  );
  return NextResponse.redirect(redirectTo);
}

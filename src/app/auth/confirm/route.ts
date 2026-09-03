import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createServerAuthClient } from "@/lib/supabase/server";

/**
 * Destino de los enlaces de invitación/recuperación de contraseña que envía
 * Supabase (configurados como Site URL + esta ruta en el panel de Auth).
 * Verifica el token, deja la sesión creada, y manda a poner contraseña si
 * viene de una invitación.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/set-password";

  if (tokenHash && type) {
    const supabase = await createServerAuthClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("El enlace no es válido o ha caducado.")}`
  );
}

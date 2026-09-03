"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

/**
 * Red de seguridad para el enlace "clásico" que sigue mandando Supabase en
 * los correos de invitación/recuperación pese a configurar la plantilla con
 * token_hash (ver /auth/confirm): en vez de un query param, mete
 * access_token/refresh_token detrás de un "#" en la URL. Ese fragmento nunca
 * llega al servidor (ni al middleware, ni a las Route Handlers) — solo el
 * navegador lo ve. Este componente, montado en el layout raíz, lo detecta y
 * completa la sesión a mano.
 */
export function AuthHashHandler() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes("access_token=")) return;

    const params = new URLSearchParams(hash.slice(1));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const type = params.get("type");
    if (!access_token || !refresh_token) return;

    const supabase = createBrowserSupabaseClient();
    supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
      // Limpia el fragmento de la URL para no dejar los tokens a la vista.
      window.history.replaceState(null, "", window.location.pathname);
      if (error) return;
      router.replace(type === "invite" || type === "recovery" ? "/set-password" : "/");
      router.refresh();
    });
  }, [router]);

  return null;
}

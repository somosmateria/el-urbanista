import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/types";

/**
 * Cliente con service_role: bypassa RLS. Solo se usa en Server Components,
 * Server Actions y Route Handlers — nunca en código que llegue al navegador.
 * Toda la autorización (quién puede ver/editar qué) se resuelve en el
 * servidor, no con políticas RLS por usuario (ver nota en la migración 0001).
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno."
    );
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Cliente con la anon key y la sesión del usuario (cookies) — solo para
 * autenticación (login/logout/leer el usuario actual) en Server Components
 * y Server Actions. No se usa para leer/escribir datos de la app; eso sigue
 * yendo por `createServiceClient()`.
 */
export async function createServerAuthClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Llamado desde un Server Component (no se pueden fijar cookies
            // ahí) — el middleware se encarga de refrescar la sesión.
          }
        },
      },
    }
  );
}
